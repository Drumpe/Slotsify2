import { useGame } from '../../context/GameContext'

const BetSelector = () => {
  const { stake, setStake, isSpinning } = useGame()

  return (
    <div className="my-2 bg-indigo-300 rounded p-2">
      <label htmlFor="bet">Bet: </label>
      <select
        id="bet"
        value={stake}
        disabled={isSpinning}
        onChange={(e) => setStake(Number(e.target.value))}
        className="
        bg-gradient-to-r from-blue-700 to-blue-900 
        text-white font-bold py-3 p-6 rounded-full 
        shadow-lg  w-40 "
      >
        {[1, 2, 5, 10, 50, 100].map((val) => (
          <option key={val} value={val} className='bg-blue-700 hover:bg-blue-900'>
            {val} {val > 1 ? 'coins':'coin'}
          </option>
        ))}
      </select>
    </div>
  )
}

export default BetSelector
