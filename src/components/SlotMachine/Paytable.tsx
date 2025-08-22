import React from 'react';
import { WIN_TABLE } from '../../../shared/winTable';
import { useGame } from '../../context/GameContext';

const symbols = Array.from({ length: 9 }, (_, i) => `/images/symbol_${i}.webp`);
const symbol_empty = '/images/symbol_empty.webp';

const SYMBOL_IMAGES: Record<string, string> = { "*": symbol_empty };
for (let i = 0; i <= 8; i++) {
  SYMBOL_IMAGES[i.toString()] = symbols[i];
}

const PayTable: React.FC = () => {
  const { stake } = useGame()
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-lg mx-auto">

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-2">
        {Object.entries(WIN_TABLE).map(([combination, payout], idx) => {
          const symbols = combination.split(',');

          return (
            <div
              key={idx}
              className="bg-gray-800 rounded-lg p-4 flex flex-col items-center shadow-md border border-gray-700"
            >
              <div className="flex gap-2 mb-2">
                {symbols.map((sym, i) => (
                  <img
                    key={i}
                    src={SYMBOL_IMAGES[sym]}
                    alt={`symbol ${sym}`}
                    className="w-5 h-5 lg:w-8 lg:h-8 object-contain"
                  />
                ))}
              </div>
              <p className="text-green-400 font-bold">
                {(payout * stake).toLocaleString('sv-se', {useGrouping: true})}
              </p>
              <p className="text-xs text-gray-400">
                Bet x {payout}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PayTable;
