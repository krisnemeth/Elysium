'use client';
import React, { useState } from 'react';
import DisciplineTextInputDropdown from './DisciplineDropdown'; // Import TextInputDropdown

interface CheckBoxInputProps {
  dropdownOptions: string[]; // Add dropdownOptions prop
  dropdownValue: string; // Add dropdownValue prop
  onDropdownChange: (value: string) => void; // Add onDropdownChange prop
  values: boolean[];
  onChange: (index: number) => void; // Change onChange prop to accept number
}

export default function CheckBoxInput({
  dropdownOptions,
  dropdownValue,
  onDropdownChange,
  values,
  onChange,
}: CheckBoxInputProps) {
  const [inputValues, setInputValues] = useState(Array(5).fill('')); // State for input fields

  const handleInputChange = (index: number, value: string) => {
    // Handler for input fields
    setInputValues((prevState) =>
      prevState.map((v, i) => (i === index ? value : v))
    );
  };

  return (
    <>
      <div className='grid grid-cols-2 px-4 mx-2 py-2 border-b-2 border-slate-300'>
        <DisciplineTextInputDropdown // Use TextInputDropdown as label
          options={dropdownOptions}
          name='predator'
          value={dropdownValue}
          onChange={onDropdownChange}
        />
        <div className='flex justify-end mt-1'>
          {values.map((value, index) => (
            <>
              <input
                key={index}
                type='checkbox'
                id={`${value}-${index}`}
                name={`${value}-${index}`}
                checked={value}
                onChange={() => onChange(index)}
                className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-3 w-4 h-4 mt-3 inline-block cursor-pointer checked:bg-slate-300 ${
                  value ? 'bg-slate-300' : ''
                }`}
              />
            </>
          ))}
        </div>
      </div>
      <div className='flex flex-col'>
        {inputValues.map(
          (
            value,
            index // Render input fields
          ) => (
            <input
              key={index}
              type='text'
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className='mx-2 bg-inherit p-1 border-b-2 border-dotted border-slate-300 text-slate-300 shadow-sm focus:outline-none'
            />
          )
        )}
      </div>
    </>
  );
}
