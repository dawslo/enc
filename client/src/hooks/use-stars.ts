import { useEffect, useMemo, useState } from "react";

const STAR_STORAGE_KEY = "encro_verse_stars";
const BONUS_STORAGE_KEY = "encro_verse_daily_bonus";
const DEFAULT_STARS = 100;

type SpendResult =
  | { ok: true }
  | { ok: false; reason: "uninitialized" | "insufficient" | "invalid" };

type AddResult =
  | { ok: true }
  | { ok: false; reason: "invalid" };

type BonusResult =
  | { ok: true; amount: number }
  | { ok: false; reason: "uninitialized" | "already-claimed" };

const todayKey = () => new Date().toISOString().slice(0, 10);

const safeNumberFromStorage = (key: string, fallback: number) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore write failures in restrictive environments
  }
};

export function useStars(initialValue: number = DEFAULT_STARS) {
  const [stars, setStars] = useState(initialValue);
  const [initialized, setInitialized] = useState(false);
  const [lastBonusDay, setLastBonusDay] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedStars = safeNumberFromStorage(STAR_STORAGE_KEY, initialValue);
    const storedBonus = (() => {
      try {
        return localStorage.getItem(BONUS_STORAGE_KEY);
      } catch {
        return null;
      }
    })();

    setStars(storedStars);
    setLastBonusDay(storedBonus);
    setInitialized(true);
  }, [initialValue]);

  useEffect(() => {
    if (!initialized) return;
    safeSetStorage(STAR_STORAGE_KEY, stars.toString());
  }, [stars, initialized]);

  const bonusAvailable = useMemo(() => {
    if (!initialized) return false;
    return lastBonusDay !== todayKey();
  }, [initialized, lastBonusDay]);

  const spend = (cost: number): SpendResult => {
    if (!initialized) return { ok: false, reason: "uninitialized" };
    if (!Number.isFinite(cost) || cost <= 0) return { ok: false, reason: "invalid" };
    if (stars < cost) return { ok: false, reason: "insufficient" };

    setStars(prev => Math.max(0, prev - cost));
    return { ok: true };
  };

  const addStars = (amount: number): AddResult => {
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, reason: "invalid" };
    setStars(prev => Math.max(0, prev + amount));
    return { ok: true };
  };

  const claimBonus = (amount: number): BonusResult => {
    if (!initialized) return { ok: false, reason: "uninitialized" };
    if (!bonusAvailable) return { ok: false, reason: "already-claimed" };

    addStars(amount);
    const today = todayKey();
    setLastBonusDay(today);
    safeSetStorage(BONUS_STORAGE_KEY, today);

    return { ok: true, amount };
  };

  return {
    stars,
    initialized,
    bonusAvailable,
    lastBonusDay,
    spend,
    addStars,
    claimBonus,
  };
}
