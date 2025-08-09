import { useEffect, useRef, useState } from 'react'
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
    } else {
      setWinMessage("No winning this time!");
    }
    const timer = setTimeout(() => setWinMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [isTweening]);

  useEffect(() => {
    coinRef.current = coins;
  }, [coins]);

  return (
    <div className="header-bar">
      <h3>Coins: { coinRef.current }    {winMessage}</h3>
    </div>
  )
}

export default HeaderBar