import type { Metadata } from 'next';
import Link from 'next/link';
import { MdArrowOutward } from 'react-icons/md';
import { respondToInvite } from '@/app/lib/actions/social';
import { getChronicles } from '@/app/lib/data/social';
import { GAMES } from '@/app/lib/games';
import { panel } from '@/app/ui/kit/styles';
import SocialShell, { TextLink } from '@/app/ui/social/SocialShell';
import { ActionButton } from '@/app/ui/social/forms';
import CreateChronicle from '@/app/ui/chronicles/CreateChronicle';

export const metadata: Metadata = { title: 'Chronicles' };

const small = 'rounded-full border border-bone/20 px-4 py-1.5 text-xs text-bone/80 transition hover:border-bone/50 hover:text-bone';
const smallPrimary = 'rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110';

export default async function Chronicles() {
  const list = await getChronicles();
  const invites = list.filter((c) => c.membership?.status === 'invited');
  const joined = list.filter((c) => c.membership?.status === 'joined');

  return (
    <SocialShell
      eyebrow='Chronicles'
      title='Your tables.'
      description={
        <>
          A chronicle is a group playing together: a Storyteller (or the Storyteller bot), players and their characters, a shared roll log and
          session notes. Invite people from your <TextLink href='/vault/friends'>friends</TextLink>.
        </>
      }
    >
      <div className='flex flex-col gap-8'>
        {invites.length > 0 && (
          <section aria-labelledby='invites-title' className={`p-6 ${panel}`}>
            <h2 id='invites-title' className='font-display text-2xl'>Invitations</h2>
            <ul className='mt-3 flex flex-col'>
              {invites.map(({ chronicle: c }) => (
                <li key={c.id} className='flex flex-wrap items-center justify-between gap-3 border-b border-bone/[0.07] py-3'>
                  <span>
                    <span className='font-display text-xl'>{c.name}</span>
                    <span className='ml-2 text-xs tracking-[0.15em] text-bone/50 uppercase'>{GAMES[c.game].name}</span>
                  </span>
                  <span className='flex gap-2'>
                    <ActionButton action={respondToInvite.bind(null, c.id, true)} className={smallPrimary}>Join</ActionButton>
                    <ActionButton action={respondToInvite.bind(null, c.id, false)} className={small}>Decline</ActionButton>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {joined.length > 0 ? (
          <ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {joined.map(({ chronicle: c, membership }) => {
              const { Logo, title } = GAMES[c.game];
              return (
                <li key={c.id}>
                  <Link href={`/vault/chronicles/${c.id}`} className={`group flex h-full flex-col gap-3 p-6 transition hover:-translate-y-1 ${panel}`}>
                    <Logo aria-label={title} role='img' className='h-9 w-auto self-start text-bone/80' />
                    <span className='font-display text-2xl leading-tight'>{c.name}</span>
                    <span className='text-xs tracking-[0.15em] text-bone/50 uppercase'>
                      {c.storyteller === 'bot' ? 'Storyteller bot' : membership?.role === 'storyteller' ? 'You’re the Storyteller' : 'Player'}
                    </span>
                    <span className='mt-auto inline-flex items-center gap-1 pt-2 text-sm text-bone/70 group-hover:text-accent'>
                      Open <MdArrowOutward aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className='text-bone/55'>You’re not in any chronicles yet. Start one below, or ask a friend to invite you.</p>
        )}

        <CreateChronicle />
      </div>
    </SocialShell>
  );
}
