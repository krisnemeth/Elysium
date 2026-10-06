const LINES = [
  'The Masquerade must be maintained',
  'Elysium is neutral ground',
  'The Beast is always hungry',
  'Every sheet stays sealed',
];

export default function Marquee() {
  const run = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className='flex shrink-0 items-center'>
      {LINES.map((line) => (
        <li key={line} className='flex items-center'>
          <span className='px-6'>{line}</span>
          <span aria-hidden className='font-c-serif text-[0.9em] normal-case'>
            &#9765;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className='overflow-hidden bg-blood py-4 font-c-sans text-2xl font-extrabold tracking-[0.04em] text-bone uppercase [font-variation-settings:"wdth"_70] md:text-4xl'>
      <div className='marquee flex w-max'>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
