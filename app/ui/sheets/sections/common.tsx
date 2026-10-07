'use client';

import { MdAdd, MdClose } from 'react-icons/md';
import DotRating from '@/app/ui/kit/DotRating';
import { fieldLabel } from '@/app/ui/kit/styles';
import { ATTRIBUTES, SKILLS, type Advantage, type Sheet } from '@/app/lib/sheets/types';
import { RatingRow, SelectField, TextAreaField, TextField } from '../fields';
import { useSheet, useSheetFields } from '../SheetContext';
import { glyphUrl } from '@/app/lib/factions';

// Sections every game's sheet shares. All read and write the shared sheet.

const groupTitle = 'mb-2 text-xs tracking-[0.25em] text-accent uppercase';
const smallInput = 'w-full bg-transparent text-sm text-bone placeholder:text-bone/25 focus:outline-none';
const addButton =
  'mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-bone/25 px-3 py-1.5 text-xs text-bone/60 transition-colors hover:border-bone/50 hover:text-bone focus-visible:outline-2 focus-visible:outline-accent';
const removeButton =
  'grid size-7 shrink-0 place-items-center rounded-full text-bone/30 transition-colors hover:bg-bone/[0.06] hover:text-bone focus-visible:outline-2 focus-visible:outline-accent';

// `glyph`: show the option's Werewolf glyph beside the select.
export type ProfileField = { key: string; label: string; options?: readonly string[]; glyph?: boolean };

export function Profile({ fields }: { fields: ProfileField[] }) {
  const { profile, setProfile } = useSheetFields();
  return (
    <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'>
      {fields.map((f) => {
        if (!f.options) return <TextField key={f.key} label={f.label} name={f.key} value={profile(f.key)} onChange={setProfile(f.key)} />;
        const value = profile(f.key);
        const url = value && f.glyph ? glyphUrl(value) : null;
        return (
          <div key={f.key} className='flex items-end gap-3'>
            <div className='grow'>
              <SelectField label={f.label} name={f.key} value={value} options={[...f.options]} onChange={setProfile(f.key)} />
            </div>
            {f.glyph && (
              <span
                key={value}
                aria-hidden
                className={`mb-1 size-9 shrink-0 bg-accent [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${url ? 'dot-pop' : 'opacity-0'}`}
                style={url ? { maskImage: `url(${url})`, WebkitMaskImage: `url(${url})` } : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Attributes() {
  const { sheet, setAttribute } = useSheetFields();
  return (
    <div className='grid gap-8 md:grid-cols-3'>
      {Object.entries(ATTRIBUTES).map(([group, attrs]) => (
        <div key={group}>
          <h3 className={groupTitle}>{group}</h3>
          {attrs.map((a) => (
            <RatingRow key={a} label={a} value={sheet.attributes[a]} onChange={(v) => setAttribute(a, v)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const { sheet, setSkill } = useSheetFields();
  return (
    <div className='grid gap-8 lg:grid-cols-3'>
      {Object.entries(SKILLS).map(([group, skills]) => (
        <div key={group}>
          <h3 className={groupTitle}>{group}</h3>
          {skills.map((s) => (
            <RatingRow key={s} label={s} value={sheet.skills[s]?.dots ?? 0} onChange={(dots) => setSkill(s, { dots })}>
              <input
                aria-label={`${s} specialty`}
                placeholder='Specialty'
                value={sheet.skills[s]?.specialty ?? ''}
                onChange={(e) => setSkill(s, { specialty: e.target.value || undefined })}
                className={`${smallInput} text-bone/80 italic`}
              />
            </RatingRow>
          ))}
        </div>
      ))}
    </div>
  );
}

export type TrackSpec = { key: string; label: string; max: number; shape?: 'dot' | 'box'; note?: string };

export function Trackers({ tracks }: { tracks: TrackSpec[] }) {
  const { tracker, setTracker } = useSheetFields();
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {tracks.map((t) => (
        <div key={t.key} className='flex flex-col items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] p-4 text-center'>
          <span className='font-display text-2xl'>{t.label}</span>
          <DotRating label={t.label} value={tracker(t.key)} max={t.max} shape={t.shape} onChange={setTracker(t.key)} />
          <span className='text-xs text-bone/45 tabular-nums'>
            {tracker(t.key)} / {t.max}
            {t.note && <span className='block'>{t.note}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

const KINDS: Advantage['kind'][] = ['background', 'merit', 'flaw'];

export function Advantages() {
  const { sheet, update } = useSheet();
  const set = (i: number, patch: Partial<Advantage>) =>
    update((d) => {
      d.advantages[i] = { ...d.advantages[i], ...patch };
    });
  return (
    <div>
      <h3 className={groupTitle}>Backgrounds, merits & flaws</h3>
      <ul>
        {sheet.advantages.map((a, i) => (
          <li key={i} className='flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-bone/[0.07] py-2 transition-colors hover:border-bone/20'>
            <select
              aria-label={`Type of advantage ${i + 1}`}
              value={a.kind}
              onChange={(e) => set(i, { kind: e.target.value as Advantage['kind'] })}
              className={`w-28 cursor-pointer bg-transparent text-xs tracking-wide uppercase focus:outline-none [&>option]:bg-ink ${a.kind === 'flaw' ? 'text-accent' : 'text-bone/50'}`}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <input aria-label={`Advantage ${i + 1} name`} placeholder='Name' value={a.name} onChange={(e) => set(i, { name: e.target.value })} className={`${smallInput} min-w-24 flex-1`} />
            <DotRating label={a.name || `Advantage ${i + 1}`} value={a.dots} onChange={(dots) => set(i, { dots })} size='sm' />
            <button type='button' aria-label={`Remove ${a.name || 'advantage'}`} className={removeButton} onClick={() => update((d) => void d.advantages.splice(i, 1))}>
              <MdClose aria-hidden />
            </button>
            <input
              aria-label={`Advantage ${i + 1} note`}
              placeholder='Note'
              value={a.note ?? ''}
              onChange={(e) => set(i, { note: e.target.value || undefined })}
              className={`${smallInput} basis-full pl-31 text-xs text-bone/55 italic`}
            />
          </li>
        ))}
      </ul>
      <button type='button' className={addButton} onClick={() => update((d) => void d.advantages.push({ name: '', dots: 1, kind: 'background' }))}>
        <MdAdd aria-hidden /> Add advantage or flaw
      </button>
    </div>
  );
}

export function Convictions({ label = 'Convictions & touchstones' }: { label?: string }) {
  const { sheet, update } = useSheet();
  const rows = sheet.convictions;
  return (
    <div>
      <h3 className={groupTitle}>{label}</h3>
      <ul className='flex flex-col gap-3'>
        {rows.map((c, i) => (
          <li key={i} className='grid gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center'>
            <input
              aria-label={`Conviction ${i + 1}`}
              placeholder='Conviction'
              value={c.conviction}
              onChange={(e) => update((d) => void (d.convictions[i].conviction = e.target.value))}
              className={smallInput}
            />
            <input
              aria-label={`Touchstone ${i + 1}`}
              placeholder='Touchstone'
              value={c.touchstone}
              onChange={(e) => update((d) => void (d.convictions[i].touchstone = e.target.value))}
              className={`${smallInput} text-bone/75 italic`}
            />
            <button type='button' aria-label='Remove conviction' className={removeButton} onClick={() => update((d) => void d.convictions.splice(i, 1))}>
              <MdClose aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button type='button' className={addButton} onClick={() => update((d) => void d.convictions.push({ conviction: '', touchstone: '' }))}>
        <MdAdd aria-hidden /> Add conviction
      </button>
    </div>
  );
}

// Free-text fields stored either on the sheet (e.g. 'notes', 'bane') or in
// the profile ('profile.redemption').
type TextKey = 'notes' | 'bane' | 'tenets' | 'favor' | 'ban' | `profile.${string}`;

export function TextBlocks({ fields, rows = 6 }: { fields: { key: TextKey; label: string }[]; rows?: number }) {
  const { sheet, update } = useSheet();
  const get = (key: TextKey) => (key.startsWith('profile.') ? sheet.profile[key.slice(8)] : sheet[key as keyof Sheet]) as string | undefined;
  const set = (key: TextKey) => (value: string) =>
    update((d) => {
      if (key.startsWith('profile.')) d.profile[key.slice(8)] = value;
      else (d as Record<string, unknown>)[key] = value;
    });
  return (
    <div className={`grid gap-6 ${fields.length > 2 ? 'lg:grid-cols-3' : fields.length === 2 ? 'lg:grid-cols-2' : ''}`}>
      {fields.map((f) => (
        <TextAreaField key={f.key} label={f.label} name={f.key} rows={rows} value={get(f.key) ?? ''} onChange={set(f.key)} />
      ))}
    </div>
  );
}

function yearsBetween(from?: string, to?: Date) {
  if (!from || !to) return null;
  const start = new Date(from);
  if (Number.isNaN(start.getTime()) || Number.isNaN(to.getTime())) return null;
  let years = to.getFullYear() - start.getFullYear();
  if (to.getMonth() < start.getMonth() || (to.getMonth() === start.getMonth() && to.getDate() < start.getDate())) years -= 1;
  return years;
}

// `milestone`: the Embrace, the First Change or the Reckoning.
export function Biography({ milestone, apparent }: { milestone: string; apparent?: string }) {
  const { sheet, update } = useSheet();
  const b = sheet.biography;
  const set = (key: keyof Sheet['biography']) => (value: string) =>
    update((d) => {
      if (key === 'appearance' || key === 'history') d.biography[key] = value;
      else d.biography[key] = value || undefined;
    });
  const ages: [string, number | null][] = [
    ['True age', yearsBetween(b.born, new Date())],
    [apparent ?? `Age at ${milestone}`, b.turned ? yearsBetween(b.born, new Date(b.turned)) : null],
  ];
  return (
    <div className='flex flex-col gap-8'>
      <div className='grid gap-x-8 gap-y-6 sm:grid-cols-2'>
        <TextField label='Date of birth' name='born' type='date' value={b.born ?? ''} onChange={set('born')} />
        <TextField label={`Date of ${milestone}`} name='turned' type='date' value={b.turned ?? ''} onChange={set('turned')} />
        {ages.map(([label, age]) => (
          <div key={label} className='flex items-baseline justify-between border-b border-bone/[0.07] py-2'>
            <span className={fieldLabel}>{label}</span>
            <span className='font-display text-3xl tabular-nums'>{age ?? '—'}</span>
          </div>
        ))}
      </div>
      <TextAreaField label='Appearance' name='appearance' rows={3} value={b.appearance} onChange={set('appearance')} />
      <TextAreaField label='Distinguishing features' name='features' rows={2} value={b.features ?? ''} onChange={set('features')} />
      <TextAreaField label='History' name='history' rows={8} value={b.history} onChange={set('history')} />
    </div>
  );
}

// A plain list of names (rites, perks…).
export function NameList({
  title,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <h3 className={groupTitle}>{title}</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i} className='flex items-center gap-3 border-b border-bone/[0.07] py-2 transition-colors hover:border-bone/20'>
            <span className='w-6 text-xs text-bone/35 tabular-nums'>{i + 1}</span>
            <input
              aria-label={`${title} ${i + 1}`}
              placeholder={placeholder}
              value={item}
              onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
              className={smallInput}
            />
            <button type='button' aria-label={`Remove ${item || placeholder}`} className={removeButton} onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <MdClose aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button type='button' className={addButton} onClick={() => onChange([...items, ''])}>
        <MdAdd aria-hidden /> Add {placeholder.toLowerCase()}
      </button>
    </div>
  );
}

