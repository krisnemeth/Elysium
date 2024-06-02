import SideNav from '../ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // md:overflow-hidden was on next line
    <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
      <div className='w-full flex-none md:w-48 mx-2 md:my-4 bg-black shadow-2xl shadow-black'>
        <SideNav />
      </div>
      <div className='flex-grow p-2 md:overflow-y-auto md:p-4'>{children}</div>
    </div>
  );
}
