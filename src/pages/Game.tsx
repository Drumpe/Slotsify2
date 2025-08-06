import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useGame } from '../context/GameContext'
import HeaderBar from '../components/SlotMachine/HeaderBar';
import BetSelector from '../components/SlotMachine/BetSelector';
import SpinButton from '../components/SlotMachine/SpinButton';
import Paytable from '../components/SlotMachine/Paytable';
import SlotReels from '../components/SlotMachine/SlotReels';


const Game = () => {
  const { setBalance, setUsername } = useGame()

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
      } else {
        console.error(result.message)
      }
    }

    fetchUserProfile()
  }, [setBalance, setUsername])

  return (
    <div>
      <HeaderBar />
      <SlotReels />
      <BetSelector />
      <SpinButton />
      <Paytable />
    </div>
  )
}

export default Game