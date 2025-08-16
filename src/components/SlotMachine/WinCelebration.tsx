import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext'


interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  emoji: string;
}

export default function WinCelebration() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { payout, setCelebration, showCelebration } = useGame()
  useEffect(() => {
    // Create particles
    const newParticles: Particle[] = [];
    const particleCount = Math.min(30, Math.max(10, payout / 10));
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00FA9A', '#87CEEB'];
    const emojis = ['🎉', '⭐', '💎', '🏆', '🎊', '✨', '💫', '🌟'];

    console.log(`In celebration ${payout}`)
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      });
    }

    setParticles(newParticles);

    // Clear particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => {
      clearTimeout(timer);
    }
  }, [showCelebration]);

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

      {/* Animated particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: particle.x, 
            y: particle.y,
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            x: particle.x + particle.vx * 100,
            y: particle.y + particle.vy * 100,
            opacity: 0,
            scale: [0, 1, 0],
            rotate: 360
          }}
          transition={{ 
            duration: 3,
            ease: "easeOut"
          }}
          className="absolute text-2xl pointer-events-none"
          style={{ color: particle.color }}
        >
          {particle.emoji}
        </motion.div>
      ))}

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
            duration: 1.5,
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
            backgroundColor: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00FA9A'][i % 5]
          }}
        />
      ))}
    </div>
  );
}