import SideNav from '../ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // md:overflow-hidden was on next line
    <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
      <div className='h-auto w-full flex-none md:w-40 lg:w-48 md:mx-2 md:my-4 shadow-md shadow-black'>
        <SideNav />
      </div>
      <div className='flex-grow p-2 md:overflow-y-auto md:py-4 md:px-2 mt-32 md:mt-0'>
        {children}
      </div>
    </div>
  );
}
