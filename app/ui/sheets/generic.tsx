'use client';

import { useState, type CSSProperties } from 'react';
import DotRating from '@/app/ui/kit/DotRating';
import { RatingRow, SelectField, TextAreaField, TextField } from './fields';
import { glyphUrl } from '@/app/lib/factions';

// Data-driven sheet sections, used to build the Werewolf and Hunter sheets.

// `glyph` shows the option's Werewolf glyph next to the select.
type ProfileField = { key: string; label: string; options?: readonly string[]; glyph?: boolean };

export function Profile({ fields }: { fields: ProfileField[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'>
      {fields.map((f) => {
        const value = values[f.key] ?? '';
        const set = (v: string) => setValues((s) => ({ ...s, [f.key]: v }));
        if (!f.options) return <TextField key={f.key} label={f.label} name={f.key} value={value} onChange={set} />;
        const url = value && f.glyph ? `url(${glyphUrl(value)})` : null;
        return (
          <div key={f.key} className='flex items-end gap-3'>
            <div className='grow'>
              <SelectField label={f.label} name={f.key} value={value} options={[...f.options]} onChange={set} />
            </div>
            {f.glyph && (
              <span
                key={value}
                aria-hidden
                className={`mb-1 size-9 shrink-0 bg-accent [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${url ? 'dot-pop' : 'opacity-0'}`}
                style={url ? ({ maskImage: url, WebkitMaskImage: url } as CSSProperties) : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

type Track = { key: string; label: string; max: number; shape?: 'dot' | 'box'; initial?: number; note?: string };

export function Trackers({ tracks }: { tracks: Track[] }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(tracks.map((t) => [t.key, t.initial ?? 0])),
  );
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {tracks.map((t) => (
        <div key={t.key} className='flex flex-col items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] p-4 text-center'>
          <span className='font-display text-2xl'>{t.label}</span>
          <DotRating label={t.label} value={values[t.key]} max={t.max} shape={t.shape} onChange={(v) => setValues((s) => ({ ...s, [t.key]: v }))} />
          <span className='text-xs text-bone/45 tabular-nums'>
            {values[t.key]} / {t.max}
            {t.note && <span className='block'>{t.note}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RatingGroups({ groups }: { groups: { name: string; items: string[]; initial?: number }[] }) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i, g.initial ?? 0]))),
  );
  return (
    <div className='grid gap-8 md:grid-cols-3'>
      {groups.map((g) => (
        <div key={g.name}>
          <h3 className='mb-2 text-xs tracking-[0.25em] text-accent uppercase'>{g.name}</h3>
          {g.items.map((item) => (
            <RatingRow key={item} label={item} value={values[item]} onChange={(v) => setValues((s) => ({ ...s, [item]: v }))} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Rows of a free-text name, optionally with a dot rating.
export function NamedList({ title, rows, placeholder, rated = true }: { title: string; rows: number; placeholder: string; rated?: boolean }) {
  const [items, setItems] = useState(() => Array.from({ length: rows }, () => ({ name: '', level: 0 })));
  const update = (i: number, patch: Partial<{ name: string; level: number }>) =>
    setItems((list) => list.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  return (
    <div>
      <h3 className='mb-2 text-xs tracking-[0.25em] text-accent uppercase'>{title}</h3>
      {items.map((item, i) => {
        const input = (
          <input
            aria-label={`${title} ${i + 1}`}
            placeholder={placeholder}
            value={item.name}
            onChange={(e) => update(i, { name: e.target.value })}
            className='w-full bg-transparent text-sm text-bone placeholder:text-bone/20 focus:outline-none'
          />
        );
        return rated ? (
          <RatingRow key={i} label={`#${i + 1}`} value={item.level} onChange={(level) => update(i, { level })}>
            {input}
          </RatingRow>
        ) : (
          <div key={i} className='flex items-center gap-3 border-b border-bone/[0.07] py-2 transition-colors hover:border-bone/20'>
            <span className='w-8 text-xs text-bone/35 tabular-nums'>{i + 1}</span>
            {input}
          </div>
        );
      })}
    </div>
  );
}

export function TextAreas({ fields, rows = 6 }: { fields: { key: string; label: string }[]; rows?: number }) {
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className={`grid gap-6 ${fields.length > 2 ? 'lg:grid-cols-3' : fields.length === 2 ? 'lg:grid-cols-2' : ''}`}>
      {fields.map((f) => (
        <TextAreaField
          key={f.key}
          label={f.label}
          name={f.key}
          rows={rows}
          value={values[f.key] ?? ''}
          onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
        />
      ))}
    </div>
  );
}

function yearsBetween(from: string, to: Date) {
  const start = new Date(from);
  if (!from || Number.isNaN(start.getTime()) || Number.isNaN(to.getTime())) return null;
  let years = to.getFullYear() - start.getFullYear();
  if (to.getMonth() < start.getMonth() || (to.getMonth() === start.getMonth() && to.getDate() < start.getDate())) years -= 1;
  return years;
}

// Biography with a game-specific turning point (First Change, the Reckoning…).
export function Biography({ milestone }: { milestone: string }) {
  const [birth, setBirth] = useState('');
  const [turn, setTurn] = useState('');
  const [text, setText] = useState<Record<string, string>>({});
  const ages: [string, number | null][] = [
    ['Age', yearsBetween(birth, new Date())],
    [`Age at ${milestone}`, turn ? yearsBetween(birth, new Date(turn)) : null],
  ];
  return (
    <div className='flex flex-col gap-8'>
      <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
        <TextField label='Date of birth' name='birth' type='date' value={birth} onChange={setBirth} />
        <TextField label={milestone} name='milestone' type='date' value={turn} onChange={setTurn} />
        {ages.map(([label, age]) => (
          <div key={label} className='flex items-baseline justify-between border-b border-bone/[0.07] py-2'>
            <span className='text-[0.7rem] tracking-[0.2em] text-bone/55 uppercase'>{label}</span>
            <span className='font-display text-3xl tabular-nums'>{age ?? '—'}</span>
          </div>
        ))}
      </div>
      {[
        ['appearance', 'Appearance', 4],
        ['history', 'History', 8],
      ].map(([key, label, rows]) => (
        <TextAreaField
          key={key as string}
          label={label as string}
          name={key as string}
          rows={rows as number}
          value={text[key as string] ?? ''}
          onChange={(v) => setText((s) => ({ ...s, [key as string]: v }))}
        />
      ))}
    </div>
  );
}
