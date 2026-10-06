import type { Metadata } from 'next';
import PageHeader from '@/app/ui/kit/PageHeader';
import DiceRoller from '@/app/ui/dice/DiceRoller';

export const metadata: Metadata = {
  title: 'Dice roller',
};

export default function DicePage() {
  return (
    <div className='flex flex-col gap-10'>
      <PageHeader
        eyebrow='Dice roller'
        title='Roll with your Hunger.'
        description='The V5 rules, built in: criticals, messy criticals, bestial failures, rouse checks and Willpower rerolls.'
      />
      <DiceRoller />
    </div>
  );
}
