'use client';

import { useActionState, useState } from 'react';
import clsx from 'clsx';
import { createChronicle } from '@/app/lib/actions/social';
import { GAMES, GAMES_ORDER, type Game } from '@/app/lib/games';
import { SETTINGS } from '@/app/lib/storyteller/content';
import { PERSONAS, PERSONA_ORDER, type PersonaId } from '@/app/lib/storyteller/personas';
import { buttonPrimary, fieldInput, fieldLabel, panel } from '@/app/ui/kit/styles';

function Choice({ name, value, checked, onChange, title, blurb }: { name: string; value: string; checked: boolean; onChange: () => void; title: string; blurb: string }) {
  return (
    <label
      className={clsx(
        'flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent',
        checked ? 'border-accent bg-accent/10' : 'border-bone/15 hover:border-bone/40',
      )}
    >
      <input type='radio' name={name} value={value} checked={checked} onChange={onChange} className='sr-only' />
      <span className='font-display text-lg'>{title}</span>
      <span className='text-xs leading-relaxed text-bone/55'>{blurb}</span>
    </label>
  );
}

export default function CreateChronicle() {
  const [state, action, pending] = useActionState(createChronicle, {});
  const [game, setGame] = useState<Game>('vampire');
  const [ledBy, setLedBy] = useState<'player' | 'bot'>('player');
  const [persona, setPersona] = useState<PersonaId>('archivist');
  const [setting, setSetting] = useState('city');

  return (
    <form action={action} className={`flex flex-col gap-8 p-6 md:p-8 ${panel}`}>
      <h2 className='font-display text-3xl'>Start a chronicle</h2>
      <div className='flex flex-col gap-1'>
        <label htmlFor='chronicle-name' className={fieldLabel}>Name</label>
        <input id='chronicle-name' name='name' required maxLength={120} placeholder='Glasgow by Night' className={fieldInput} />
      </div>

      <fieldset className='flex flex-col gap-3'>
        <legend className={`${fieldLabel} mb-3`}>Main game</legend>
        <div className='grid gap-3 sm:grid-cols-3'>
          {GAMES_ORDER.map((g) => (
            <Choice key={g} name='game' value={g} checked={game === g} onChange={() => setGame(g)} title={GAMES[g].name} blurb={GAMES[g].tagline} />
          ))}
        </div>
        <p className='text-xs text-bone/45'>Players can bring characters from any game; this sets the look and the main threat.</p>
      </fieldset>

      <fieldset className='flex flex-col gap-3'>
        <legend className={`${fieldLabel} mb-3`}>Who tells the story?</legend>
        <div className='grid gap-3 sm:grid-cols-2'>
          <Choice name='storyteller' value='player' checked={ledBy === 'player'} onChange={() => setLedBy('player')} title='I’ll be the Storyteller' blurb='You run the game and can read the sheets your players bring.' />
          <Choice name='storyteller' value='bot' checked={ledBy === 'bot'} onChange={() => setLedBy('bot')} title='The Storyteller bot' blurb='Pick a Storyteller and a setting; the bot builds a five-act story and the group chooses how it goes.' />
        </div>
      </fieldset>

      {ledBy === 'bot' && (
        <>
          <fieldset className='flex flex-col gap-3'>
            <legend className={`${fieldLabel} mb-3`}>Choose your Storyteller</legend>
            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
              {PERSONA_ORDER.map((id) => {
                const p = PERSONAS[id];
                return (
                  <label
                    key={id}
                    className={clsx(
                      'flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent',
                      persona === id ? 'border-accent bg-accent/10' : 'border-bone/15 hover:border-bone/40',
                    )}
                  >
                    <input type='radio' name='persona' value={id} checked={persona === id} onChange={() => setPersona(id)} className='sr-only' />
                    <span className='font-display text-xl'>{p.name}</span>
                    <span className='text-sm text-bone/80'>{p.tagline}</span>
                    <span className='text-xs leading-relaxed text-bone/55'>{p.characterisation}</span>
                    <span className='mt-auto flex flex-wrap gap-1.5 pt-1'>
                      {p.traits.map((t) => (
                        <span key={t} className='rounded-full border border-bone/20 px-2 py-0.5 text-[0.65rem] tracking-wide text-bone/65'>{t}</span>
                      ))}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <fieldset className='flex flex-col gap-3'>
            <legend className={`${fieldLabel} mb-3`}>Setting</legend>
            <div className='grid gap-3 sm:grid-cols-3'>
              {Object.entries(SETTINGS).map(([k, s]) => (
                <Choice key={k} name='setting' value={k} checked={setting === k} onChange={() => setSetting(k)} title={s.label} blurb={s.blurb} />
              ))}
            </div>
          </fieldset>
        </>
      )}

      {state.error && <p role='status' className='text-sm text-accent'>{state.error}</p>}
      <button disabled={pending} className={`${buttonPrimary} self-start`}>
        {pending ? 'Creating…' : 'Create chronicle'}
      </button>
    </form>
  );
}
