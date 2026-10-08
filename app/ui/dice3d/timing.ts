// How long a throw takes, shared by the 3D scene and the roller (which
// reveals the outcome once the dice have landed). Kept free of three.js so
// the roller can import it without pulling in the scene.
export const THROW_SECONDS = 1.9;
export const THROW_STAGGER_MS = 45;

export const settleMs = (count: number) => THROW_SECONDS * 1000 + 350 + count * THROW_STAGGER_MS;
