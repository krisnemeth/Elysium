import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { acceptFriend, removeFriend } from '@/app/lib/actions/social';
import { getFriends, getMe } from '@/app/lib/data/social';
import { isGame } from '@/app/lib/games';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { ActionButton, AddFriendForm, FriendCode } from '@/app/ui/social/forms';

export const metadata: Metadata = { title: 'Friends' };

const small = 'rounded-full border border-bone/20 px-4 py-1.5 text-xs text-bone/80 transition hover:border-bone/50 hover:text-bone';
const smallPrimary = 'rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110';

export default async function Friends({ params }: PageProps<'/vault/[game]/friends'>) {
  const { game } = await params;
  if (!isGame(game)) notFound();
  const [me, friends] = await Promise.all([getMe(), getFriends()]);
  const incoming = friends.filter((f) => f.status === 'pending' && f.direction === 'incoming');
  const outgoing = friends.filter((f) => f.status === 'pending' && f.direction === 'outgoing');
  const accepted = friends.filter((f) => f.status === 'accepted');

  return (
    <div className='flex flex-col gap-10'>
      <PageHeader eyebrow='Friends' title='Your circle.' description='Add the people you play with, then bring them into a chronicle.' />
      <div className='grid gap-5 lg:grid-cols-2'>
        <section aria-label='Your friend code' className={`flex flex-col gap-8 p-6 ${panel}`}>
          {me && <FriendCode code={me.friend_code} />}
        </section>
        <section aria-label='Add a friend' className={`flex flex-col gap-6 p-6 ${panel}`}>
          <AddFriendForm />
          {incoming.length > 0 && (
            <div>
              <h2 className='font-display text-2xl'>Asking to be friends</h2>
              <ul className='mt-3 flex flex-col'>
                {incoming.map((f) => (
                  <li key={f.friendshipId} className='flex flex-wrap items-center justify-between gap-3 border-b border-bone/[0.07] py-3'>
                    <span>{f.name}</span>
                    <span className='flex gap-2'>
                      <ActionButton action={acceptFriend.bind(null, f.friendshipId)} className={smallPrimary}>Accept</ActionButton>
                      <ActionButton action={removeFriend.bind(null, f.friendshipId)} className={small}>Decline</ActionButton>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {outgoing.length > 0 && (
            <div>
              <h2 className='font-display text-xl text-bone/70'>Waiting for them</h2>
              <ul className='mt-2 flex flex-col'>
                {outgoing.map((f) => (
                  <li key={f.friendshipId} className='flex items-center justify-between gap-3 border-b border-bone/[0.07] py-2.5 text-sm text-bone/70'>
                    {f.name}
                    <ActionButton action={removeFriend.bind(null, f.friendshipId)} className={small}>Cancel</ActionButton>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <section aria-labelledby='friends-title' className={`p-6 lg:col-span-2 ${panel}`}>
          <h2 id='friends-title' className='font-display text-3xl'>Friends</h2>
          {accepted.length ? (
            <ul className='mt-4 grid gap-x-8 sm:grid-cols-2'>
              {accepted.map((f) => (
                <li key={f.friendshipId} className='flex items-center justify-between gap-3 border-b border-bone/[0.07] py-3'>
                  <span className='font-display text-xl'>{f.name}</span>
                  <ActionButton action={removeFriend.bind(null, f.friendshipId)} className={small} confirm={`Remove ${f.name}?`}>
                    Remove
                  </ActionButton>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-3 text-sm text-bone/50'>No friends yet. Send your code to the people you play with, or add theirs.</p>
          )}
        </section>
      </div>
    </div>
  );
}
