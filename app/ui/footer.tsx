import Image from 'next/image';

export default function Footer() {
  return (
    <div className='flex justify-center w-full px-4 py-2 bg-black mt-10'>
      <div className='z-50 flex flex-grow justify-center'>
        <div className=''>
          <p className='relative text-justify text-slate-300 text-sm'>
            &copy;2024 Elysium. All Rights Reserved. All product and company
            names are trademarks&#8482; or registered&#174; trademarks of their
            respective holders.
          </p>
        </div>
      </div>
    </div>
  );
}
