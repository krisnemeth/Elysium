/*
  A small buzz under the finger. Android uses navigator.vibrate. iPhones have no
  vibration API, but since iOS 18 flipping a native switch ticks, so `tick()` clicks
  a hidden one; Safari only honours that during a tap, so anything that arrives later
  (dice landing, a save failing, a turn starting) only reaches Android.
  Per device, not per account: Settings turns it off in localStorage.
*/
export type Haptic = 'select' | 'tap' | 'heavy' | 'success' | 'warning' | 'error';

const VIBRATE: Record<Haptic, number | number[]> = {
  select: 6,
  tap: 10,
  heavy: 28,
  success: [12, 70, 22],
  warning: [24, 90, 24],
  error: [34, 60, 34, 60, 44],
};
// iOS has one strength, so a pattern is a few ticks.
const TICKS: Record<Haptic, number> = { select: 1, tap: 1, heavy: 2, success: 2, warning: 2, error: 3 };

const KEY = 'elysium-haptics';

export function hapticsOn() {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setHapticsOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {}
}

function tick() {
  const label = document.createElement('label');
  label.dataset.haptic = 'off';
  label.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.append(input);
  document.body.append(label);
  label.click();
  label.remove();
}

export function haptic(kind: Haptic = 'tap') {
  if (typeof window === 'undefined' || !hapticsOn() || !matchMedia('(pointer: coarse)').matches) return;
  if ('vibrate' in navigator) {
    navigator.vibrate(VIBRATE[kind]);
    return;
  }
  tick();
  for (let i = 1; i < TICKS[kind]; i++) setTimeout(tick, i * 90);
}
