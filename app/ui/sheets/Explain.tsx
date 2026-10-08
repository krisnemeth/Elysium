'use client';

import { useId } from 'react';
import { explain } from '@/app/lib/sheets/glossary';
import { usePreferences } from '@/app/ui/PreferencesContext';

/*
  A trait name with a plain-language explanation on hover or keyboard focus.
  Renders the bare label when tooltips are off (Settings) or there's nothing
  to explain.
*/
export default function Explain({ label, term = label, className = '' }: { label: string; term?: string; className?: string }) {
  const { tooltips } = usePreferences();
  const id = useId();
  const text = tooltips ? explain(term) : undefined;
  if (!text) return <span className={className}>{label}</span>;
  return (
    <span className={`group/explain relative inline-block ${className}`}>
      <span
        tabIndex={0}
        aria-describedby={id}
        className='cursor-help underline decoration-bone/25 decoration-dotted underline-offset-4 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent/70'
      >
        {label}
      </span>
      <span
        id={id}
        role='tooltip'
        className='pointer-events-none invisible absolute top-full left-0 z-50 mt-2 w-64 rounded-xl border border-bone/15 bg-ink/95 p-3 text-left text-xs leading-relaxed font-normal tracking-normal text-bone/85 normal-case opacity-0 shadow-[0_1rem_2rem_-0.5rem_rgb(0_0_0/0.7)] backdrop-blur-md transition-opacity duration-200 group-hover/explain:visible group-hover/explain:opacity-100 group-focus-within/explain:visible group-focus-within/explain:opacity-100'
      >
        {text}
      </span>
    </span>
  );
}
