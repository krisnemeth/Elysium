import { serif, grotesk, mono } from './fonts';

// Everything under /concept shares the editorial fonts and token remap (.concept in globals.css).
export default function ConceptLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`concept ${serif.variable} ${grotesk.variable} ${mono.variable} min-h-svh bg-night font-c-sans text-paper antialiased transition-colors duration-500 selection:bg-blood selection:text-chalk`}
    >
      {children}
    </div>
  );
}
