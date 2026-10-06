import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative min-h-svh bg-ink text-bone transition-colors duration-500'>
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className='grain pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-10%,var(--accent-deep),transparent_70%),radial-gradient(ellipse_50%_40%_at_0%_100%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)] opacity-70'
      />
      <SideNav />
      <main
        id='main'
        className='relative px-4 pt-24 pb-32 md:pt-10 md:pr-8 md:pb-16 md:pl-72'
      >
        <div className='mx-auto max-w-6xl'>{children}</div>
      </main>
    </div>
  );
}
