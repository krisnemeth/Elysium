'use client';
import React, { useState } from 'react';
import TextInput from '@/app/ui/sheets/TextInput';
import TextInputDropdown from '@/app/ui/sheets/TextInputDropdown';

export default function TextInputFields() {
  const [dropdownValue, setDropdownValue] = useState('');
  const [textInputValues, setTextInputValues] = useState({
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

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTextInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDropdownChange = (value: string) => {
    setDropdownValue(value);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-2 xl:gap-4 px-1 md:px-0 xl:px-4'>
      <div className='flex flex-col'>
        <TextInput
          label='Name'
          name='name'
          value={textInputValues.name}
          onChange={handleFormChange}
        />
        <TextInput
          label='Player'
          name='player'
          value={textInputValues.player}
          onChange={handleFormChange}
        />
        <TextInput
          label='Chronicle'
          name='chronicle'
          value={textInputValues.chronicle}
          onChange={handleFormChange}
        />
      </div>
      <div className='flex flex-col'>
        <TextInput
          label='Concept'
          name='concept'
          value={textInputValues.concept}
          onChange={handleFormChange}
        />
        <TextInput
          label='Ambition'
          name='ambition'
          value={textInputValues.ambition}
          onChange={handleFormChange}
        />
        <TextInputDropdown
          label='Predator'
          options={[
            '',
            'Alleycat',
            'Bagger',
            'Blood Leech',
            'Cleaver',
            'Consensualist',
            'Farmer',
            'Osiris',
            'Sandman',
            'Scene Queen',
            'Siren',
          ]}
          name='predator'
          value={dropdownValue}
          onChange={handleDropdownChange}
        />
      </div>
      <div className='flex flex-col'>
        <TextInput
          label='Sire'
          name='sire'
          value={textInputValues.sire}
          onChange={handleFormChange}
        />
        <TextInput
          label='Clan'
          name='clan'
          value={textInputValues.clan}
          onChange={handleFormChange}
        />
        <TextInput
          label='Generation'
          name='generation'
          value={textInputValues.generation}
          onChange={handleFormChange}
        />
      </div>
    </div>
  );
}
