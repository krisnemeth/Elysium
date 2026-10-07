'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition, type ReactNode } from 'react';
import clsx from 'clsx';
import { MdArrowBack, MdArrowForward, MdCheck, MdInfoOutline } from 'react-icons/md';
import { GAMES, type Game } from '@/app/lib/games';
import { AUSPICES, CREEDS, DRIVES, TRIBES } from '@/app/lib/factions';
import { CLANS } from '@/app/lib/clans';
import type { Sheet, Skill } from '@/app/lib/sheets/types';
import { emptySheet } from '@/app/lib/sheets/empty';
import {
  PREDATORS,
  SKILL_SPREADS,
  STEPS,
  advantageBudget,
  budget,
  clanDisciplines,
  finalSheet,
  predatorOptions,
  problems,
  specialtiesNeeded,
  type SpreadKey,
  type StepKey,
  type Wizard,
} from '@/app/lib/creation/rules';
import { createCharacter } from '@/app/lib/actions/characters';
import { buttonGhost, buttonPrimary, fieldInput, fieldLabel, panel } from '@/app/ui/kit/styles';
import { usePreferences } from '@/app/ui/PreferencesContext';
import { SheetProvider } from '@/app/ui/sheets/SheetContext';
import Explain from '@/app/ui/sheets/Explain';
import { Advantages, Attributes, Convictions, Profile, Skills } from '@/app/ui/sheets/sections/common';
import { Edges, GiftsAndRites, Renown } from '@/app/ui/sheets/sections/werewolf-hunter';

// Tutorials, in our own words (Dark Pack: never copy rulebook text).
const TITLES: Record<StepKey, string> = {
  concept: 'Who are they?',
  faction: 'Where do they belong?',
  attributes: 'Attributes',
  skills: 'Skills',
  disciplines: 'Disciplines',
  predator: 'How do they feed?',
  renown: 'Renown and Gifts',
  edges: 'Edges and Perks',
  specialties: 'Specialties',
  convictions: 'Convictions and touchstones',
  advantages: 'Advantages and flaws',
  review: 'Ready?',
};

const GUIDE: Record<StepKey, (game: Game) => string> = {
  concept: () =>
    'Start with the person, not the numbers. A name and a short concept (“disgraced chef”, “bike courier who saw too much”) are enough to begin. Ambition is a long-term goal; desire is something they want right now.',
  faction: (g) =>
    g === 'vampire'
      ? 'Your clan is your vampiric family line. It decides which Disciplines come naturally to you and the weakness you carry. Hover a name on the sheet later for a reminder.'
      : g === 'werewolf'
        ? 'Your tribe is the werewolf nation you belong to; your auspice is the moon you were born under and the role it gives you in a pack.'
        : 'Your creed is how you approach the hunt. Your Drive is why you can’t stop; when a roll serves your Drive, Desperation can help you.',
  attributes: () =>
    'Attributes are what you are born with. Place one at 4 dots, three at 3, four at 2 and one at 1. The counter below tells you what’s left. Stamina sets your Health; Composure and Resolve set your Willpower.',
  skills: () =>
    'Skills are what you’ve learned. Choose how you want to spread them first, then click the dots. A roll usually adds an Attribute to a Skill, so think about what your character does well.',
  disciplines: () =>
    'Disciplines are your blood’s powers. Pick two of your clan’s Disciplines: one starts at two dots, the other at one. You’ll name your powers on the full sheet afterwards.',
  predator: () =>
    'Your predator type is how you hunt. It adds a dot to one of two Disciplines and can change your starting Humanity. It also brings some advantages and flaws: add them in the advantages step and tick “From predator type”.',
  renown: () =>
    'Renown is how other werewolves see you: Glory, Honor and Wisdom. Place three dots, no more than two in one. Then name your three starting Gifts: one from your breed (Native), one from your auspice and one from your tribe. Each Gift is tied to a kind of Renown you need at least one dot in.',
  edges: () =>
    'Edges are the special capabilities that set a hunter apart; Perks refine them. Take two Edges with one Perk between them, or one Edge with two Perks.',
  specialties: (g) =>
    g === 'vampire'
      ? 'A specialty is a narrow area where a skill shines, like Brawl (Grappling). Academics, Craft, Performance and Science always need one if you have dots in them. Your predator type gives one more, and you get one free.'
      : 'A specialty is a narrow area where a skill shines, like Firearms (Pistols). Pick three, on skills you have dots in.',
  convictions: () =>
    'A conviction is a line your character won’t cross lightly; a touchstone is a living person who keeps them true to it. Write at least one pair. They keep your character human when things get dark.',
  advantages: () =>
    'Spend seven dots on merits (useful traits) and backgrounds (contacts, money, a safe place), and take two dots of flaws. Ask your Storyteller if you’re unsure what fits the chronicle.',
  review: () => 'Check the summary. When you create the character you’ll land on the full sheet, already filled in. You can change anything there.',
};

const STORAGE = (game: Game) => `elysium:guided:${game}`;

function start(game: Game): Wizard {
  const sheet = emptySheet(game);
  if (game === 'werewolf') sheet.gifts = (['Native', 'Auspice', 'Tribe'] as const).map((source) => ({ name: '', source, renown: '' }));
  if (game === 'hunter') sheet.edges = [{ name: '', perks: [''] }];
  sheet.convictions = [{ conviction: '', touchstone: '' }];
  return { sheet };
}

function load(game: Game): { w: Wizard; step: number } {
  try {
    const saved = sessionStorage.getItem(STORAGE(game));
    if (saved) return JSON.parse(saved);
  } catch {
    // Storage blocked or corrupt: start fresh.
  }
  return { w: start(game), step: 0 };
}

function persist(game: Game, value: { w: Wizard; step: number } | null) {
  try {
    if (value) sessionStorage.setItem(STORAGE(game), JSON.stringify(value));
    else sessionStorage.removeItem(STORAGE(game));
  } catch {
    // Not fatal: the draft just won't survive a reload.
  }
}

function Choice({ checked, onSelect, title, blurb, children }: { checked: boolean; onSelect: () => void; title: string; blurb?: string; children?: ReactNode }) {
  return (
    <button
      type='button'
      aria-pressed={checked}
      onClick={onSelect}
      className={clsx(
        'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent',
        checked ? 'border-accent bg-accent/10' : 'border-bone/15 hover:border-bone/40',
      )}
    >
      <span className='flex items-center gap-2 font-display text-lg leading-tight'>
        {children}
        {title}
      </span>
      {blurb && <span className='text-xs leading-relaxed text-bone/55'>{blurb}</span>}
    </button>
  );
}

export default function GuidedCreation({ game }: { game: Game }) {
  const router = useRouter();
  const { guidance } = usePreferences();
  const [{ w, step }, setState] = useState(() => load(game));
  const [shown, setShown] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const steps = STEPS[game];
  const key = steps[step];
  const ids = { spec: useId() };

  const save = (next: { w: Wizard; step: number }) => {
    setState(next);
    persist(game, next);
  };
  const setW = (patch: Partial<Wizard>) => save({ w: { ...w, ...patch }, step });
  const update = (mutate: (draft: Sheet) => void) => {
    const sheet = structuredClone(w.sheet);
    mutate(sheet);
    setW({ sheet });
  };
  const go = (to: number) => {
    setShown([]);
    save({ w, step: Math.max(0, Math.min(steps.length - 1, to)) });
  };
  const next = () => {
    const left = problems(game, key, w);
    if (left.length) return setShown(left);
    go(step + 1);
  };
  const create = () =>
    startTransition(async () => {
      setError('');
      const result = await createCharacter(game, finalSheet(game, w));
      if (!result.ok) return setError(result.error);
      persist(game, null);
      router.push(`/vault/${game}/characters/${result.id}/edit?guided=1`);
    });

  const p = w.sheet.profile;
  const setProfile = (k: string, v: string) => update((d) => void (d.profile[k] = v));

  let body: ReactNode = null;
  switch (key) {
    case 'concept':
      body = (
        <Profile
          fields={[
            { key: 'name', label: 'Name' },
            { key: 'concept', label: 'Concept' },
            { key: 'ambition', label: 'Ambition' },
            { key: 'desire', label: 'Desire' },
            { key: 'chronicle', label: 'Chronicle' },
            { key: 'player', label: 'Player' },
          ]}
        />
      );
      break;
    case 'faction':
      body =
        game === 'vampire' ? (
          <div className='grid gap-2 sm:grid-cols-3 lg:grid-cols-4'>
            {Object.values(CLANS).map(({ name, Symbol }) => (
              <Choice key={name} checked={p.clan === name} onSelect={() => setProfile('clan', name)} title={name}>
                <Symbol aria-hidden className='h-6 w-6 shrink-0 text-accent [--knockout:transparent]' />
              </Choice>
            ))}
          </div>
        ) : game === 'werewolf' ? (
          <div className='flex flex-col gap-5'>
            <fieldset>
              <legend className={fieldLabel}>Tribe</legend>
              <div className='mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-4'>
                {TRIBES.map((t) => (
                  <Choice key={t} checked={p.tribe === t} onSelect={() => setProfile('tribe', t)} title={t} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className={fieldLabel}>Auspice</legend>
              <div className='mt-2 grid gap-2 sm:grid-cols-5'>
                {AUSPICES.map((a) => (
                  <Choice key={a} checked={p.auspice === a} onSelect={() => setProfile('auspice', a)} title={a} />
                ))}
              </div>
            </fieldset>
          </div>
        ) : (
          <div className='flex flex-col gap-5'>
            <fieldset>
              <legend className={fieldLabel}>Creed</legend>
              <div className='mt-2 grid gap-2 sm:grid-cols-5'>
                {CREEDS.map((c) => (
                  <Choice key={c} checked={p.creed === c} onSelect={() => setProfile('creed', c)} title={c} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className={fieldLabel}>Drive</legend>
              <div className='mt-2 grid gap-2 sm:grid-cols-4 lg:grid-cols-7'>
                {DRIVES.map((d) => (
                  <Choice key={d} checked={p.drive === d} onSelect={() => setProfile('drive', d)} title={d} />
                ))}
              </div>
            </fieldset>
          </div>
        );
      break;
    case 'attributes':
      body = <Attributes />;
      break;
    case 'skills':
      body = (
        <div className='flex flex-col gap-5'>
          <div className='grid gap-2 sm:grid-cols-3'>
            {(Object.keys(SKILL_SPREADS) as SpreadKey[]).map((k) => (
              <Choice key={k} checked={w.spread === k} onSelect={() => setW({ spread: k })} title={SKILL_SPREADS[k].label} blurb={SKILL_SPREADS[k].blurb} />
            ))}
          </div>
          {w.spread && <Skills specialties={false} />}
        </div>
      );
      break;
    case 'disciplines': {
      const clan = clanDisciplines(w.sheet);
      body = clan.length ? (
        <div className='grid gap-6 sm:grid-cols-2'>
          {(['clanTwo', 'clanOne'] as const).map((slot) => (
            <fieldset key={slot}>
              <legend className={fieldLabel}>{slot === 'clanTwo' ? 'At two dots' : 'At one dot'}</legend>
              <div className='mt-2 flex flex-col gap-2'>
                {clan.map((d) => (
                  <Choice key={d} checked={w[slot] === d} onSelect={() => setW({ [slot]: d })} title={d} />
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      ) : (
        <p className='text-bone/70'>
          {p.clan === 'Caitiff' ? 'Caitiff have no clan Disciplines. Ask your Storyteller which two to start with, and set them on the full sheet afterwards.' : 'Thin-bloods use alchemy rather than clan Disciplines. Set it up with your Storyteller on the full sheet.'}
        </p>
      );
      break;
    }
    case 'predator':
      body = (
        <div className='flex flex-col gap-5'>
          <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-5'>
            {Object.entries(PREDATORS).map(([name, info]) => (
              <Choice
                key={name}
                checked={p.predator === name}
                onSelect={() => save({ w: { ...w, sheet: { ...w.sheet, profile: { ...p, predator: name } }, predatorDiscipline: undefined }, step })}
                title={name}
                blurb={`${info.blurb}${info.humanity ? ` Humanity ${info.humanity > 0 ? '+' : ''}${info.humanity}.` : ''}`}
              />
            ))}
          </div>
          {p.predator && (
            <fieldset>
              <legend className={fieldLabel}>One extra dot in</legend>
              <div className='mt-2 flex flex-wrap gap-2'>
                {predatorOptions(w.sheet, p.predator).map((d) => (
                  <Choice key={d} checked={w.predatorDiscipline === d} onSelect={() => setW({ predatorDiscipline: d })} title={d} />
                ))}
              </div>
            </fieldset>
          )}
        </div>
      );
      break;
    case 'renown':
      body = (
        <div className='flex flex-col gap-6'>
          <Renown />
          <GiftsAndRites />
        </div>
      );
      break;
    case 'edges':
      body = <Edges />;
      break;
    case 'specialties': {
      const { required, total } = specialtiesNeeded(game, w.sheet);
      const predator = PREDATORS[p.predator ?? ''];
      const rated = (Object.entries(w.sheet.skills) as [Skill, { dots: number; specialty?: string }][]).filter(([, v]) => v.dots > 0);
      const have = rated.filter(([, v]) => v.specialty?.trim()).length;
      body = (
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-bone/65'>
            {have} of {total} specialties
            {required.length > 0 && ` · required: ${required.join(', ')}`}
            {predator && ` · predator type: one of ${predator.specialty.join(', ')}`}
          </p>
          <ul className='grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3'>
            {rated.map(([sk, v]) => (
              <li key={sk} className='flex items-center gap-3 border-b border-bone/[0.07] py-1.5'>
                <label htmlFor={`${ids.spec}-${sk}`} className={clsx('w-28 shrink-0 text-sm', required.includes(sk) || predator?.specialty.includes(sk) ? 'text-accent' : 'text-bone/80')}>
                  <Explain label={sk} />
                </label>
                <input
                  id={`${ids.spec}-${sk}`}
                  value={v.specialty ?? ''}
                  placeholder='Specialty'
                  onChange={(e) => update((d) => void (d.skills[sk] = { ...d.skills[sk]!, specialty: e.target.value || undefined }))}
                  className={`${fieldInput} py-1 text-sm italic`}
                />
              </li>
            ))}
          </ul>
        </div>
      );
      break;
    }
    case 'convictions':
      body = <Convictions />;
      break;
    case 'advantages': {
      const { merits, flaws } = advantageBudget(w.sheet);
      body = (
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-bone/65'>
            Merits and backgrounds: <span className={merits === 7 ? 'text-bone' : 'text-accent'}>{merits} of 7</span> · Flaws:{' '}
            <span className={flaws === 2 ? 'text-bone' : 'text-accent'}>{flaws} of 2</span>
          </p>
          <Advantages predatorSource={game === 'vampire'} game={game} />
        </div>
      );
      break;
    }
    case 'review': {
      const f = finalSheet(game, w);
      const rows: [string, string][] = [
        ['Name', p.name],
        ['Concept', p.concept],
        [game === 'vampire' ? 'Clan' : game === 'werewolf' ? 'Tribe' : 'Creed', game === 'vampire' ? p.clan : game === 'werewolf' ? `${p.tribe} · ${p.auspice}` : `${p.creed} · ${p.drive}`],
        ['Health / Willpower', `${f.trackers.health} / ${f.trackers.willpower}`],
      ];
      if (game === 'vampire') {
        rows.push(['Predator type', p.predator], ['Humanity', String(f.trackers.humanity)], ['Disciplines', (f.disciplines ?? []).map((d) => `${d.name} ${d.dots}`).join(', ')]);
      }
      body = (
        <dl className='grid gap-x-10 gap-y-4 sm:grid-cols-2'>
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt className={fieldLabel}>{k}</dt>
              <dd className='mt-1 font-display text-xl'>{v || '—'}</dd>
            </div>
          ))}
        </dl>
      );
      break;
    }
  }

  const last = step === steps.length - 1;
  const tracker = budget(game, key, w);

  return (
    <SheetProvider value={{ sheet: w.sheet, update }}>
      {/* Fits the screen on tablets and up; the step body scrolls only if it must. */}
      <div className={`flex flex-col gap-4 p-5 md:h-[calc(100svh-6.5rem)] md:p-7 ${panel}`}>
        <header className='flex flex-col gap-3'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <p className='text-xs tracking-[0.25em] text-accent uppercase'>
              New {GAMES[game].noun.one} · step {step + 1} of {steps.length}
            </p>
            {/* Points tracker: what's placed against what this step allows. */}
            {tracker.length > 0 && (
              <ul aria-label='Points' className='flex flex-wrap justify-end gap-1.5'>
                {tracker.map((t) => {
                  const done = t.have === t.want;
                  return (
                    <li
                      key={t.label}
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs tabular-nums transition-colors',
                        done ? 'border-accent/50 bg-accent/15 text-bone' : t.have > t.want ? 'border-accent text-accent' : 'border-bone/20 text-bone/75',
                      )}
                    >
                      {done && <MdCheck aria-hidden className='size-3.5 text-accent' />}
                      <span className='text-bone/55'>{t.label}</span> {t.have}/{t.want}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <ol className='flex gap-1.5' aria-label='Progress'>
            {steps.map((s, i) => (
              <li key={s} className='flex-1'>
                <button
                  type='button'
                  disabled={i > step}
                  onClick={() => go(i)}
                  aria-current={i === step ? 'step' : undefined}
                  aria-label={`${TITLES[s]}${i < step ? ' (done)' : ''}`}
                  className={clsx('block h-1.5 w-full rounded-full transition-colors', i < step ? 'bg-accent' : i === step ? 'bg-accent/60' : 'bg-bone/15')}
                />
              </li>
            ))}
          </ol>
          <h1 className='font-display text-4xl leading-none md:text-5xl'>{TITLES[key]}</h1>
          {guidance && (
            <p className='flex max-w-[80ch] gap-2 text-sm leading-relaxed text-bone/70'>
              <MdInfoOutline aria-hidden className='mt-0.5 size-4 shrink-0 text-accent' />
              {GUIDE[key](game)}
            </p>
          )}
        </header>

        <div className='min-h-0 grow overflow-y-auto pr-1'>{body}</div>

        {shown.length > 0 && (
          <div role='alert' className='rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm'>
            <p className='font-semibold'>Almost there. Before you move on:</p>
            <ul className='mt-1 list-disc pl-5 text-bone/80'>
              {shown.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {error && <p role='alert' className='text-sm text-accent'>{error}</p>}

        <footer className='flex items-center justify-between gap-3 border-t border-bone/10 pt-4'>
          <button type='button' onClick={() => go(step - 1)} disabled={step === 0} className={buttonGhost}>
            <MdArrowBack aria-hidden /> Back
          </button>
          <button
            type='button'
            onClick={() => {
              persist(game, null);
              setShown([]);
              setState({ w: start(game), step: 0 });
            }}
            className='text-xs text-bone/45 underline-offset-2 hover:text-bone hover:underline'
          >
            Start over
          </button>
          {last ? (
            <button type='button' onClick={create} disabled={pending} className={buttonPrimary}>
              <MdCheck aria-hidden /> {pending ? 'Creating…' : 'Create character'}
            </button>
          ) : (
            <button type='button' onClick={next} className={buttonPrimary}>
              Continue <MdArrowForward aria-hidden />
            </button>
          )}
        </footer>
      </div>
    </SheetProvider>
  );
}
