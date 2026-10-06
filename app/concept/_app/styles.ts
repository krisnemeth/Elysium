export const cButton =
  'group inline-flex items-center gap-3 bg-blood px-6 py-3.5 font-c-sans text-sm font-bold tracking-[0.15em] text-chalk uppercase transition duration-300 [font-variation-settings:"wdth"_85] hover:bg-paper hover:text-night active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper';

export const cLink =
  'border-b border-paper/40 pb-1 font-c-mono text-xs tracking-[0.2em] text-paper/80 uppercase transition-colors hover:border-blood hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blood';

export const fileNo = (i: number) => `File ${String(i + 1).padStart(3, '0')}-K`;
