import type { ReactNode } from 'react';

// Editorial page heading for the concept app.
export default function Headline({
  kicker,
  title,
  lead,
  aside,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className='grid gap-8 border-b border-paper/15 pb-10 md:grid-cols-12'>
      <div className='md:col-span-8'>
        <p className='font-c-mono text-xs tracking-[0.25em] text-blood uppercase'>{kicker}</p>
        <h1 className='mt-4 font-c-sans text-[clamp(3.25rem,9vw,7.5rem)] leading-[0.82] font-black tracking-[-0.01em] text-balance uppercase [font-variation-settings:"wdth"_62]'>
          {title}
        </h1>
      </div>
      <div className='flex flex-col justify-end gap-6 md:col-span-4'>
        {lead && <p className='max-w-[40ch] text-lg leading-relaxed text-pretty text-paper/70'>{lead}</p>}
        {aside}
      </div>
    </header>
  );
}
