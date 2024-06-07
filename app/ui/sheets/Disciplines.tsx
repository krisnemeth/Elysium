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
      dropdownValue: dropdownOptions[0],
      checkboxValues: Array(5).fill(false),
      textInputValues: Array(5).fill(''),
    })
  );

  const handleDropdownChange = (index: number, value: string) => {
    setDisciplines((prevDisciplines) =>
      prevDisciplines.map((discipline, i) =>
        i === index ? { ...discipline, dropdownValue: value } : discipline
      )
    );
  };

  const handleCheckboxChange = (
    index: number,
    checkboxIndex: number,
    value: boolean
  ) => {
    setDisciplines((prevDisciplines) =>
      prevDisciplines.map((discipline, i) =>
        i === index
          ? {
              ...discipline,
              checkboxValues: discipline.checkboxValues.map(
                (checkboxValue: boolean, j: number) =>
                  j === checkboxIndex ? value : checkboxValue
              ),
            }
          : discipline
      )
    );
  };

  const handleTextInputChange = (
    index: number,
    inputIndex: number,
    value: string
  ) => {
    setDisciplines((prevDisciplines) =>
      prevDisciplines.map((discipline, i) =>
        i === index
          ? {
              ...discipline,
              textInputValues: discipline.textInputValues.map(
                (v: string, j: number) => (j === inputIndex ? value : v)
              ),
            }
          : discipline
      )
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2 xl:px-4 my-2'>
      {disciplines.map((discipline, index) => (
        <div
          key={index}
          className='flex flex-col border-r-2 border-slate-300 mt-2'
        >
          <DisciplineInput
            dropdownOptions={dropdownOptions}
            dropdownValue={discipline.dropdownValue}
            onDropdownChange={(value) => handleDropdownChange(index, value)}
            checkboxValues={discipline.checkboxValues}
            onCheckboxChange={(checkboxIndex, value) =>
              handleCheckboxChange(index, checkboxIndex, value)
            }
            textInputValues={discipline.textInputValues}
            onTextInputChange={(inputIndex, value) =>
              handleTextInputChange(index, inputIndex, value)
            }
          />
        </div>
      ))}
    </div>
  );
}
