// Player preferences (profiles.preferences). Help is on unless turned off;
// simple frames is off unless turned on.
export type Preferences = {
  // Explanations when hovering a trait on the sheet.
  tooltips: boolean;
  // Tutorials and hints in guided character creation.
  guidance: boolean;
  // Plain borders instead of the themes' ornamented frames.
  simpleFrames: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = { tooltips: true, guidance: true, simpleFrames: false };

export function readPreferences(raw: unknown): Preferences {
  const p = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof Preferences, unknown>>;
  return {
    tooltips: p.tooltips !== false,
    guidance: p.guidance !== false,
    simpleFrames: p.simpleFrames === true,
  };
}
