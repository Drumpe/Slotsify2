import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'

const SpinButton = () => {
  const { stake, isSpinning, setIsSpinning, isTweening, setIsTweening, balance, setBalance, setSpinResult, setIsWin, setPayout, setCoins } = useGame()
  const { user } = useAuth()

  const handleSpin = async () => {
    if (isSpinning) return
    setIsSpinning(true)
    setCoins(balance - stake)
    try {

      console.log(`Spinning: userId: ${user?.id}, stake: ${stake}`)

      const response = await fetch('/.netlify/functions/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, stake }),
      })


      const result = await response.json()
      console.log('Spin result:', result.result)
      if (response.ok) {
        setBalance(result.newBalance)
        setSpinResult(result.result)
        setIsWin(result.isWin)
        setPayout(result.payout)
        setIsTweening(true)
        console.log('You won:', result.isWin ? 'Yes' : 'No')
        console.log('Payout:', result.payout)
        console.log('New balance:', result.newBalance)
        console.log('Reels:', result.result)
      } else {
        console.error(result.message)
      }
    } catch (error) {
      console.error('Something went wrong during spin', error)
    } finally {
      setIsSpinning(false)
    }
  }

  return (
    <button
      onClick={handleSpin}
      disabled={isSpinning || isTweening}
      className={`
        bg-gradient-to-r from-blue-700 to-blue-900 
        text-white font-bold py-3 p-6 rounded-full 
        shadow-lg  w-40 
        focus:outline-none transition-transform duration-300 ease-in-out
        ${isSpinning || isTweening ? 'scale-95' : 'hover:scale-100'}
      `}
    >
      {isSpinning || isTweening ? 'Spinning...' : 'Spin'}
    </button>
  )
}

export default SpinButton

