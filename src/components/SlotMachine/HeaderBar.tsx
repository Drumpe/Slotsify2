import { use, useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const HeaderBar = () => {
  const { balance, isTweening, isSpinning, coins, payout } = useGame();
  const { user, signOut } = useAuth();
  const coinRef = useRef(0);
  const [winMessage, setWinMessage] = useState('');
  const [justLoggedIn, setJustLoggedIn] = useState(true);

  const navigate = useNavigate()

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setWinMessage(``);
    await signOut();
    navigate('/');
  }

  useEffect(() => {
    if(justLoggedIn) {
      setWinMessage('');
      setJustLoggedIn(false);
      coinRef.current = balance;
      return;
    }
    if (isTweening) return;
    coinRef.current = balance;
    if (isSpinning) {
      setWinMessage(``);
    } else {
      setWinMessage(payout > 0 ? `You won ${payout} coins!` : `Try again`);
    }
  }, [isTweening, isSpinning]);

  useEffect(() => {
    coinRef.current = coins;
  }, [coins]);

  return (
    <div className="flex bg-blue-400 p-3 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-1 font-bold text-yellow-400 h-8">
        <span>🪙 {coinRef.current.toLocaleString()}</span>
      </div>
      <div className="flex-1 text-center font-bold gap-1 text-yellow-400 animate-pulse">
        <span>{winMessage}</span>
      </div>
      {user && (
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-red-300 rounded-full hover:bg-red-700"
        >
          Sign Out
        </button>
      )}
    </div>
  )
}

export default HeaderBar