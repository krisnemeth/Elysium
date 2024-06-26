import React from 'react';
import Link from 'next/link';

interface GlowUpButtonMediumProps {
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonHref: string;
}

export default function GlowUpButtonMedium({
  buttonText,
  buttonIcon,
  buttonHref,
}: GlowUpButtonMediumProps) {
  return (
    <Link href={buttonHref}>
      <div className='relative group border border-slate-300/50 rounded-md'>
        <div className='absolute -inset-0.5 bg-rose-600 dark:red-700 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-full xl:max-w-full'></div>
        <button className='relative flex items-center justify-center bg-black px-2 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-full'>
          <span className='text-xs'>{buttonText}</span>
          {buttonIcon}
        </button>
      </div>
    </Link>
  );
}
