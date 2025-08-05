import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const { username, userId } = JSON.parse(event.body || '{}')

  if (!userId || !username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing userId or username' }),
    }
  }

  const { error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert({ id: userId, username: username ,coins: 1000 })

  if (insertError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: insertError.message }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Profile created successfully' }),
  }
}

export { handler }
