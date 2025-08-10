import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useGame } from '../context/GameContext'
import HeaderBar from '../components/SlotMachine/HeaderBar';
import Footer from '../components/SlotMachine/Footer'
import Paytable from '../components/SlotMachine/Paytable';
import SlotReels from '../components/SlotMachine/SlotReels';


const Game = () => {
  const { setBalance, setUsername, setCoins } = useGame()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) return

      const response = await fetch('/.netlify/functions/getProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const result = await response.json()
      if (response.ok) {
        setUsername(result.username)
        setBalance(result.coins)
        setCoins(result.coins)
      } else {
        console.error(result.message)
      }
    }

    fetchUserProfile()
  }, [setBalance, setUsername])

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-blue-100">
      <HeaderBar />
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        <div className="flex-1 flex flex-col justify-center relative">
          <SlotReels />
        </div>
        <div className="hidden md:block md:w-80 md:w-96">
          <Paytable />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Game