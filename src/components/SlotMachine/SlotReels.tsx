
const SYMBOLS = ['🍒', '🔔', '🍋', '⭐', '7️⃣', '💎'];

function SlotReels() {
  return (
    <div className="flex gap-4 my-6">
      {Array.from({ length: 3 }).map((_, reelIndex) => (
        <div key={reelIndex} className="bg-gray-700 rounded-lg p-2 w-20 h-48 flex flex-col justify-center items-center overflow-hidden shadow-md border-2 border-gray-300">
          {Array.from({ length: 3 }).map((_, symbolIndex) => {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            return (
              <div key={symbolIndex} className="text-4xl my-2 transition-transform duration-300 ease-in-out">
                {symbol}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default SlotReels;
