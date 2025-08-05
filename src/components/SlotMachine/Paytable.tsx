const paytable = [
  { pattern: "7️⃣ 7️⃣ 7️⃣", multiplier: 100 },
  { pattern: "🍒 🍒 🍒", multiplier: 25 },
  { pattern: "🔔 🔔 🔔", multiplier: 15 },
  { pattern: "any-two-🍒", multiplier: 5 },
];

function Paytable() {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-sm">
      <h3 className="text-lg font-bold mb-2">Vinsttabell</h3>
      <ul>
        {paytable.map((entry, i) => (
          <li key={i} className="flex justify-between py-1 border-b">
            <span>{entry.pattern}</span>
            <span>x{entry.multiplier}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Paytable;