import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'

const SpinButton = () => {
  const { stake, isSpinning, setIsSpinning, isTweening, setIsTweening, setBalance, setSpinResult } = useGame()
  const { user } = useAuth()

  const handleSpin = async () => {
    if (isSpinning) return
    setIsSpinning(true)
    //TODO: minska coins med stake
    try {
       
      console.log(`Spinning: userId: ${user?.id}, stake: ${stake}`)

      const response = await fetch('/.netlify/functions/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, stake}),
      })

      const result = await response.json()
      console.log('Spin result:', result.result)
      if (response.ok) {
        setBalance(result.newBalance)
        setSpinResult(result.result)
        // TODO: borde sätta isWin och payout i GameContext
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
    <button onClick={handleSpin} disabled={isSpinning || isTweening}>
      {isSpinning || isTweening ? 'Spinning...' : 'Spin'}
    </button>
  )
}

export default SpinButton

