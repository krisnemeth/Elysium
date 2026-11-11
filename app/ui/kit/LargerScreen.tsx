'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { MdCheck, MdContentCopy } from 'react-icons/md';
import { buttonGhost } from '@/app/ui/kit/styles';

const PHONE = '(max-width: 47.99rem)';

/*
  For features kept to larger screens during the beta (plans/mobile.md):
  below 768px the fallback shows instead. Until the browser says which
  screen it is, both are rendered and CSS picks; then only one stays
  mounted, so phones don't run the table at all.
*/
export default function LargerScreen({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [phone, setPhone] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  // The children keep one wrapper (display: contents) throughout, so larger screens never remount them.
  return (
    <>
      <div className='max-md:hidden md:contents'>{phone ? null : children}</div>
      {phone !== false && <div className='md:hidden'>{fallback}</div>}
    </>
  );
}

// Copies this page's address, to open it on another device.
export function CopyPageLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type='button'
      className={buttonGhost}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked: the address bar still has it.
        }
      }}
    >
      {copied ? <MdCheck aria-hidden /> : <MdContentCopy aria-hidden />} {copied ? 'Copied' : 'Copy the link'}
    </button>
  );
}
