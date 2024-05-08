'use client';
import React, { useState } from 'react';
import DisciplineDropdown from './DisciplineDropdown'; // Import TextInputDropdown
import DisciplineCheckbox from './DisciplineCheckbox'; // Import TextInputDropdown

interface DisciplineInputProps {
  dropdownOptions: string[];
  dropdownValue: string;
  onDropdownChange: (value: string) => void;
  values: boolean[];
  onChange: (index: number, values: boolean[]) => void;
}

export default function DisciplineInput({
  dropdownOptions,
  dropdownValue,
  onDropdownChange,
  values,
  onChange,
}: DisciplineInputProps) {
  const [inputValues, setInputValues] = useState(Array(5).fill('')); // State for input fields

  const handleInputChange = (index: number, value: string) => {
    // Handler for input fields
    setInputValues((prevState) =>
      prevState.map((v, i) => (i === index ? value : v))
    );
  };

  return (
    <>
      <div className='grid grid-cols-2 pr-4 py-1 border-b-2 border-slate-300'>
        <DisciplineDropdown
          options={dropdownOptions}
          value={dropdownValue}
          onChange={onDropdownChange}
        />
        <DisciplineCheckbox disciplineLevel={values} onChange={onChange} />
      </div>
      <div className='flex flex-col'>
        {inputValues.map((value, index) => (
          <div
            key={index}
            className='grid grid-cols-12 border-b border-dotted border-slate-300 pl-1 py-1'
          >
            <label
              htmlFor={`input-${index}`}
              className='text-slate-300 mt-1  col-span-1'
            >
              {index + 1}
            </label>
            <input
              id={`input-${index}`}
              type='text'
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className=' mx-2 bg-inherit p-1 text-slate-300 shadow-sm col-span-11'
            />
          </div>
        ))}
      </div>
    </>
  );
}
