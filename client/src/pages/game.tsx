import { useEffect, useMemo, useState } from "react";
import StarsBalance from "@/components/StarsBalance";
import SpinningWheel from "@/components/SpinningWheel";
import SpinButton from "@/components/SpinButton";
import RechargeButton from "@/components/RechargeButton";
import RewardPopup from "@/components/RewardPopup";
import { Button } from "@/components/ui/button";
import { useTelegram, initTelegram } from "@/lib/telegram";
import { useToast } from "@/hooks/use-toast";
import { useStars } from "@/hooks/use-stars";

const SPIN_COST = 10;
const DAILY_BONUS_AMOUNT = 25;
const MAX_HISTORY = 6;

export default function GamePage() {
  const { stars, spend, addStars, claimBonus, bonusAvailable, lastBonusDay, initialized } = useStars(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastReward, setLastReward] = useState(0);
  const [animateBalance, setAnimateBalance] = useState(false);
  const [recentSpins, setRecentSpins] = useState<number[]>([]);
  const [totals, setTotals] = useState({ won: 0, spent: 0 });

  const { triggerHaptic, showRechargePopup, isTelegram } = useTelegram();
  const { toast } = useToast();

  useEffect(() => {
    initTelegram();
  }, []);

  const canSpin = useMemo(() => {
    if (!initialized) return false;
    return stars >= SPIN_COST && !isSpinning;
  }, [initialized, stars, isSpinning]);

  const handleSpin = () => {
    if (!initialized) {
      toast({
        title: "Ładowanie salda…",
        description: "Poczekaj sekundę aż załadujemy gwiazdki.",
      });
      return;
    }

    const result = spend(SPIN_COST);
    if (!result.ok) {
      if (result.reason === "insufficient") {
        toast({
          title: "Za mało gwiazdek",
          description: "Doładuj konto lub odbierz dzienny bonus.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Nie udało się zakręcić",
          description: "Spróbuj ponownie za chwilę.",
          variant: "destructive",
        });
      }
      triggerHaptic("light");
      return;
    }

    triggerHaptic("heavy");
    setTotals(prev => ({ ...prev, spent: prev.spent + SPIN_COST }));
    setIsSpinning(true);
    setAnimateBalance(false);
  };

  const handleSpinComplete = (reward: number) => {
    addStars(reward);
    setIsSpinning(false);
    setLastReward(reward);
    setAnimateBalance(true);
    setShowReward(true);
    setTotals(prev => ({ ...prev, won: prev.won + reward }));
    setRecentSpins(prev => [reward, ...prev].slice(0, MAX_HISTORY));
    triggerHaptic("heavy");

    setTimeout(() => {
      triggerHaptic("medium");
    }, 100);
  };

  const handleRecharge = () => {
    triggerHaptic("light");
    showRechargePopup((packageId) => {
      const amount = parseInt(packageId, 10);
      const result = addStars(amount);
      if (result.ok) {
        setAnimateBalance(true);
        setTotals(prev => ({ ...prev, won: prev.won + amount }));
        triggerHaptic("medium");
        toast({
          title: "Doładowano",
          description: `Dodano ${amount}⭐ do twojego salda.`,
        });
      } else {
        toast({
          title: "Błąd doładowania",
          description: "Nie udało się dodać gwiazdek.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDailyBonus = () => {
    const result = claimBonus(DAILY_BONUS_AMOUNT);
    if (result.ok) {
      setAnimateBalance(true);
      setTotals(prev => ({ ...prev, won: prev.won + result.amount }));
      triggerHaptic("medium");
      toast({
        title: "Przyznano dzienny bonus",
        description: `+${result.amount}⭐ dodane do salda.`,
      });
    } else {
      toast({
        title: "Bonus już odebrany",
        description: "Wróć jutro po kolejną porcję gwiazdek.",
        variant: "destructive",
      });
      triggerHaptic("light");
    }
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
      </div>

      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div
          className="rounded-2xl p-4 border-2 border-white/30 bg-white/10 backdrop-blur-md shadow-xl flex flex-col gap-2"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-semibold">Bonus dzienny</span>
            <span className="text-xs text-white/80">
              {bonusAvailable ? "Dostępny teraz" : lastBonusDay ? `Odebrano ${lastBonusDay}` : "Jeszcze nie odebrano"}
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            disabled={!bonusAvailable}
            onClick={handleDailyBonus}
            className="font-bold bg-yellow-500/90 text-purple-900 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {bonusAvailable ? `Odbierz +${DAILY_BONUS_AMOUNT}⭐` : "Jutro nowy bonus"}
          </Button>
        </div>

        <div
          className="rounded-2xl p-4 border-2 border-white/30 bg-white/10 backdrop-blur-md shadow-xl text-white space-y-2"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Statystyki</span>
            <span className="text-xs text-white/80">Sesja</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Wydano</span>
            <span className="font-bold">{totals.spent}⭐</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Zdobyto</span>
            <span className="font-bold text-yellow-200">{totals.won}⭐</span>
          </div>
        </div>
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
          disabled={!canSpin}
          isSpinning={isSpinning}
        />
        <div className="flex justify-center">
          <RechargeButton onClick={handleRecharge} />
        </div>
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-4 border-2 border-white/25 bg-white/10 backdrop-blur-md shadow-lg space-y-3"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center justify-between text-white">
          <h3 className="text-sm font-semibold">Ostatnie zakręcenia</h3>
          <span className="text-xs text-white/70">max {MAX_HISTORY}</span>
        </div>
        {recentSpins.length === 0 ? (
          <p className="text-sm text-white/70">Zakręć, by zobaczyć historię nagród.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentSpins.map((reward, idx) => (
              <span
                key={`${reward}-${idx}`}
                className="px-3 py-2 rounded-xl bg-purple-900/50 text-yellow-200 border border-white/20 text-sm font-semibold shadow"
              >
                +{reward}⭐
              </span>
            ))}
          </div>
        )}
      </div>

      {showReward && (
        <RewardPopup reward={lastReward} onClose={handleCloseReward} />
      )}
    </div>
  );
}
