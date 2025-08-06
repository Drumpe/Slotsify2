import { useGame } from '../../context/GameContext'

const HeaderBar = () => {
  const { balance, username } = useGame()

  return (
    <div className="header-bar">
      <h2>{username && `Welcome, ${username}`}</h2>
      <h3>Coins: {balance}</h3>
    </div>
  )
}

export default HeaderBar