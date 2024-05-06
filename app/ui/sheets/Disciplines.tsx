'use client';
import React, { useState } from 'react';
import DisciplineDropCheckInput from '@/app/ui/sheets/DisciplineDropCheckInput';

export default function Disciplines() {
  const [dropdownValue, setDropdownValue] = useState('');
  const [checkboxValues, setCheckboxValues] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleDropdownChange = (value: string) => {
    setDropdownValue(value);
  };

  const handleCheckboxChange = (index: number) => {
    setCheckboxValues((prevState) =>
      prevState.map((value, i) => (i === index ? !value : value))
    );
  };
  return (
    <div className='grid grid-cols-3 gap-2 px-6 my-2'>
      <div className='flex flex-col border-r-2 border-b-2 border-slate-300 mt-2'>
        <DisciplineDropCheckInput
          dropdownOptions={['', 'Animalism']}
          dropdownValue={dropdownValue}
          onDropdownChange={handleDropdownChange}
          values={checkboxValues}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
}
