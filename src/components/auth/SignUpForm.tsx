import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function SignUpForm() {
  const { setUser } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  const validateUsername = (name: string) => {
    // Example: letters, numbers, underscores, 3-20 chars
    const regex = /^[a-zA-Z0-9_]{3,20}$/
    return regex.test(name)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!validateUsername(username)) {
      setMessage(
        'Username must be 3-20 characters and only contain letters, numbers, or underscores.'
      )
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      try {
        const response = await fetch('/.netlify/functions/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            username: username.toLowerCase(),
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText)
        }

        setUser(data.user)
        setMessage('Signup successful! Check your email to confirm.')
        navigate('/')
      } catch (err: any) {
        setMessage('Signup succeeded, but profile creation failed: ' + err.message)
      }
    }

    setLoading(false)
  }

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="w-full mx-auto p-5 bg-blue-200 rounded">
          <img src="/images/cherry_symbol.png" alt="Slotsify2-Cherry" 
          className='mx-auto max-w-60 shadow-xl bg-red-400' />
          <p className="text-center text-red-900 p-5 font-shantell text-6xl">
            Slotsify2
          </p>
          <form
            onSubmit={handleSignUp}
            className="w-full max-w-sm mx-auto p-4 rounded-xl shadow-2xl bg-red-400 space-y-4"
          >
            <h2 className="text-xl font-bold text-center">Create Account</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {message && <p className="text-sm text-center text-red-600">{message}</p>}
          </form>
          <div className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
