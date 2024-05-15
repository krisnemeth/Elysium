export default function Footer() {
  let currentYear = new Date().getFullYear();

  return (
    <div className='hidden md:fixed md:bottom-0 z-10 lg:flex w-full px-10 py-4 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-100 fixed bottom-0'>
      <div className='z-50 flex flex-grow justify-center'>
        <div className=''>
          <p className='relative text-justify text-slate-300 text-xs'>
            &copy;{currentYear} Elysium. All Rights Reserved. All product and
            company names are trademarks&#8482; or registered&#174; trademarks
            of their respective holders.
          </p>
        </div>
      </div>
    </div>
  );
}
