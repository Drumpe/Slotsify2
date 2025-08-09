import { createContext, useContext, useState } from 'react';

type GameContextType = {
  stake: number;
  setStake: React.Dispatch<React.SetStateAction<number>>;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  payout: number;
  setPayout: React.Dispatch<React.SetStateAction<number>>;
  isSpinning: boolean;
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  isWin: boolean;
  setIsWin: React.Dispatch<React.SetStateAction<boolean>>;
  isTweening: boolean;
  setIsTweening: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  spinResult: number[] | null;
  setSpinResult: (val: number[] | null) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);


export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [stake, setStake] = useState(1);
  const [balance, setBalance] = useState();
  const [coins, setCoins] = useState();
  const [payout, setPayout] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isTweening, setIsTweening] = useState(false);
  const [username, setUsername] = useState('');
  const [spinResult, setSpinResult] = useState<number[] | null>(null);

  return (
    <GameContext.Provider value={{
      stake, setStake, 
      balance, setBalance,
      coins, setCoins,
      payout, setPayout,
      isWin, setIsWin,
      isSpinning, setIsSpinning,
      isTweening, setIsTweening,
      username, setUsername, 
      spinResult, setSpinResult,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
