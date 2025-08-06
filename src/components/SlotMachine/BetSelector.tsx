import { useGame } from '../../context/GameContext'

const BetSelector = () => {
  const { stake, setStake, isSpinning } = useGame()

  return (
    <div className="my-2">
      <label htmlFor="bet">Bet multiplier: </label>
      <select
        id="bet"
        value={stake}
        disabled={isSpinning}
        onChange={(e) => setStake(Number(e.target.value))}
      >
        {[1, 2, 5, 10].map((val) => (
          <option key={val} value={val}>
            {val}x
          </option>
        ))}
      </select>
    </div>
  )
}

export default BetSelector
