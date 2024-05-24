import React from 'react';

interface GlowUpButtonLargeProps {
  buttonText: string;
  buttonIcon?: React.ReactNode;
}

export default function GlowUpButtonLarge({
  buttonText,
  buttonIcon,
}: GlowUpButtonLargeProps) {
  return (
    <div className='relative group'>
      <div className='absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-violet-600 dark:from-zinc-700 dark:to-neutral-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 w-full xl:max-w-80'></div>
      <button className='relative flex items-center justify-center bg-black px-4 py-2 text-slate-300 rounded-lg group-hover:text-slate-100 transition duration-200 ease-in-out w-44 xl:w-80 cursor-pointer'>
        <span className='text-lg'>{buttonText}</span>
        {buttonIcon}
      </button>
    </div>
  );
}
