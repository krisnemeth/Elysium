import type { Metadata } from 'next';
import Headline from '../../_app/Headline';
import DiceRoller from '@/app/ui/dice/DiceRoller';

export const metadata: Metadata = { title: 'Dice' };

export default function Dice() {
  return (
    <div className='flex flex-col gap-12'>
      <Headline
        kicker='Exhibit &mdash; the bones'
        title={<>Roll with your <span className='font-c-serif font-normal text-blood normal-case italic [font-variation-settings:normal]'>Hunger.</span></>}
        lead='Criticals, messy criticals, bestial failures, rouse checks and Willpower rerolls, on the real V5 dice.'
      />
      <DiceRoller />
    </div>
  );
}
