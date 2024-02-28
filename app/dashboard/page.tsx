import Image from 'next/image';
import Navbar from '@/app/ui/navbar';

export default function Dashboard() {
  return (
    <div className='min-h-screen'>
      <Navbar />

      <h1 className='text-6xl text-center'>DASHBOARD</h1>
    </div>
  );
}
