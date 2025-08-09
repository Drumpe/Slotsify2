import { use, useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'

const HeaderBar = () => {
  const { balance, isTweening, coins, payout } = useGame()
  const coinRef = useRef(0);
  const [winMessage, setWinMessage] = useState('');

  useEffect(() => {
    if (isTweening) return;
    coinRef.current = balance;
    if (payout > 0) {
      setWinMessage(`You won ${payout} coins!`);
    }
    const timer = setTimeout(() => setWinMessage(""), 500 + 500*Math.log(payout));
    return () => clearTimeout(timer);
  }, [isTweening]);

  useEffect(() => {
    coinRef.current = coins;
  }, [coins]);

  return (
    <div className="header-bar">
      <h3>Coins: { coinRef.current }</h3>
      <h3>{winMessage} &nbsp; </h3>
    </div>
  )
}

export default HeaderBar