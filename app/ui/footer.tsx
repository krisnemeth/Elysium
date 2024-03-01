import Image from 'next/image';

export default function Footer() {
  return (
    <div className='flex justify-center w-full px-4 py-2 border-t-2 border-red-800'>
      <div className='z-50 flex flex-grow justify-center'>
        <div className=''>
          <p className='relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'>
            Copyright &copy; 2024. Developed by Krisztian Nemeth
          </p>
        </div>
      </div>
    </div>
  );
}
