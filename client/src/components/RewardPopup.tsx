import { X } from "lucide-react";
import Confetti from "./Confetti";

interface RewardPopupProps {
  reward: number;
  onClose: () => void;
}

export default function RewardPopup({ reward, onClose }: RewardPopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
      }}
      data-testid="reward-popup"
    >
      <Confetti />

      <div
        className="relative max-w-sm w-full rounded-[32px] p-12 animate-scale-in"
        style={{
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover-elevate active-elevate-2"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
          }}
          data-testid="button-close-popup"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-7xl animate-pulse-glow">🎉</div>

          <h2
            className="text-2xl font-black uppercase tracking-wider text-white"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            WYGRAŁEŚ!
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-6xl">⭐</span>
            <span
              className="text-7xl font-black text-white"
              style={{
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.5)",
              }}
            >
              {reward}
            </span>
          </div>

          <p className="text-lg text-white/90 font-medium">Gratulacje!</p>
        </div>
      </div>
    </div>
  );
}