import type { CSSProperties } from 'react';

// An official dice symbol from /public/dice/glyphs, drawn in currentColor.
// Callers set the display (e.g. inline-block) and size.
export default function Glyph({ name, className = '' }: { name: string; className?: string }) {
  const url = `url(/dice/glyphs/${name})`;
  return (
    <span
      aria-hidden
      className={`bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${className}`}
      style={{ maskImage: url, WebkitMaskImage: url } as CSSProperties}
    />
  );
}
