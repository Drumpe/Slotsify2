import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { WIN_TABLE } from "./winTable";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SYMBOLS = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const KUMULATIVA_WEIGHTS: number[] = [];
let totalWeight = 0;
for (const weight of WEIGHTS) {
  totalWeight += weight;
  KUMULATIVA_WEIGHTS.push(totalWeight);
}

function chooseSymbol() {
  const randomNumber = Math.random() * totalWeight;

  if (randomNumber < KUMULATIVA_WEIGHTS[0]) return SYMBOLS[0];
  if (randomNumber < KUMULATIVA_WEIGHTS[1]) return SYMBOLS[1];
  if (randomNumber < KUMULATIVA_WEIGHTS[2]) return SYMBOLS[2];
  if (randomNumber < KUMULATIVA_WEIGHTS[3]) return SYMBOLS[3];
  if (randomNumber < KUMULATIVA_WEIGHTS[4]) return SYMBOLS[4];
  if (randomNumber < KUMULATIVA_WEIGHTS[5]) return SYMBOLS[5];
  if (randomNumber < KUMULATIVA_WEIGHTS[6]) return SYMBOLS[6];
  if (randomNumber < KUMULATIVA_WEIGHTS[7]) return SYMBOLS[7];
  return SYMBOLS[8];
}

// Helper to check win and payout
function getPayout(spin, multiplier) {
  const key = spin.join(',')

  // Check for three-of-a-kind
  if (WIN_TABLE[key] !== undefined) return { isWin: true, payout: WIN_TABLE[key] * multiplier }

  // Check for two-of-a-kind
  const twoKey = `${spin[0]},${spin[1]},*`
  if (WIN_TABLE[twoKey] !== undefined && spin[0] === spin[1]) return { isWin: true, payout: WIN_TABLE[twoKey] * multiplier }

  // Check for one-of-a-kind
  const oneKey = `${spin[0]},*,*`
  if (WIN_TABLE[oneKey] !== undefined) return { isWin: true, payout: WIN_TABLE[oneKey] * multiplier }

  // No win
  return { isWin: false, payout: 0 }
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  const { userId, stake } = JSON.parse(event.body || '{}')

  if (!userId || typeof stake !== 'number') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing or invalid parameters' }),
    }
  }
  const betMultiplier = stake;
  // Fetch the user's profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'User profile not found' }),
    }
  }

  const cost = betMultiplier * 10
  const currentCoins = profile.coins
  
  console.log(`Current coins: ${currentCoins}, Bet cost: ${cost}, Bet multiplier: ${betMultiplier}`);

  if (currentCoins < cost) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Not enough coins' }),
    }
  }

  const result = Array.from({ length: 3 }, () => chooseSymbol())

  const { isWin, payout } = getPayout(result, betMultiplier)
  const newBalance = currentCoins - cost + payout

  // Update coins
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ coins: newBalance })
    .eq('id', userId)

  if (updateError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update coins' }),
    }
  }
  
  // Log the spin result in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SPIN] user: ${userId}, bet: ${betMultiplier}, result: [${result}], payout: ${payout}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      result,
      isWin,
      payout,
      newBalance,
    }),
  }
}

export { handler }
