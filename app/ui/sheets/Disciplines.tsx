'use client';
import React, { useState } from 'react';
import DisciplineInput from '@/app/ui/sheets/DisciplineInput';

export default function Disciplines() {
  const dropdownOptions = [
    '',
    'Animalism',
    'Auspex',
    'Blood Sorecery',
    'Celerity',
    'Dominate',
    'Fordtitude',
    'Obfuscate',
    'Potence',
    'Presence',
    'Protean',
    'Thin-Blood Alchemy',
  ];

  const [disciplines, setDisciplines] = useState(
    Array(6).fill({
      dropdownValue: '',
      checkboxValues: [false, false, false, false, false],
    })
  );

  const handleDropdownChange = (index: number, value: string) => {
    setDisciplines((prevState) =>
      prevState.map((discipline, i) =>
        i === index ? { ...discipline, dropdownValue: value } : discipline
      )
    );
  };

  const handleCheckboxChange = (index: number, values: boolean[]) => {
    setDisciplines((prevState) =>
      prevState.map((discipline, i) =>
        i === index ? { ...discipline, checkboxValues: values } : discipline
      )
    );
  };

  return (
    <div className='grid grid-cols-3 gap-2 px-10 my-2'>
      {disciplines.map((discipline, index) => (
        <div
          key={index}
          className='flex flex-col border-r-2 border-slate-300 mt-2'
        >
          <DisciplineInput
            dropdownOptions={dropdownOptions}
            dropdownValue={discipline.dropdownValue}
            onDropdownChange={(value) => handleDropdownChange(index, value)}
            values={discipline.checkboxValues}
            onChange={(values) => handleCheckboxChange(index, values)} // Fix: Wrap the value in an array
          />
        </div>
      ))}
    </div>
  );
}
