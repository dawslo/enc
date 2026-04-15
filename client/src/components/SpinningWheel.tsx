import { useState, useRef, useEffect } from "react";

interface WheelSegment {
  stars: number;
  color: string;
  emoji: string;
  weight: number;
}

interface SpinningWheelProps {
  onSpinComplete?: (reward: number) => void;
  isSpinning: boolean;
}

const SEGMENTS: WheelSegment[] = [
  { stars: 5, color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", emoji: "⭐", weight: 35 },
  { stars: 10, color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", emoji: "⭐", weight: 25 },
  { stars: 15, color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", emoji: "⭐", weight: 14 },
  { stars: 20, color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", emoji: "⭐", weight: 10 },
  { stars: 25, color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", emoji: "⭐", weight: 6 },
  { stars: 50, color: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", emoji: "⭐", weight: 4 },
  { stars: 75, color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", emoji: "⭐", weight: 3 },
  { stars: 100, color: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)", emoji: "⭐", weight: 3 },
];

export default function SpinningWheel({ onSpinComplete, isSpinning }: SpinningWheelProps) {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSpinning) {
      const totalWeight = SEGMENTS.reduce((total, segment) => total + segment.weight, 0);
      const roll = Math.random() * totalWeight;

      let cumulative = 0;
      let segmentIndex = 0;
      for (let i = 0; i < SEGMENTS.length; i++) {
        cumulative += SEGMENTS[i].weight;
        if (roll <= cumulative) {
          segmentIndex = i;
          break;
        }
      }

      const selectedReward = SEGMENTS[segmentIndex]?.stars ?? SEGMENTS[0].stars;
      const segmentAngle = 360 / SEGMENTS.length;
      const spins = 5 * 360;
      const targetAngle = segmentAngle * segmentIndex + segmentAngle / 2;
      const finalRotation = spins + (360 - targetAngle);

      setRotation(prev => prev + finalRotation);

      const timeout = setTimeout(() => {
        onSpinComplete?.(selectedReward);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isSpinning, onSpinComplete]);

  const segmentAngle = 360 / SEGMENTS.length;

  return (
    <div className="relative flex items-center justify-center w-full h-full min-w-[260px] sm:min-w-[300px] min-h-[260px] sm:min-h-[300px] touch-none" data-testid="spinning-wheel">
      <div
        className="absolute top-0 z-10 animate__animated animate__bounce animate__infinite animate__slow"
        style={{
          width: 0,
          height: 0,
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderTop: "30px solid #FFD700",
          filter: "drop-shadow(0 0 15px rgba(255, 215, 0, 1)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))",
          transform: "translateY(-12px)",
        }}
      />

      <div
        ref={wheelRef}
        className="relative rounded-full"
        style={{
          width: "calc(min(300px, 85vw))",
          height: "calc(min(300px, 85vw))",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(255, 255, 255, 0.15), 0 0 40px rgba(255, 215, 0, 0.3)",
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          border: "4px solid rgba(255, 215, 0, 0.4)",
        }}
      >
        {SEGMENTS.map((segment, index) => {
          const angle = segmentAngle * index;
          return (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: "center",
              }}
            >
              <div
                className="absolute left-1/2 top-0 flex flex-col items-center justify-center"
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: "calc(min(150px, 45vw)) solid transparent",
                  borderRight: "calc(min(150px, 45vw)) solid transparent",
                  borderTop: `calc(min(150px, 45vw)) solid transparent`,
                  background: segment.color,
                  clipPath: `polygon(50% 0%, ${50 + Math.tan((Math.PI * segmentAngle) / 360) * 100}% 100%, ${50 - Math.tan((Math.PI * segmentAngle) / 360) * 100}% 100%)`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{
                    transform: "translateX(-50%) rotate(0deg)",
                  }}
                >
                  <span className="text-2xl sm:text-3xl">{segment.emoji}</span>
                  <span className="text-lg sm:text-xl font-bold text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    {segment.stars}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center animate__animated animate__pulse animate__infinite"
          style={{
            width: "calc(min(70px, 22vw))",
            height: "calc(min(70px, 22vw))",
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.8), inset 0 2px 15px rgba(255, 255, 255, 0.5), 0 4px 20px rgba(0, 0, 0, 0.4)",
            border: "4px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <span className="text-xs sm:text-sm font-black text-purple-900" style={{ textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)" }}>
            🎰
          </span>
        </div>
      </div>
    </div>
  );
}
