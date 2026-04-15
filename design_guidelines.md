# Telegram Mini App - Spinning Wheel Game Design Guidelines

## Design Approach

**Reference-Based: Mobile Gaming & Gambling Apps**
Draw inspiration from engaging mobile gaming interfaces like Coin Master, Lucky Spin, and modern casino apps that maximize dopamine-driven engagement while maintaining clarity. The design should feel premium, addictive, and celebratory.

**Core Principles:**
- Mobile-first, portrait orientation optimized for Telegram viewport
- Maximum visual impact in minimal space
- Instant gratification through animations and feedback
- Clear hierarchy: balance → action → reward
- Glassmorphism and gradient aesthetics for modern, premium feel

---

## Typography System

**Font Stack:**
- Primary: 'Poppins' (via Google Fonts CDN) - Bold, modern, gaming-friendly
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Hierarchy:**
- **Stars Balance Display:** 48px, Bold (900) - Dominant focal point
- **Wheel Prize Labels:** 24px, Bold (700) - High contrast, emoji + number
- **Primary CTA Button:** 20px, Bold (700) - All caps for impact
- **Reward Popup Title:** 36px, Bold (800) - Celebration moment
- **Reward Amount:** 64px, Bold (900) - Maximum impact
- **Secondary Text:** 16px, Medium (500) - Instructions, labels

---

## Layout System

**Spacing Units (Tailwind-based):**
Primary spacing: 4, 6, 8 units (1rem = 4 units)
- Tight spacing: p-4, gap-4 (cards, internal padding)
- Standard spacing: p-6, gap-6 (section separation)
- Generous spacing: p-8 (wheel container, major sections)

**Container Structure:**
- Full viewport height (100vh) single-screen experience
- Max-width: 100% (fills Telegram frame)
- Vertical centering with flexbox for all major sections
- 16px horizontal padding for edge breathing room

**Grid Layout:**
1. **Top Section** (auto height): Stars balance card - glassmorphic, centered
2. **Middle Section** (flex-1): Spinning wheel - dominant focal point, 300px diameter
3. **Bottom Section** (auto height): Action buttons stack, 16px gap between

---

## Component Library

### 1. Stars Balance Card
- Glassmorphic container with backdrop blur
- Rounded corners (24px border-radius)
- Centered content: ⭐ emoji (32px) + number (48px bold)
- Subtle pulsing animation on balance update (scale 1.0 → 1.05 → 1.0)
- Semi-transparent background with border glow

### 2. Spinning Wheel (300px diameter)
**Structure:**
- 8 equal segments (45° each) in alternating vibrant colors
- Each segment contains: emoji (28px) + star amount (20px bold)
- Center hub (60px circle) with glow effect and "SPIN" text
- Prizes: 5⭐, 10⭐, 15⭐, 20⭐, 25⭐, 50⭐, 75⭐, 100⭐

**Visual Treatment:**
- Segments: alternating bright colors (pink, purple, blue, cyan, gradient fills)
- White/yellow borders between segments (2px)
- Drop shadow for depth (0 8px 32px rgba(0,0,0,0.3))
- Pointer arrow at top (triangle, 20px, bright color with glow)

**Animation:**
- Rotation: 4 seconds, ease-out cubic-bezier
- Starts fast (1800° base) + random offset (0-360°)
- Slow deceleration for anticipation (near-miss effect)
- Settle animation with slight bounce

### 3. Primary CTA Button ("KRĘĆ KOŁEM! 10⭐")
- Full-width with 16px horizontal margins
- Height: 64px for easy mobile tapping
- Rounded: 16px border-radius
- Gradient background (diagonal, vibrant)
- Neon glow effect (0 0 20px, 0 0 40px on hover)
- Pulsing animation (infinite, 2s): scale + glow intensity
- All-caps text with letter-spacing: 1.5px
- Disabled state: reduced opacity, no animation

### 4. Secondary Button ("Doładuj 💎")
- Width: auto, centered
- Height: 56px
- Outline style with 2px border
- Glassmorphic background on hover
- 💎 emoji prefix (20px)
- Subtle glow on interaction

### 5. Reward Popup
**Overlay:** Full-screen backdrop with blur (backdrop-filter: blur(12px))

**Popup Card:**
- Centered modal (max-width: 320px, mobile-optimized)
- Glassmorphic background with intense glow
- Border-radius: 32px
- Padding: 48px vertical, 32px horizontal
- Scale animation: 0 → 1.0 with spring effect (0.3s)

**Content Stack:**
1. Celebration emoji 🎉 (64px) - rotating animation
2. "WYGRAŁEŚ!" heading (24px, uppercase)
3. Star amount (64px bold) with ⭐ emoji
4. Confetti effect (falling emoji particles, position: absolute)
5. Close button (48px × 48px, top-right, glassmorphic circle)

### 6. Confetti System
- 20-30 emoji particles (⭐, 💎, 🎉, ✨)
- Random starting positions across width
- Falling animation: 3s, various delays
- Rotation and scale variations for depth
- Fading opacity as they fall

---

## Visual Effects Library

### Glassmorphism
- `background: rgba(255, 255, 255, 0.1)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid rgba(255, 255, 255, 0.2)`
- Applied to: balance card, buttons, popup

### Neon Glow
- Box-shadow layers: inner + outer glow
- Primary glow: `0 0 20px rgba(color, 0.5)`
- Hover glow: `0 0 40px rgba(color, 0.8)`
- Applied to: buttons, wheel segments, popup borders

### Gradient Backgrounds
- **Body:** Radial gradient from purple → blue → pink (diagonal 135°)
- **Buttons:** Linear gradients with shift on hover
- **Wheel segments:** Individual vibrant gradients per segment

### Pulsing Animation
```
@keyframes pulse {
  0%, 100%: scale(1.0), glow-intensity(1.0)
  50%: scale(1.05), glow-intensity(1.3)
}
Duration: 2s infinite
```

### Spin Animation
```
@keyframes spin {
  0%: rotate(0deg)
  100%: rotate(1800deg + random offset)
}
Duration: 4s ease-out
```

---

## Responsive Behavior

**Breakpoints:**
- Mobile-first (320px - 480px): Base design
- Tablet portrait (480px+): Slightly larger wheel (350px)

**Adaptations:**
- Maintain portrait orientation lock
- Scale wheel proportionally (max 90vw)
- Font sizes: minor increases on larger screens (+2px)
- Button heights remain tap-friendly (minimum 48px)

---

## Interaction States

### Buttons
- **Default:** Gradient + subtle glow + pulsing
- **Hover/Active:** Increased glow, scale(1.02)
- **Disabled:** 50% opacity, grayscale, no animation
- **Press:** Haptic feedback (heavy impact), scale(0.98)

### Wheel
- **Idle:** Subtle rotation wobble (±2° infinite)
- **Spinning:** Full rotation animation
- **Stopping:** Deceleration with near-miss timing
- **Complete:** Bounce settle, segment highlight

---

## Accessibility Considerations

- High contrast text on glassmorphic backgrounds (white with shadow)
- Minimum 48px tap targets for all interactive elements
- Clear visual feedback for all actions
- Semantic HTML with ARIA labels for screen readers
- Reduced motion fallback (disable pulsing/confetti)
- Focus indicators for keyboard navigation

---

## Integration with Telegram Theme

- Detect `window.Telegram.WebApp.themeParams`
- Apply theme accent color to button borders (subtle integration)
- Maintain app's vibrant aesthetic while respecting dark/light mode
- Background: always custom gradient (don't override)
- Text: always white with shadow for readability

---

## Performance Optimizations

- Use CSS transforms for animations (GPU-accelerated)
- Limit confetti particles (max 20)
- Single animation loop per component
- Debounce rapid button clicks
- LocalStorage for instant balance display