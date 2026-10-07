// Shared class strings for the app's surfaces and controls.

// `panel` is also a plain class so themes can restyle cards (app/games.css).
export const panel =
  'panel rounded-2xl border border-bone/10 bg-ink/70 shadow-[0_1.5rem_3rem_-1.5rem_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.04)] backdrop-blur-xl';

export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export const buttonPrimary = `group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_1.5rem_-0.5rem_var(--accent)] transition duration-300 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:shadow-[0_0_2.25rem_-0.25rem_var(--accent)] hover:brightness-110 active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${focusRing}`;

export const buttonGhost = `group inline-flex items-center justify-center gap-2 rounded-full border border-bone/20 px-5 py-2.5 text-sm text-bone/85 transition duration-300 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-bone/50 hover:bg-bone/5 hover:text-bone active:translate-y-0 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${focusRing}`;

export const fieldLabel = 'text-[0.7rem] tracking-[0.2em] text-bone/55 uppercase';

export const fieldInput = `w-full rounded-none border-0 border-b border-bone/20 bg-transparent px-0 py-2 text-bone placeholder:text-bone/25 transition-colors duration-300 hover:border-bone/40 focus:border-accent focus:outline-none focus:ring-0`;
