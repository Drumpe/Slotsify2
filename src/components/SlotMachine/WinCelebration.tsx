import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext'

export default function WinCelebration() {
  const { payout } = useGame()

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Main celebration text */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <div className="text-center">
          <motion.h2
            animate={{ 
              scale: [1, 1.5, 3],
            }}
            transition={{ 
              duration: 0.5,
              repeat: 3,
              ease: "easeInOut"
            }}
            className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
          >
            { payout > 500 ? "BIG " : ""} 
            WIN!
          </motion.h2>
        </div>
      </motion.div>

      {/* Firework bursts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`burst-${i}`}
          initial={{ 
            opacity: 0,
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight * 0.7
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 2, 4],
          }}
          transition={{ 
            duration: 2.5,
            delay: i * 0.3,
            ease: "easeOut"
          }}
          className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
        />
      ))}

      {/* Confetti rain */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          initial={{ 
            y: -20,
            x: Math.random() * window.innerWidth,
            opacity: 1,
            rotate: 0
          }}
          animate={{ 
            y: window.innerHeight + 20,
            rotate: 720,
            opacity: 0
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1,
            ease: "linear"
          }}
          className="absolute w-2 h-4 rounded-sm"
          style={{ 
            backgroundColor: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00FA9A'][i]
          }}
        />
      ))}
    </div>
  );
}