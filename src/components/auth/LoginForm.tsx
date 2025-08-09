import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

//TODO: update balance and coins after login

export default function LoginForm() {
  const { setUser } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else if (data.user) {
      setUser(data.user)
      if (data.user) {
        setUser(data.user)
        setMessage('Login successful!')
        navigate('/Game')
      }

    }
    console.log('Login response:', data, error)
    setLoading(false)
  }

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="max-w-sm mx-auto p-4 rounded-xl shadow-xl space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

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
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && <p className="text-sm text-center text-red-600">{message}</p>}
      </form>
      <div className="text-sm text-center mt-2">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up here
        </Link>
      </div>
    </>
  )
}
