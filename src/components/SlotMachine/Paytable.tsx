import React from 'react';
import { WIN_TABLE } from '../../../shared/winTable';
import { useGame } from '../../context/GameContext';

const symbols = Array.from({ length: 9 }, (_, i) => `/images/symbol_${i}.webp`);
import symbol_empty from '/images/symbol_empty.webp';

const SYMBOL_IMAGES: Record<string, string> = { '*': symbol_empty };
for (let i = 0; i <= 8; i++) {
  SYMBOL_IMAGES[i.toString()] = symbols[i];
}

const PayTable: React.FC = () => {
  const { stake } = useGame()
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Pay Table</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2 text-left">Combination</th>
            <th className="py-2 text-right">Payout</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(WIN_TABLE).map(([combination, payout], idx) => {
            const symbols = combination.split(',');
            return (
              <tr key={idx} className="border-b border-gray-700">
                <td className="py-2 flex gap-1 items-center">
                  {symbols.map((sym, i) =>
                      <img
                        key={i}
                        src={SYMBOL_IMAGES[sym]}
                        alt={`symbol ${sym}`}
                        className="w-8 h-8"
                      />
                    )
                  }
                </td>
                <td className="py-2 text-right text-green-400 font-bold">{payout * stake}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PayTable;
