'use client';

import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { haptic } from '@/app/lib/haptics';

// phoneOnly: a section that only exists on phones (elsewhere its content sits in the page's header).
type Section = { id: string; label: string; phoneOnly?: boolean };

const PHONE = '(max-width: 47.99rem)';

// Touches that start on these keep their own sideways gestures (dot ratings, fields, scrolling strips).
const OWN_GESTURES = '[role=slider], input, textarea, select, [data-own-swipe]';

/*
  A sheet's sections with sticky tabs. From tablets up it's one long page: the
  tabs jump to a section and highlight the one in view. On phones only the
  chosen section shows (plans/mobile.md): the tabs switch between them, and so
  does a sideways swipe. The sections are the children, each an element with
  data-section='<id>'; they can be server-rendered.
*/
// tabsOnPhones: the tabs only exist on phones (pages short enough to need no jump links elsewhere).
export default function SheetSections({ sections, children, tabsOnPhones = false }: { sections: Section[]; children: ReactNode; tabsOnPhones?: boolean }) {
  const [phone, setPhone] = useState(false);
  // From tablets up, phone-only sections aren't there to highlight.
  const firstShared = sections.find((s) => !s.phoneOnly)?.id;
  const [chosen, setActive] = useState(sections[0]?.id ?? '');
  const active = !phone && sections.find((s) => s.id === chosen)?.phoneOnly && firstShared ? firstShared : chosen;
  const strip = useRef<HTMLUListElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = matchMedia(PHONE);
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Long page: follow the section in view.
  useEffect(() => {
    if (phone) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive((a) => visible[0].target.getAttribute('data-section') ?? a);
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    body.current?.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [phone, sections]);

  // Keep the active tab in view in the strip.
  useEffect(() => {
    strip.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  const show = (id: string) => {
    setActive(id);
    // Back to the top of the sections, just under the tabs.
    const top = (body.current?.getBoundingClientRect().top ?? 0) + scrollY - 140;
    if (scrollY > top) scrollTo({ top, behavior: 'instant' });
  };

  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent) => {
    const t = e.target as Element;
    swipe.current = phone && !t.closest(OWN_GESTURES) ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 2) return;
    const i = sections.findIndex((s) => s.id === active);
    const next = sections[i + (dx < 0 ? 1 : -1)];
    if (next) {
      show(next.id);
      haptic('select');
    }
  };

  return (
    <>
      <nav aria-label='Sheet sections' className={`sticky top-20 z-30 -mx-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] md:top-4 ${tabsOnPhones ? 'md:hidden' : ''}`} data-own-swipe>
        <ul ref={strip} className='flex w-max gap-1 rounded-full border border-bone/10 bg-ink/75 p-1 shadow-[0_1rem_2rem_-1rem_rgb(0_0_0/0.8)] backdrop-blur-xl'>
          {sections.map(({ id, label, phoneOnly }) => (
            <li key={id} className={phoneOnly ? 'md:hidden' : undefined}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  if (!phone) return;
                  e.preventDefault();
                  show(id);
                }}
                aria-current={active === id ? (phone ? 'page' : 'location') : undefined}
                className={`block rounded-full px-4 py-1.5 text-xs whitespace-nowrap transition-[background-color,color,box-shadow] duration-500 ease-(--ease-out-expo) focus-visible:outline-2 focus-visible:outline-accent ${
                  active === id ? 'bg-accent text-on-accent shadow-[0_0_1rem_-0.25rem_var(--accent)]' : 'text-bone/60 hover:bg-bone/[0.06] hover:text-bone'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* Phones: only the active section. */}
      <style>{`@media ${PHONE} { [data-sheet-sections] [data-section]:not([data-section='${chosen}']) { display: none; } }`}</style>
      <div ref={body} data-sheet-sections onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {children}
      </div>
    </>
  );
}
