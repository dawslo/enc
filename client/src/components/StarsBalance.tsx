
import { useEffect, useState } from "react";

interface StarsBalanceProps {
  stars: number;
  animate?: boolean;
}

export default function StarsBalance({ stars, animate }: StarsBalanceProps) {
  const [displayStars, setDisplayStars] = useState(stars);

  useEffect(() => {
    if (animate) {
      const duration = 500;
      const steps = 20;
      const increment = (stars - displayStars) / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayStars(stars);
          clearInterval(interval);
        } else {
          setDisplayStars(prev => prev + increment);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setDisplayStars(stars);
    }
  }, [stars, animate]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-xl border-2 border-white/40 shadow-2xl ${
        animate ? "animate__animated animate__pulse animate__fast" : ""
      }`}
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 215, 0, 0.4)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-purple-400/10 animate-pulse" />
      
      <div className="relative text-center">
        <div className="text-xs sm:text-sm font-bold text-white/90 mb-1 sm:mb-2 tracking-wider uppercase">
          Your Balance
        </div>
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-4xl sm:text-5xl md:text-6xl animate__animated animate__rubberBand animate__infinite animate__slow">
            ⭐
          </span>
          <span
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white tabular-nums"
            style={{
              textShadow: "0 2px 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6), 0 4px 20px rgba(0, 0, 0, 0.5)",
              letterSpacing: "0.02em",
            }}
          >
            {Math.floor(displayStars)}
          </span>
        </div>
        <div className="mt-2 text-xs sm:text-sm font-semibold text-yellow-200/90 animate__animated animate__fadeIn">
          ✨ Stars ✨
        </div>
      </div>

      {animate && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 to-transparent animate-pulse" />
        </div>
      )}
    </div>
  );
}
