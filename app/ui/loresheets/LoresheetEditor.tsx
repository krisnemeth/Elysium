'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import { deleteLoresheet, saveLoresheet } from '@/app/lib/actions/loresheets';
import { fieldInput, fieldLabel, panel, buttonGhostSmall } from '@/app/ui/kit/styles';
import SaveStatus from '@/app/ui/sheets/SaveStatus';
import type { SaveState } from '@/app/ui/sheets/useCharacterSave';
import { ActionButton } from '@/app/ui/social/forms';

const SAVE_DELAY = 900;

type Draft = { title: string; character_id: string | null; content: Record<string, string> };

export default function LoresheetEditor({
  id,
  kind,
  initial,
  characters,
}: {
  id: string;
  kind: LoreKind;
  initial: Draft;
  characters: { id: string; name: string }[];
}) {
  const spec = LORE_KINDS[kind];
  const [draft, setDraft] = useState(initial);
  const [state, setState] = useState<SaveState>('saved');
  const [error, setError] = useState('');
  const latest = useRef(draft);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titleId = useId();
  const charId = useId();
  const baseId = useId();

  const save = async () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    setState('saving');
    const snapshot = latest.current;
    const r = await saveLoresheet(id, kind, snapshot);
    if (!r.ok) {
      setState('error');
      setError(r.error);
    } else setState(latest.current === snapshot ? 'saved' : 'dirty');
  };

  const change = (patch: Partial<Draft>) => {
    const next = { ...latest.current, ...patch, content: { ...latest.current.content, ...patch.content } };
    latest.current = next;
    setDraft(next);
    setState('dirty');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), SAVE_DELAY);
  };

  // Save on tab hide; warn before leaving unsaved changes.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden' && timer.current) void save();
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (state !== 'saved') e.preventDefault();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onLeave);
    };
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='sticky top-20 z-30 flex flex-wrap items-center gap-3'>
        <SaveStatus className='mr-auto' state={state} error={error} onRetry={() => void save()} />
        <ActionButton action={deleteLoresheet.bind(null, id)} confirm='Delete this loresheet?' className={buttonGhostSmall}>
          Delete
        </ActionButton>
      </div>
      <section className={`flex flex-col gap-6 p-5 md:p-8 ${panel}`}>
        <div className='flex flex-col gap-1'>
          <label htmlFor={titleId} className={fieldLabel}>{kind === 'pc' ? 'Title' : 'Name'}</label>
          <input
            id={titleId}
            value={draft.title}
            maxLength={200}
            placeholder={kind === 'location' ? 'The Barrowland back bar' : kind === 'npc' ? 'Old Mags' : 'Trixx: the years on the road'}
            onChange={(e) => change({ title: e.target.value })}
            className={`${fieldInput} font-display text-2xl md:text-3xl`}
          />
        </div>
        {kind === 'pc' && (
          <div className='flex flex-col gap-1'>
            <label htmlFor={charId} className={fieldLabel}>Character</label>
            <select
              id={charId}
              value={draft.character_id ?? ''}
              onChange={(e) => change({ character_id: e.target.value || null })}
              className={`${fieldInput} cursor-pointer [&_option]:bg-ink`}
            >
              <option value=''>Not linked</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name || 'Unnamed'}</option>
              ))}
            </select>
          </div>
        )}
        <div className='grid gap-6 lg:grid-cols-2'>
          {spec.fields.map((f) => (
            <div key={f.key} className={`flex flex-col gap-1 ${(f.rows ?? 3) >= 5 ? 'lg:col-span-2' : ''}`}>
              <label htmlFor={`${baseId}-${f.key}`} className={fieldLabel}>{f.label}</label>
              <textarea
                id={`${baseId}-${f.key}`}
                value={draft.content[f.key] ?? ''}
                rows={f.rows ?? 3}
                placeholder={f.hint}
                maxLength={20000}
                onChange={(e) => change({ content: { [f.key]: e.target.value } })}
                // Grows with what's written (where supported), so long notes don't scroll inside a small box on phones.
                className={`${fieldInput} min-h-20 resize-y leading-relaxed [field-sizing:content]`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
