import Image from 'next/image';
import { Metadata } from 'next';
import OverviewCard from '@/app/ui/dashboard/OverviewCard';
import CardList from '@/app/ui/dashboard/CardList';
import CardListItem from '@/app/ui/dashboard/CardListItem';

import {
  BrujahLogo,
  VentrueLogo,
  MalkavianLogo,
  TremereLogo,
  GangrelLogo,
  LasombraLogo,
  BanuHaqimLogo,
} from '@/app/ui/svgs';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function Page() {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col items-center mx-2 p-4 border border-slate-300/50 rounded-xl bg-black shadow-md shadow-black'>
        <h1 className='text-2xl text-slate-300/80'>Overview</h1>
      </div>
      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-4 mx-2'>
        <OverviewCard cardTitle='Characters Finished:' Amount={6}>
          <CardList>
            <CardListItem
              characterImage={
                <Image
                  src={'/Female1.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName='Trixx Laveau'
              clanSymbol={<BrujahLogo className='text-slate-300 h-5' />}
            />
            <CardListItem
              characterImage={
                <Image
                  src={'/Ventrue.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName='Ailah Al-Malik'
              clanSymbol={<VentrueLogo className='text-slate-300 h-5' />}
            />
            <CardListItem
              characterImage={
                <Image
                  src={'/Malkavian.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName='Claire Voyant'
              clanSymbol={<MalkavianLogo className='text-slate-300 h-5' />}
            />
            <CardListItem
              characterImage={
                <Image
                  src={'/Tremere.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName='Agatha Ramalho'
              clanSymbol={<TremereLogo className='text-slate-300 h-5' />}
            />
            <CardListItem
              characterImage={
                <Image
                  src={'/Gangrel.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName='Chelsea Grimm'
              clanSymbol={<GangrelLogo className='text-slate-300 h-5' />}
            />
          </CardList>
        </OverviewCard>
        <OverviewCard cardTitle='Character Drafts:' Amount={2}>
          <CardList>
            <CardListItem
              characterImage={
                <Image
                  src={'/Female3.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName="Ada O'Connor"
              clanSymbol={<LasombraLogo className='text-slate-300 h-5' />}
            />
            <CardListItem
              characterImage={
                <Image
                  src={'/Male1.jpg'}
                  width={'100'}
                  height={'100'}
                  alt='character image'
                  className='rounded-sm xl:h-14 xl:w-auto'
                />
              }
              characterName='Vic Vargas'
              clanSymbol={<BanuHaqimLogo className='text-slate-300 h-5' />}
            />
          </CardList>
        </OverviewCard>
        <OverviewCard cardTitle='Loresheets' Amount={0} />
      </div>
    </div>
  );
}

// export default function Dashboard() {
//   return (
//     <>
//       {/* <Navbar /> */}

//       <main className='relative flex h-screen flex-col items-center'>
//         {/* GRID */}
//         <div className='flex items-center justify-center h-full'>
//           <div className='grid grid-cols-12 gap-8 w-full h-full'>
//             {/* RIGHT */}
//             <div className='flex flex-col col-span-2 border-2 border-black backdrop-blur-md bg-black'>
//               <div className=''>
//                 <div className='flex justify-center'>
//                   <Link href='/'>
//                     <Image
//                       className='relative  dark:invert py-2'
//                       src='/VTM-LOGO.svg'
//                       alt='Next.js Logo'
//                       width={220}
//                       height={37}
//                       priority
//                     />
//                   </Link>
//                 </div>
//                 <div className='flex justify-center'>
//                   <p className={`text-3xl dark:invert`}>Character Vault</p>
//                 </div>
//                 {/* <div className='border dark:border-red-800 mt-2'></div> */}
//               </div>
//               <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
//                 <div className='mt-5'>
//                   <Link href='/characters'>
//                     <button className='flex items-start border-b-2 border-t-2 border-black bg-red-800 w-full justify-between hover:bg-red-700 duration-500 ease-in-out '>
//                       <span className='text-xl dark:invert px-4 py-2'>
//                         Characters
//                       </span>
//                       <GiVampireCape className='dark:invert text-2xl mt-2 mx-4' />
//                     </button>
//                   </Link>
//                   <Link href='/sheets'>
//                     <button className='flex items-start border-b-2 border-t-2 border-black bg-red-800 w-full justify-between hover:bg-red-700 duration-500 ease-in-out '>
//                       <span className='text-xl dark:invert px-4 py-2'>
//                         Sheets
//                       </span>
//                       <FaFile className='dark:invert text-2xl mt-2 mx-4' />
//                     </button>
//                   </Link>
//                   <Link href='/create'>
//                     <button className='flex items-start border-b-2 border-t-2 border-black bg-red-800 w-full justify-between hover:bg-red-700 duration-500 ease-in-out '>
//                       <span className='text-xl dark:invert px-4 py-2'>
//                         Create New
//                       </span>
//                       <FaPlusSquare className='dark:invert text-2xl mt-2 mx-4' />
//                     </button>
//                   </Link>
//                 </div>
//                 <div className='flex items-center justify-center'>
//                   <Image
//                     className='relative dark:invert py-2'
//                     src='/AnarchV5.svg'
//                     alt='Clan Symbols that change on refresh.'
//                     width={180}
//                     height={37}
//                     priority
//                   />
//                 </div>

//                 <div>
//                   <Link href='/create'>
//                     <button className='flex items-start border-b-2 border-t-2 border-black bg-red-800 w-full justify-between hover:bg-red-700 duration-500 ease-in-out '>
//                       <span className='text-xl dark:invert px-4 py-2'>
//                         Log Out
//                       </span>
//                       <FaPowerOff className='dark:invert text-2xl mt-2 mx-4' />
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             {/* MIDDLE */}
//             <div className='flex flex-col col-span-5 border-2 border-zinc-950 items-center justify-center backdrop-blur-md bg-zinc-950/20 shadow-2xl'>
//               <Image
//                 className='relative dark:invert p-16'
//                 src='/VTM-LOGO.svg'
//                 alt='Next.js Logo'
//                 width={500}
//                 height={37}
//                 priority
//               />
//             </div>
//             {/* LEFT */}
//             <div className='flex flex-col col-span-5 backdrop-blur-md bg-zinc-950/20 shadow-2xl'>
//               <p className='px-16 pt-16 pb-4 dark:invert'>Welcome to the</p>
//               <h1 className='text-6xl dark:invert px-16 pb-4'>
//                 Character Vault
//               </h1>
//               <p className='text-lg text-justify dark:invert pb-4 px-16'>
//                 This is a place where you can create, edit, and store your
//                 characters for any Vampire: The Masquerade games. You can manage
//                 existing character information, and in the future you will be
//                 able to fill out, and update your character sheets during
//                 sessions.
//               </p>
//               <p className='text-lg text-justify dark:invert px-16 pb-8'>
//                 Create an account if you don't already have one and start your
//                 journey into the Night.
//               </p>
//               <div className='flex items-start px-16 pb-16'>
//                 <button className='dark:invert'>Get Started &rarr;</button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </main>
//     </>
//   );
// }
