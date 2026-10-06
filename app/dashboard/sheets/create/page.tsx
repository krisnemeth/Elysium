import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import PageHeader from '@/app/ui/kit/PageHeader';
import { panel } from '@/app/ui/kit/styles';
import { LogoVampire } from '@/app/ui/svgs/official';
import CategoryDividers from '@/app/ui/sheets/CategoryDividers';
import SheetNav from '@/app/ui/sheets/SheetNav';
import TextInputFields from '@/app/ui/sheets/TextInputFields';
import Attributes from '@/app/ui/sheets/Attributes';
import Skills from '@/app/ui/sheets/Skills';
import LifeStats from '@/app/ui/sheets/LifeStats';
import Disciplines from '@/app/ui/sheets/Disciplines';
import ResonanceHunger from '@/app/ui/sheets/ResonanceHunger';
import TenetsTouchstonesBane from '@/app/ui/sheets/TenetsTouchstonesBane';
import MixedSection from '@/app/ui/sheets/MixedSection';
import BloodPotency from '@/app/ui/sheets/BloodPotency';
import BioData from '@/app/ui/sheets/BioData';

export const metadata: Metadata = {
  title: 'New character sheet',
};

const SECTIONS: { id: string; label: string; body: ReactNode }[] = [
  { id: 'profile', label: 'Profile', body: <TextInputFields /> },
  { id: 'attributes', label: 'Attributes', body: <Attributes /> },
  { id: 'skills', label: 'Skills', body: <Skills /> },
  { id: 'trackers', label: 'Trackers', body: <LifeStats /> },
  { id: 'disciplines', label: 'Disciplines', body: <Disciplines /> },
  {
    id: 'blood',
    label: 'Blood',
    body: (
      <div className='flex flex-col gap-8'>
        <ResonanceHunger />
        <BloodPotency />
      </div>
    ),
  },
  { id: 'convictions', label: 'Convictions', body: <TenetsTouchstonesBane /> },
  { id: 'merits', label: 'Merits & notes', body: <MixedSection /> },
  { id: 'biography', label: 'Biography', body: <BioData /> },
];

export default function CreateSheet() {
  return (
    <div className='flex flex-col gap-8'>
      <PageHeader
        eyebrow='New character'
        title='Character sheet'
        description='Fill it in as you would the printed sheet. Click a dot to set a rating; use the arrow keys on a focused rating.'
      />
      <SheetNav sections={SECTIONS.map(({ id, label }) => ({ id, label }))} />
      <form className='flex flex-col gap-6'>
        <div className='flex justify-center py-4'>
          <LogoVampire aria-label='Vampire: The Masquerade' role='img' className='h-auto w-64 text-bone/80 md:w-80' />
        </div>
        {SECTIONS.map(({ id, label, body }) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-title`}
            className={`reveal scroll-mt-36 p-5 md:scroll-mt-24 md:p-8 ${panel}`}
          >
            <CategoryDividers id={`${id}-title`} title={label} />
            <div className='mt-8'>{body}</div>
          </section>
        ))}
      </form>
    </div>
  );
}
