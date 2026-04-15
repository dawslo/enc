
import { Button } from "@/components/ui/button";

interface RechargeButtonProps {
  onClick: () => void;
}

export default function RechargeButton({ onClick }: RechargeButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="lg"
      className="relative w-full h-12 sm:h-14 text-base sm:text-lg font-bold border-3 border-purple-300/60 bg-purple-900/30 backdrop-blur-md text-purple-100 hover:bg-purple-800/40 active:bg-purple-800/60 hover:border-purple-200 transition-all duration-200 touch-manipulation select-none shadow-lg hover:shadow-2xl overflow-hidden"
      style={{
        boxShadow: "0 4px 20px rgba(168, 85, 247, 0.4), inset 0 1px 10px rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse" />
      <span className="relative z-10 flex items-center gap-2">
        💎 Get More Stars 💎
      </span>
    </Button>
  );
}
