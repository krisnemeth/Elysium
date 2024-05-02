'use client';

import { useState } from 'react';

import CheckBoxInput from '@/app/ui/sheets/CheckBoxInput';
import TextInput from '@/app/ui/sheets/TextInput';
import AttributeHeaders from '@/app/ui/sheets/AttributeHeaders';
import CategoryDividers from '@/app/ui/sheets/CategoryDividers';

export default function CreateSheet() {
  const [checkboxValues, setCheckboxValues] = useState({
    strength: [false, false, false, false, false],
    dexterity: [false, false, false, false, false],
    stamina: [false, false, false, false, false],
    charisma: [false, false, false, false, false],
    manipulation: [false, false, false, false, false],
    composure: [false, false, false, false, false],
    intelligence: [false, false, false, false, false],
    wits: [false, false, false, false, false],
    resolve: [false, false, false, false, false],
    // Add more fields as needed
  });

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

  const handleCheckboxChange = (
    attribute: keyof typeof checkboxValues,
    index: number
  ) => {
    setCheckboxValues({
      ...checkboxValues,
      [attribute]: checkboxValues[attribute].map((value, i) =>
        i === index ? !value : value
      ),
    });
  };

  return (
    <div className='w-full h-full border-2 border-slate-300'>
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
        <div className='grid grid-cols-3 gap-2 px-6'>
          <div className='flex flex-col xl:border-r-2 xl:border-slate-300 mt-2'>
            <CheckBoxInput
              label='Strength'
              values={checkboxValues.strength}
              onChange={(index) => handleCheckboxChange('strength', index)}
            />
            <CheckBoxInput
              label='Dexterity'
              values={checkboxValues.dexterity}
              onChange={(index) => handleCheckboxChange('dexterity', index)}
            />
            <CheckBoxInput
              label='Stamina'
              values={checkboxValues.stamina}
              onChange={(index) => handleCheckboxChange('stamina', index)}
            />
          </div>
          <div className='flex flex-col xl:border-r-2 xl:border-slate-300 mt-2'>
            <CheckBoxInput
              label='Charisma'
              values={checkboxValues.charisma}
              onChange={(index) => handleCheckboxChange('charisma', index)}
            />
            <CheckBoxInput
              label='Manipulation'
              values={checkboxValues.manipulation}
              onChange={(index) => handleCheckboxChange('manipulation', index)}
            />
            <CheckBoxInput
              label='Composure'
              values={checkboxValues.composure}
              onChange={(index) => handleCheckboxChange('composure', index)}
            />
          </div>
          <div className='flex flex-col mt-2'>
            <CheckBoxInput
              label='Intelligence'
              values={checkboxValues.intelligence}
              onChange={(index) => handleCheckboxChange('intelligence', index)}
            />
            <CheckBoxInput
              label='Wits'
              values={checkboxValues.wits}
              onChange={(index) => handleCheckboxChange('wits', index)}
            />
            <CheckBoxInput
              label='Resolve'
              values={checkboxValues.resolve}
              onChange={(index) => handleCheckboxChange('resolve', index)}
            />
          </div>
        </div>
        <CategoryDividers title='Skills' />
      </form>
    </div>
  );
}
