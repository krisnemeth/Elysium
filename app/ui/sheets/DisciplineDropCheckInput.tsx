'use client';
import React, { useState } from 'react';
import DisciplineDropdown from './DisciplineDropdown'; // Import TextInputDropdown

interface CheckBoxInputProps {
  dropdownOptions: string[]; // Add dropdownOptions prop
  dropdownValue: string; // Add dropdownValue prop
  onDropdownChange: (value: string) => void; // Add onDropdownChange prop
  values: boolean[];
  onChange: (index: number, values: boolean[]) => void;
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
      <div className='grid grid-cols-2 pr-4 py-1 border-b-2 border-slate-300'>
        <DisciplineDropdown // Use TextInputDropdown as label
          options={dropdownOptions}
          name='predator'
          value={dropdownValue}
          onChange={onDropdownChange}
        />
        <div className='flex justify-end mt-1'>
          {values.map((value, index) => (
            <>
              <input
                type='checkbox'
                id={`predator-${index}`}
                name={`predator-${index}`}
                checked={value}
                onChange={() => {
                  const newValues = [...values];
                  newValues[index] = !value;
                  onChange(index, newValues);
                }}
                className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-3 w-4 h-4 mt-1 inline-block cursor-pointer checked:bg-slate-300 ${
                  value ? 'bg-slate-300' : ''
                }`}
              />
            </>
          ))}
        </div>
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
