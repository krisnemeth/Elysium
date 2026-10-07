'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { signIn, signUp, type AuthState } from '@/app/lib/actions/auth';

const input =
  'w-full rounded-xl border border-bone/15 bg-bone/[0.04] px-4 py-3 text-bone placeholder:text-bone/30 transition-[border-color,box-shadow] duration-300 hover:border-bone/30 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_25%,transparent)] focus:outline-none';
const label = 'mb-1.5 block text-[0.7rem] tracking-[0.2em] text-bone/55 uppercase';

export default function EmailForm({ mode, next }: { mode: 'login' | 'signup'; next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === 'login' ? signIn : signUp, {});

  return (
    <form action={action} className='flex flex-col gap-4'>
      {next && <input type='hidden' name='next' value={next} />}
      {mode === 'signup' && (
        <div>
          <label htmlFor='display_name' className={label}>Name <span className='normal-case tracking-normal text-bone/35'>(optional)</span></label>
          <input id='display_name' name='display_name' autoComplete='nickname' className={input} placeholder='What should we call you?' />
        </div>
      )}
      <div>
        <label htmlFor='email' className={label}>Email</label>
        <input id='email' name='email' type='email' required autoComplete='email' defaultValue={state.email} className={input} />
      </div>
      <div>
        <label htmlFor='password' className={label}>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          required
          minLength={mode === 'signup' ? 8 : undefined}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className={input}
          placeholder={mode === 'signup' ? 'At least 8 characters' : undefined}
        />
      </div>

      <p aria-live='polite' className='min-h-5 text-sm text-accent'>{state.error}</p>

      <button
        disabled={pending}
        className='rounded-full bg-bone px-6 py-3.5 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_2rem_-0.5rem_var(--accent)] active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone'
      >
        {pending ? 'One moment…' : mode === 'login' ? 'Log in' : 'Create account'}
      </button>

      <p className='text-center text-sm text-bone/60'>
        {mode === 'login' ? (
          <>New here? <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'} className='text-bone underline underline-offset-4 hover:text-accent'>Create an account</Link></>
        ) : (
          <>Already have one? <Link href='/login' className='text-bone underline underline-offset-4 hover:text-accent'>Log in</Link></>
        )}
      </p>
    </form>
  );
}
