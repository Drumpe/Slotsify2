import BetSelector from './BetSelector';
import SpinButton from './SpinButton';

const Footer = () => {


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2 sm:gap-4">
        <BetSelector />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <SpinButton />
      </div>
    </div>
  )
}


export default Footer