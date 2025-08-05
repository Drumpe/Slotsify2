import HeaderBar from '../components/UI/HeaderBar';
import BetSelector from '../components/SlotMachine/BetSelector';
import SpinButton from '../components/SlotMachine/SpinButton';
import Paytable from '../components/SlotMachine/Paytable';
import SlotReels from '../components/SlotMachine/SlotReels';

function Game() {
  return (
    <div className="flex flex-col items-center p-4">
      <HeaderBar />
      <SlotReels />
      <BetSelector />
      <SpinButton />
      <Paytable />
    </div>
  );
}

export default Game;