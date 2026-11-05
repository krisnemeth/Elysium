// Shared class strings for the app's surfaces and controls.

// `panel` is also a plain class so themes can restyle cards (app/games.css).
export const panel =
  'panel rounded-2xl border border-bone/10 bg-ink/70 shadow-[0_1.5rem_3rem_-1.5rem_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.04)] backdrop-blur-xl';

export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

// The buttons, after the landing's (app/ui/landing/buttons.css): dark glass with squared-off corners. A call to action glows in the accent; the rest are outlined in bone.
const button = `group inline-flex items-center justify-center gap-2 rounded-lg border font-semibold tracking-[0.02em] text-bone backdrop-blur-[10px] transition duration-300 ease-(--ease-out-expo) hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${focusRing}`;
const buttonGlow = 'border-accent/55 bg-black/35 shadow-[0_0_1.75rem_-0.4rem_var(--accent),inset_0_0_1.25rem_-0.75rem_var(--accent)] hover:border-accent/85 hover:bg-accent/10 hover:shadow-[0_0_2.5rem_-0.3rem_var(--accent),inset_0_0_1.25rem_-0.5rem_var(--accent)]';
const buttonOutline = 'border-bone/35 bg-black/35 hover:border-bone/75 hover:bg-bone/[0.07]';
const buttonSize = 'px-5 py-2.5 text-sm';
const buttonSizeSmall = 'px-4 py-1.5 text-xs';

export const buttonPrimary = `${button} ${buttonGlow} ${buttonSize}`;
export const buttonGhost = `${button} ${buttonOutline} ${buttonSize}`;
export const buttonPrimarySmall = `${button} ${buttonGlow} ${buttonSizeSmall}`;
export const buttonGhostSmall = `${button} ${buttonOutline} ${buttonSizeSmall}`;

export const fieldLabel = 'text-[0.7rem] tracking-[0.2em] text-bone/55 uppercase';

export const fieldInput = `w-full rounded-none border-0 border-b border-bone/20 bg-transparent px-0 py-2 text-bone placeholder:text-bone/25 transition-colors duration-300 hover:border-bone/40 focus:border-accent focus:outline-none focus:ring-0`;
