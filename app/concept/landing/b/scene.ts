/*
  The chosen cover, shared between the picker (CoverPicker) and the rest of
  the page's client parts (the sections' weather): a tiny external store.
  Everything that can be done in CSS reads the attributes CoverPicker puts
  on <html> instead (data-lc-scene, data-lc-game, --lc-scene-glow and
  --lc-scene-tint), so the server-rendered sections need no client state.
*/
let current = -1;
const listeners = new Set<() => void>();

export function setScene(i: number) {
  if (i === current) return;
  current = i;
  listeners.forEach((l) => l());
}

export function subscribeScene(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const getScene = () => current;
