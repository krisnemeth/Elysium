'use client';

import { useEffect, useState } from 'react';

// Sticky jump links that highlight the section currently in view.
export default function SheetNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label='Sheet sections'
      className='sticky top-20 z-30 -mx-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:top-4'
    >
      <ul className='flex w-max gap-1 rounded-full border border-bone/10 bg-ink/75 p-1 shadow-[0_1rem_2rem_-1rem_rgb(0_0_0/0.8)] backdrop-blur-xl'>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={`block rounded-full px-4 py-1.5 text-xs whitespace-nowrap transition-[background-color,color,box-shadow] duration-500 ease-(--ease-out-expo) focus-visible:outline-2 focus-visible:outline-accent ${
                active === id
                  ? 'bg-accent text-white shadow-[0_0_1rem_-0.25rem_var(--accent)]'
                  : 'text-bone/60 hover:bg-bone/[0.06] hover:text-bone'
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
