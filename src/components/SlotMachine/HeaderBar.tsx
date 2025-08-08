import { useEffect, useRef } from 'react'
import { useGame } from '../../context/GameContext'

const HeaderBar = () => {
  const { balance, isTweening } = useGame()
  const coinRef = useRef(0);
  const winMessageRef = useRef('');

  useEffect(() => {
    if (isTweening) return;

    
  }, [isTweening]);

  return (
    <div className="header-bar">
      <h3>Coins: { coinRef.current }</h3>
    </div>
  )
}

export default HeaderBar