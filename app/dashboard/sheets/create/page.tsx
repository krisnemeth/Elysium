'use client';

import { useState } from 'react';

import TextInput from '@/app/ui/sheets/TextInput';
import AttributeHeaders from '@/app/ui/sheets/AttributeHeaders';
import CategoryDividers from '@/app/ui/sheets/CategoryDividers';
import Attributes from '@/app/ui/sheets/Attributes';
import Skills from '@/app/ui/sheets/Skills';
import LifeStats from '@/app/ui/sheets/LifeStats';

export default function CreateSheet() {
  const [formValues, setFormValues] = useState({
    name: '',
    player: '',
    chronicle: '',
    concept: '',
    ambition: '',
    predator: '',
    sire: '',
    clan: '',
    generation: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='w-full border-2 border-slate-300'>
      <div className='mt-6 mb-6'>
        <h1 className='text-slate-300 text-4xl text-center'>Character Sheet</h1>
      </div>
      <form action=''>
        <div className='grid grid-cols-3 gap-6 px-6'>
          <div className='flex flex-col'>
            <TextInput
              label='Name'
              name='name'
              value={formValues.name}
              onChange={handleFormChange}
            />
            <TextInput
              label='Player'
              name='player'
              value={formValues.player}
              onChange={handleFormChange}
            />
            <TextInput
              label='Chronicle'
              name='chronicle'
              value={formValues.chronicle}
              onChange={handleFormChange}
            />
          </div>
          <div className='flex flex-col'>
            <TextInput
              label='Concept'
              name='concept'
              value={formValues.concept}
              onChange={handleFormChange}
            />
            <TextInput
              label='Ambition'
              name='ambition'
              value={formValues.ambition}
              onChange={handleFormChange}
            />
            <TextInput
              label='Predator'
              name='predator'
              value={formValues.predator}
              onChange={handleFormChange}
            />
          </div>
          <div className='flex flex-col'>
            <TextInput
              label='Sire'
              name='sire'
              value={formValues.sire}
              onChange={handleFormChange}
            />
            <TextInput
              label='Clan'
              name='clan'
              value={formValues.clan}
              onChange={handleFormChange}
            />
            <TextInput
              label='Generation'
              name='generation'
              value={formValues.generation}
              onChange={handleFormChange}
            />
          </div>
        </div>
        <CategoryDividers title='Attributes' />
        <AttributeHeaders />
        <Attributes />
        <CategoryDividers title='Skills' />
        <Skills />
        <LifeStats />
      </form>
    </div>
  );
}
