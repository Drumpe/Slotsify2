import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { WIN_TABLE } from "../../shared/winTable";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SYMBOLS = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const WEIGHTS = [11, 12, 13, 14, 15, 16, 17, 18, 19]

const KUMULATIVA_WEIGHTS: number[] = [];
let totalWeight = 0;
for (const weight of WEIGHTS) {
  totalWeight += weight;
  KUMULATIVA_WEIGHTS.push(totalWeight);
}

// Binary search on sorted array
function bisectLeft(arr, x) {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    const mid = (low + high) >> 1;
    if (arr[mid] < x) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

function chooseSymbol() {
  const randomNumber = Math.random() * totalWeight;
  //Little bit faster than 
  return bisectLeft(KUMULATIVA_WEIGHTS, randomNumber);

  // if (randomNumber < KUMULATIVA_WEIGHTS[0]) return SYMBOLS[0];
  // if (randomNumber < KUMULATIVA_WEIGHTS[1]) return SYMBOLS[1];
  // if (randomNumber < KUMULATIVA_WEIGHTS[2]) return SYMBOLS[2];
  // if (randomNumber < KUMULATIVA_WEIGHTS[3]) return SYMBOLS[3];
  // if (randomNumber < KUMULATIVA_WEIGHTS[4]) return SYMBOLS[4];
  // if (randomNumber < KUMULATIVA_WEIGHTS[5]) return SYMBOLS[5];
  // if (randomNumber < KUMULATIVA_WEIGHTS[6]) return SYMBOLS[6];
  // if (randomNumber < KUMULATIVA_WEIGHTS[7]) return SYMBOLS[7];
  // return SYMBOLS[8];
}

// Helper to check win and payout
function getPayout(spin, stake) {
  let payoutAmount = 0;

  // Check for three-of-a-kind
  if (spin[0] === spin[1] && spin[1] === spin[2]) {
    payoutAmount = WIN_TABLE[`${spin[0]},${spin[1]},${spin[2]}`] || 0;
  }
  // Check for two-of-a-kind
  else if (spin[0] === spin[1]) {
    payoutAmount = WIN_TABLE[`${spin[0]},${spin[1]},*`] || 0;
  }
  // Check for one-of-a-kind
  else {
    payoutAmount = WIN_TABLE[`${spin[0]},*,*`] || 0;
  }
  
  return { isWin: payoutAmount > 0, payout: payoutAmount * stake };
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

  const currentCoins = profile.coins

  if (currentCoins < stake) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Not enough coins' }),
    }
  }

  const result = Array.from({ length: 3 }, () => chooseSymbol())

  const { isWin, payout } = getPayout(result, stake)
  const newBalance = currentCoins - stake + payout

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

  console.log(`[SPIN] user: ${userId}, bet: ${stake}, result: [${result}], payout: ${payout}`);

  interface SpinData {
    result: number[];
    isWin: boolean;
    payout: number;
    newBalance: number;
  }
  const data: SpinData = { result, isWin, payout, newBalance };

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  }
}

export { handler }
