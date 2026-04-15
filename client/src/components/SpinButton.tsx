
import { Button } from "@/components/ui/button";

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export default function SpinButton({ onClick, disabled, isSpinning }: SpinButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="relative w-full h-16 sm:h-20 text-xl sm:text-2xl font-black overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 active:from-yellow-600 active:via-orange-700 active:to-red-700 text-white shadow-2xl transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation select-none border-4 border-yellow-300/50 animate__animated animate__pulse animate__infinite animate__slower"
      style={{
        textShadow: "0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(255, 165, 0, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 215, 0, 0.5)",
      }}
    >
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
          style={{
            animation: "shimmer 2s infinite",
            backgroundSize: "200% 100%",
          }}
        />
      )}
      <span className="relative z-10 drop-shadow-lg">
        {isSpinning ? (
          <>
            <span className="animate__animated animate__rotateIn animate__infinite">🎰</span> SPINNING... <span className="animate__animated animate__rotateIn animate__infinite">🎰</span>
          </>
        ) : (
          <>
            🎯 SPIN NOW! (10 ⭐) 🎯
          </>
        )}
      </span>
    </Button>
  );
}
