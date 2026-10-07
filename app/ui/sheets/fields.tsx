'use client';

import { useId, type ReactNode } from 'react';
import DotRating from '@/app/ui/kit/DotRating';
import Explain from './Explain';
import { fieldInput, fieldLabel } from '@/app/ui/kit/styles';

// Building blocks for the character sheet form.

export function TextField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  term,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date' | 'number';
  placeholder?: string;
  // Glossary key, when it differs from the label (e.g. Hunter’s Drive vs the Drive skill).
  term?: string;
}) {
  const id = useId();
  return (
    <div className='group/field flex flex-col gap-1'>
      <label htmlFor={id} className={`${fieldLabel} transition-colors duration-300 group-focus-within/field:text-accent`}>
        <Explain label={label} term={term} />
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldInput} [color-scheme:dark]`}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  hideLabel = false,
  term,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  hideLabel?: boolean;
  // Glossary key, when it differs from the label (e.g. Hunter’s Drive vs the Drive skill).
  term?: string;
}) {
  const id = useId();
  return (
    <div className='group/field flex flex-col gap-1'>
      <label
        htmlFor={id}
        className={hideLabel ? 'sr-only' : `${fieldLabel} transition-colors duration-300 group-focus-within/field:text-accent`}
      >
        <Explain label={label} term={term} />
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldInput} cursor-pointer [&>option]:bg-ink`}
      >
        <option value=''>Choose…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  rows = 5,
  value,
  onChange,
  hideLabel = false,
}: {
  label: string;
  name: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
}) {
  const id = useId();
  return (
    <div className='group/field flex flex-col gap-2'>
      <label
        htmlFor={id}
        className={hideLabel ? 'sr-only' : `${fieldLabel} transition-colors duration-300 group-focus-within/field:text-accent`}
      >
        <Explain label={label} />
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full resize-y rounded-xl border border-bone/15 bg-bone/[0.03] p-3 leading-relaxed text-bone transition-[border-color,background-color,box-shadow] duration-300 hover:border-bone/30 focus:border-accent focus:bg-bone/[0.05] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_25%,transparent)] focus:outline-none'
      />
    </div>
  );
}

// A labelled dot rating on one line, optionally with an extra field between.
export function RatingRow({
  label,
  value,
  onChange,
  max = 5,
  shape,
  children,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  shape?: 'dot' | 'box';
  children?: ReactNode;
}) {
  return (
    <div className='flex items-center gap-3 border-b border-bone/[0.07] py-1.5 transition-colors duration-300 hover:border-bone/20'>
      <Explain label={label} className='w-28 shrink-0 text-sm text-bone/80' />
      <div className='min-w-0 grow'>{children}</div>
      <DotRating label={label} value={value} onChange={onChange} max={max} shape={shape} size='sm' />
    </div>
  );
}
