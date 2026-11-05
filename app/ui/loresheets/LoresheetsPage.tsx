import Link from 'next/link';
import { GiScrollUnfurled } from 'react-icons/gi';
import { GAMES, GAMES_ORDER, type Game } from '@/app/lib/games';
import { LORE_KINDS, type LoreKind } from '@/app/lib/loresheets';
import EmptyState from '@/app/ui/kit/EmptyState';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { LORE_ICONS } from '@/app/ui/loresheets/icons';
import NewLoresheet from '@/app/ui/loresheets/NewLoresheet';

export type LoresheetCard = { id: string; game: Game; kind: LoreKind; title: string; content: Record<string, string> };

const filterClass = (on: boolean) =>
  `rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent ${on ? 'bg-accent text-on-accent' : 'text-bone/60 hover:bg-bone/[0.05] hover:text-bone'}`;

// Every loresheet in one place, each tagged with its game; `game` narrows the list.
export default function LoresheetsPage({ list, game }: { list: LoresheetCard[]; game?: Game }) {
  const shown = game ? list.filter((l) => l.game === game) : list;
  const kinds = (Object.keys(LORE_KINDS) as LoreKind[]).filter((k) => shown.some((l) => l.kind === k));

  return (
    <div className='flex flex-col gap-8'>
      <PageHeader
        eyebrow='Loresheets'
        title='The lore.'
        description='Places, histories and faces that don’t fit on a character sheet, from all three games.'
        actions={<NewLoresheet initialGame={game} />}
      />
      <nav aria-label='Filter by game' className='flex w-fit flex-wrap gap-1 rounded-xl bg-bone/[0.06] p-1'>
        <Link href='/vault/loresheets' aria-current={!game ? 'true' : undefined} className={filterClass(!game)}>All</Link>
        {GAMES_ORDER.map((g) => (
          <Link key={g} href={`/vault/loresheets?game=${g}`} data-tint={g} aria-current={g === game ? 'true' : undefined} className={filterClass(g === game)}>
            {GAMES[g].name}
          </Link>
        ))}
      </nav>
      {shown.length === 0 ? (
        <EmptyState icon={<GiScrollUnfurled aria-hidden />} title='No loresheets yet'>
          Start one for a place the story keeps returning to, a character’s history, or an NPC worth remembering.
        </EmptyState>
      ) : (
        kinds.map((k) => {
          const Icon = LORE_ICONS[k];
          return (
            <section key={k} aria-label={LORE_KINDS[k].label}>
              <h2 className='flex items-center gap-3 font-display text-3xl'>
                <Icon aria-hidden className='size-7 text-accent' />
                {LORE_KINDS[k].label}s
              </h2>
              <ul className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {shown
                  .filter((l) => l.kind === k)
                  .map((l) => (
                    <li key={l.id}>
                      <Link href={`/vault/loresheets/${l.id}`} data-tint={l.game} className={`flex h-full flex-col gap-2 p-5 transition hover:-translate-y-1 ${panel}`}>
                        <span className='text-[0.65rem] tracking-[0.15em] text-bone/45 uppercase'>{GAMES[l.game].name}</span>
                        <span className='font-display text-2xl leading-tight'>{l.title || `Untitled ${LORE_KINDS[k].noun}`}</span>
                        <span className='line-clamp-3 text-sm text-bone/60'>
                          {Object.values(l.content).find((v) => v?.trim()) || 'Nothing written yet.'}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
