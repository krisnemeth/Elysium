import Link from 'next/link';
import type { ReactNode } from 'react';
import { MdAdd } from 'react-icons/md';
import { buttonPrimary, panel } from './styles';

// Shown where a list would be when there's nothing in it yet.
export default function EmptyState({
  icon,
  title,
  children,
  action,
  bare = false,
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
  // Without the panel, for use inside a section that already has one.
  bare?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 px-6 py-10 text-center ${bare ? '' : panel}`}>
      {icon && <span className='text-accent/80 [&>svg]:size-10'>{icon}</span>}
      <h2 className='font-display text-2xl'>{title}</h2>
      {children && <p className='max-w-[44ch] text-sm leading-relaxed text-bone/60'>{children}</p>}
      {action && (
        <Link href={action.href} className={`mt-3 ${buttonPrimary}`}>
          <MdAdd aria-hidden className='size-4 transition-transform duration-300 group-hover:rotate-90' />
          {action.label}
        </Link>
      )}
    </div>
  );
}
