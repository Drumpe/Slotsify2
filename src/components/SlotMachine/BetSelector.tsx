import { useGame } from '../../context/GameContext'

const BetSelector = () => {
  const { stake, setStake, isSpinning } = useGame()

  return (
    <div className="my-2 bg-yellow-200">
      <label htmlFor="bet">Bet: </label>
      <select
        id="bet"
        value={stake}
        disabled={isSpinning}
        onChange={(e) => setStake(Number(e.target.value))}
        className="ml-2 p-1 bg-yellow"
      >
        {[1, 2, 5, 10, 50, 100].map((val) => (
          <option key={val} value={val}>
            {val} {val > 1 ? 'coins':'coin'}
          </option>
        ))}
      </select>
    </div>
  )
}

export default BetSelector
