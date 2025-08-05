import { useGame } from '../../context/GameContext';

function SpinButton() {
  const { isSpinning, setIsSpinning } = useGame();

  return (
    <button
      disabled={isSpinning}
      onClick={() => setIsSpinning(true)}
      className="mt-4 bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50"
    >
      Spin
    </button>
  );
}
export default SpinButton;