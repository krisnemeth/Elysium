// Throw timing, shared by the 3D scene and the roller. Kept free of three.js
// so the roller can import it without pulling in the scene.

// Each die rolls until friction stops it, so throws vary; none runs longer
// than this.
export const MAX_THROW_SECONDS = 3.4;
export const THROW_STAGGER_MS = 45;

// The scene reports when the last die stops; this is the fallback (e.g. when
// the canvas isn't drawing), long enough for any throw.
export const settleMs = (count: number) => MAX_THROW_SECONDS * 1000 + 250 + count * THROW_STAGGER_MS;
