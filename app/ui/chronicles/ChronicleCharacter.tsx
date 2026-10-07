import Image from 'next/image';
import type { CharacterRecord } from '@/app/lib/data/characters';
import { toCharacter } from '@/app/lib/data/characters';
import { GAMES } from '@/app/lib/games';
import { ATTRIBUTES, SKILLS } from '@/app/lib/sheets/types';
import Dots from '@/app/ui/characters/Dots';
import CharacterSheetView from '@/app/ui/characters/CharacterSheetView';
import { factionName } from '@/app/ui/game/FactionMark';
import { panel } from '@/app/ui/kit/styles';
import SheetModal from './SheetModal';

const label = 'text-[0.6rem] tracking-[0.2em] text-bone/50 uppercase';

// The player's character at a glance: what they'll roll most, plus the full sheet in a dialog.
export default function ChronicleCharacter({ record }: { record: CharacterRecord }) {
  const c = toCharacter(record);
  const s = record.sheet;
  const t = s.trackers;
  const dmg = (k: 'health' | 'willpower') => {
    const d = s.damage?.[k];
    return d && (d.superficial || d.aggravated) ? ` (${[d.superficial && `${d.superficial} sup`, d.aggravated && `${d.aggravated} agg`].filter(Boolean).join(', ')})` : '';
  };
  const tracks: [string, number, number][] = [
    ['Health', t.health ?? 0, 10],
    ['Willpower', t.willpower ?? 0, 10],
    ...((record.game === 'vampire'
      ? [['Hunger', t.hunger ?? 0, 5], ['Humanity', t.humanity ?? 0, 10]]
      : record.game === 'werewolf'
        ? [['Rage', t.rage ?? 0, 5]]
        : [['Desperation', t.desperation ?? 0, 5], ['Danger', t.danger ?? 0, 5]]) as [string, number, number][]),
  ];
  const skills = Object.values(SKILLS)
    .flat()
    .map((sk) => [sk, s.skills[sk]] as const)
    .filter(([, v]) => (v?.dots ?? 0) >= 2)
    .sort((a, b) => (b[1]?.dots ?? 0) - (a[1]?.dots ?? 0));
  const powers =
    record.game === 'vampire'
      ? (s.disciplines ?? []).map((d) => `${d.name} ${d.dots}`)
      : record.game === 'werewolf'
        ? (s.gifts ?? []).map((g) => g.name)
        : (s.edges ?? []).map((e) => e.name);

  return (
    <section aria-label='Your character' className={`flex flex-col gap-4 p-5 ${panel}`}>
      <div className='flex items-center gap-4'>
        <span className='relative size-16 shrink-0 overflow-hidden rounded-xl'>
          <Image src={c.image.src} unoptimized={c.image.unoptimized} alt='' fill sizes='4rem' className='object-cover object-top' />
        </span>
        <div className='min-w-0 grow'>
          <p className={label}>{GAMES[record.game].name} · {factionName(c) || GAMES[record.game].noun.one}</p>
          <h2 className='truncate font-display text-2xl leading-tight'>{c.name}</h2>
        </div>
      </div>

      {/* Compact Attribute dots, sized for the sidebar. */}
      <div className='grid grid-cols-3 gap-x-3 gap-y-1'>
        {Object.values(ATTRIBUTES).flat().map((a) => (
          <div key={a} role='img' aria-label={`${a}: ${s.attributes[a]} of 5`} title={a} className='flex items-center justify-between gap-1.5 text-xs'>
            <span aria-hidden className='shrink-0 text-bone/75'>{a.slice(0, 3)}</span>
            <span aria-hidden className='flex gap-[3px]'>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`size-[7px] rounded-full ${i < s.attributes[a] ? 'bg-accent' : 'border border-bone/30'}`} />
              ))}
            </span>
          </div>
        ))}
      </div>

      <ul className='flex flex-col gap-1.5'>
        {tracks.map(([name, value, max]) => (
          <li key={name} className='flex items-center justify-between gap-2 text-sm'>
            <span>
              {name}
              <span className='text-xs text-accent'>{name === 'Health' ? dmg('health') : name === 'Willpower' ? dmg('willpower') : ''}</span>
            </span>
            <Dots label={name} value={value} max={max} shape={name === 'Humanity' ? 'dot' : 'box'} />
          </li>
        ))}
      </ul>

      {skills.length > 0 && (
        <div>
          <p className={label}>Best skills</p>
          <p className='mt-1 text-sm leading-relaxed text-bone/80'>
            {skills.map(([sk, v]) => `${sk} ${v!.dots}${v!.specialty ? ` (${v!.specialty})` : ''}`).join(' · ')}
          </p>
        </div>
      )}
      {powers.length > 0 && (
        <div>
          <p className={label}>{record.game === 'vampire' ? 'Disciplines' : record.game === 'werewolf' ? 'Gifts' : 'Edges'}</p>
          <p className='mt-1 text-sm text-bone/80'>{powers.join(' · ')}</p>
        </div>
      )}

      <div className='flex flex-wrap gap-2'>
        <SheetModal label={`${c.name}’s sheet`}>
          <div data-game={record.game}>
            <CharacterSheetView record={record} back={{ href: `/vault/${record.game}/characters/${record.id}`, label: 'Open on its own page' }} />
          </div>
        </SheetModal>
      </div>
    </section>
  );
}
