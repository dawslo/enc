import { useEffect, useState } from "react";

const CONFETTI_EMOJIS = ["⭐", "💎", "🎉", "✨", "🌟", "💫"];

interface ConfettiParticle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
}

export default function Confetti() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" data-testid="confetti">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-3xl"
          style={{
            left: `${particle.left}%`,
            top: "-10%",
            animation: `confetti-fall ${particle.duration}s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
}
