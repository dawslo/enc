declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{ id?: string; type?: string; text: string }>;
        }, callback?: (buttonId: string) => void) => void;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export const isTelegramAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};

export const useTelegram = () => {
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      tg?.HapticFeedback?.impactOccurred(style);
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  };

  const showRechargePopup = (onSelect: (packageId: string) => void) => {
    if (tg?.showPopup) {
      try {
        tg.showPopup(
          {
            title: "Doładuj Gwiazdki",
            message: "Wybierz pakiet:",
            buttons: [
              { id: "50", text: "50⭐ - 5 TON" },
              { id: "150", text: "150⭐ - 10 TON" },
              { id: "500", text: "500⭐ - 25 TON" },
              { id: "cancel", type: "cancel", text: "Anuluj" },
            ],
          },
          (buttonId) => {
            if (buttonId !== "cancel") {
              onSelect(buttonId);
            }
          }
        );
        return;
      } catch (error) {
        console.log('Telegram popup error:', error);
      }
    }
    
    // Fallback dla przeglądarki
    console.log('Running in browser mode - using prompt');
    const amount = prompt("Doładuj Gwiazdki\n\nWybierz pakiet:\n50⭐ - 5 TON\n150⭐ - 10 TON\n500⭐ - 25 TON\n\nWpisz: 50, 150 lub 500");
    if (amount && ["50", "150", "500"].includes(amount)) {
      onSelect(amount);
    }
  };

  return {
    tg,
    triggerHaptic,
    showRechargePopup,
    user: tg?.initDataUnsafe?.user,
    themeParams: tg?.themeParams,
    isTelegram: isTelegramAvailable(),
  };
};

export const initTelegram = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    console.log('✅ Telegram WebApp initialized');
    console.log('📱 User:', tg.initDataUnsafe?.user);
  } else {
    console.log('🌐 Running in standalone browser mode');
  }
};
