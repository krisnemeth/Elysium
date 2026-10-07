'use client';

import { useActionState, useState, useTransition } from 'react';
import { MdCheck, MdContentCopy } from 'react-icons/md';
import type { ActionState } from '@/app/lib/actions/social';
import { sendFriendRequest, updateDisplayName } from '@/app/lib/actions/social';
import { buttonGhost, buttonPrimary, fieldInput, fieldLabel } from '@/app/ui/kit/styles';

function Feedback({ state }: { state: ActionState }) {
  if (!state.error && !state.message) return null;
  return (
    <p role='status' className={`text-sm ${state.error ? 'text-accent' : 'text-bone/70'}`}>
      {state.error ?? state.message}
    </p>
  );
}

export function DisplayNameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateDisplayName, {});
  return (
    <form action={action} className='flex flex-col gap-3'>
      <label htmlFor='display_name' className={fieldLabel}>
        Your name, as friends see it
      </label>
      <div className='flex items-end gap-3'>
        <input id='display_name' name='display_name' defaultValue={name} maxLength={40} required className={fieldInput} />
        <button disabled={pending} className={buttonGhost}>Save</button>
      </div>
      <Feedback state={state} />
    </form>
  );
}

export function FriendCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const pretty = `${code.slice(0, 4)}-${code.slice(4)}`;
  return (
    <div className='flex flex-col gap-3'>
      <p className={fieldLabel}>Your friend code</p>
      <div className='flex flex-wrap items-center gap-3'>
        <code className='rounded-xl bg-bone/[0.06] px-4 py-2 font-display text-3xl tracking-[0.15em]'>{pretty}</code>
        <button
          type='button'
          className={buttonGhost}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              // Clipboard blocked: the code is on screen to copy by hand.
            }
          }}
        >
          {copied ? <MdCheck aria-hidden /> : <MdContentCopy aria-hidden />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className='text-sm text-bone/55'>Share it with friends so they can add you. Nobody can find you without it.</p>
    </div>
  );
}

export function AddFriendForm() {
  const [state, action, pending] = useActionState(sendFriendRequest, {});
  return (
    <form action={action} className='flex flex-col gap-3'>
      <label htmlFor='code' className={fieldLabel}>
        Add a friend by code
      </label>
      <div className='flex items-end gap-3'>
        <input id='code' name='code' placeholder='ABCD-2345' autoComplete='off' className={`${fieldInput} uppercase tracking-[0.15em]`} required />
        <button disabled={pending} className={buttonPrimary}>Send request</button>
      </div>
      <Feedback state={state} />
    </form>
  );
}

// A button that runs a server action, with a pending state.
export function ActionButton({
  action,
  children,
  className = buttonGhost,
  confirm,
}: {
  action: () => Promise<unknown>;
  children: React.ReactNode;
  className?: string;
  // Asks once more (inline) before running.
  confirm?: string;
}) {
  const [pending, start] = useTransition();
  const [asking, setAsking] = useState(false);
  if (confirm && asking)
    return (
      <span className='inline-flex flex-wrap items-center gap-2' role='group'>
        <span className='text-sm text-bone/70'>{confirm}</span>
        <button type='button' disabled={pending} className={className} onClick={() => start(async () => void (await action()))}>
          Yes
        </button>
        <button type='button' className={buttonGhost} onClick={() => setAsking(false)}>
          No
        </button>
      </span>
    );
  return (
    <button type='button' disabled={pending} className={className} onClick={() => (confirm ? setAsking(true) : start(async () => void (await action())))}>
      {children}
    </button>
  );
}
