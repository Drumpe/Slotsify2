import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

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
    // console.log('Login response:', data, error)
    setLoading(false)
  }

  return (
    <>
    <div className="flex items-center justify-center w-full ">
      <div className="w-full mx-auto p-5 bg-blue-200 rounded">
      <img src="/images/cherry_symbol.png" alt="Slotsify2-Cherry" className='mx-auto max-w-80 shadow-xl bg-red-400'/>
      <p className="text-center text-red-900 p-5 font-shantell text-6xl">
        Slotsify2
        </p>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm mx-auto p-4 rounded-xl shadow-2xl bg-red-400 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded0"
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
          className="w-full py-2 bg-red-800 text-white rounded hover:bg-pink-900"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && <p className="text-sm text-center text-red-900">{message}</p>}
      </form>
      <div className="text-sm text-center mt-2">
        Don’t have an account yet?{' '}
        <Link to="/signup" className="text-pink-900 text-lg hover:underline hover:text-xl ">
          Sign up here
        </Link>
      </div>
      </div>
      </div>
    </>
  )
}
