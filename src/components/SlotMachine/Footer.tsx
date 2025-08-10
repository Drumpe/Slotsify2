import BetSelector from './BetSelector';
import SpinButton from './SpinButton';

const Footer = () => {


  return (
    <div className="fixed flex justify-between items-center bottom-0 left-0 right-0 z-50 bg-blue-400 p-4">
      <div className="gap-2 sm:gap-4">
        <BetSelector />
      </div>
      <div className="gap-5 sm:gap-2">
        <SpinButton />
      </div>
    </div>
  )
}


export default Footer