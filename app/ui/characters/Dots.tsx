// Read-only dots (or boxes) for a rating.
export default function Dots({ value, max = 5, shape = 'dot', label }: { value: number; max?: number; shape?: 'dot' | 'box'; label: string }) {
  return (
    <span role='img' aria-label={`${label}: ${value} of ${max}`} className='inline-flex shrink-0 items-center gap-1.5'>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`block size-2.5 border ${shape === 'dot' ? 'rotate-45 rounded-[2px]' : 'rounded-[3px]'} ${
            i < value ? 'border-accent bg-accent shadow-[0_0_0.5rem_-0.1rem_var(--accent)]' : 'border-bone/30'
          }`}
        />
      ))}
    </span>
  );
}
