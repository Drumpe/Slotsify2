import { useGame } from '../../context/GameContext';

function BetSelector() {
  const { stake, setStake } = useGame();

  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => setStake((s) => Math.max(1, s - 1))}>-</button>
      <span className="text-lg font-bold">{stake}</span>
      <button onClick={() => setStake((s) => s + 1)}>+</button>
    </div>
  );
}

export default BetSelector;