import type { ReactNode } from 'react';
import TextInputFields from './TextInputFields';
import Attributes from './Attributes';
import Skills from './Skills';
import LifeStats from './LifeStats';
import Disciplines from './Disciplines';
import ResonanceHunger from './ResonanceHunger';
import TenetsTouchstonesBane from './TenetsTouchstonesBane';
import MixedSection from './MixedSection';
import BloodPotency from './BloodPotency';
import BioData from './BioData';

// The character sheet's sections, shared by the app and /concept versions.
export const SHEET_SECTIONS: { id: string; label: string; body: ReactNode }[] = [
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
