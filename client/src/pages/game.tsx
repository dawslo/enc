import { useEffect, useState } from "react";
import { Link } from "wouter";
import StarsBalance from "@/components/StarsBalance";
import SpinningWheel from "@/components/SpinningWheel";
import SpinButton from "@/components/SpinButton";
import RechargeButton from "@/components/RechargeButton";
import RewardPopup from "@/components/RewardPopup";
import { useTelegram, initTelegram } from "@/lib/telegram";

const SPIN_COST = 10;
const STORAGE_KEY = "encro_verse_stars";

export default function GamePage() {
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 100;
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastReward, setLastReward] = useState(0);
  const [animateBalance, setAnimateBalance] = useState(false);

  const { triggerHaptic, showRechargePopup, isTelegram } = useTelegram();

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, stars.toString());
  }, [stars]);

  const handleSpin = () => {
    if (stars < SPIN_COST || isSpinning) return;

    triggerHaptic("heavy");
    setStars(prev => prev - SPIN_COST);
    setIsSpinning(true);
    setAnimateBalance(false);
  };

  const handleSpinComplete = (reward: number) => {
    setIsSpinning(false);
    setLastReward(reward);
    setStars(prev => prev + reward);
    setAnimateBalance(true);
    setShowReward(true);
    triggerHaptic("heavy");

    setTimeout(() => {
      triggerHaptic("medium");
    }, 100);
  };

  const handleRecharge = () => {
    triggerHaptic("light");
    showRechargePopup((packageId) => {
      const amount = parseInt(packageId, 10);
      setStars(prev => prev + amount);
      setAnimateBalance(true);
      triggerHaptic("medium");
    });
  };

  const handleCloseReward = () => {
    setShowReward(false);
    triggerHaptic("light");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 pb-safe safe-area-inset-bottom"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md flex flex-col gap-4 sm:gap-6 pt-2 sm:pt-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1
              className="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2 animate__animated animate__pulse animate__infinite"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.2), 0 0 50px rgba(255, 255, 0, 0.3)",
                letterSpacing: "0.05em",
              }}
            >
              ⭐ENCRO VERSE⭐
            </h1>
            <p className="text-white/90 text-xs sm:text-sm font-bold animate__animated animate__fadeIn">
              🎰 Spin & Win Stars! 🎰
            </p>
          </div>
          {!isTelegram && (
            <div className="ml-2 px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500/20 backdrop-blur-md rounded-xl border-2 border-yellow-400/50">
              <span className="text-yellow-300 text-xs sm:text-sm font-bold">🌐 Tryb Demo</span>
            </div>
          )}
        </div>

        <StarsBalance stars={stars} animate={animateBalance} />

        {/* Cursor AI Link */}
        <Link href="/cursor">
          <a className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            🤖 Chat with Cursor AI
          </a>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center py-4 sm:py-8 min-h-[300px]">
        <SpinningWheel
          isSpinning={isSpinning}
          onSpinComplete={handleSpinComplete}
        />
      </div>

      <div className="w-full max-w-md flex flex-col gap-3 sm:gap-4 pb-2">
        <SpinButton
          onClick={handleSpin}
          disabled={stars < SPIN_COST || isSpinning}
          isSpinning={isSpinning}
        />
        <div className="flex justify-center">
          <RechargeButton onClick={handleRecharge} />
        </div>
      </div>

      {showReward && (
        <RewardPopup reward={lastReward} onClose={handleCloseReward} />
      )}
    </div>
  );
}