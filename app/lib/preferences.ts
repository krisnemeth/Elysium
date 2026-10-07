// Player preferences (profiles.preferences). Missing keys mean "on".
export type Preferences = {
  // Explanations when hovering a trait on the sheet.
  tooltips: boolean;
  // Tutorials and hints in guided character creation.
  guidance: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = { tooltips: true, guidance: true };

export function readPreferences(raw: unknown): Preferences {
  const p = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof Preferences, unknown>>;
  return {
    tooltips: p.tooltips !== false,
    guidance: p.guidance !== false,
  };
}
