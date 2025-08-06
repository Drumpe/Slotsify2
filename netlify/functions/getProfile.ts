import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  try {
    const { userId } = JSON.parse(event.body || '{}')

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing userId' }),
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, coins')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ username: profile.username, coins: profile.coins }),
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    }
  }
}

export { handler }
