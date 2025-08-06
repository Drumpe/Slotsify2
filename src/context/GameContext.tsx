import { createContext, useContext, useState } from 'react';

type GameContextType = {
  stake: number;
  setStake: React.Dispatch<React.SetStateAction<number>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  isSpinning: boolean;
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);


export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [stake, setStake] = useState(1);
  const [balance, setBalance] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <GameContext.Provider value={{ stake, setStake, balance, setBalance, isSpinning, setIsSpinning, username, setUsername }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
