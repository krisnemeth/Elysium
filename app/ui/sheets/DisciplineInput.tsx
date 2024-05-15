'use client';
import React, { useState } from 'react';

interface DisciplineInputProps {
  dropdownOptions: string[];
  dropdownValue: string;
  onDropdownChange: (value: string) => void;
  checkboxValues: boolean[];
  onCheckboxChange: (index: number, value: boolean) => void;
  textInputValues: string[];
  onTextInputChange: (index: number, value: string) => void;
}

export default function DisciplineInput({
  dropdownOptions,
  dropdownValue,
  onDropdownChange,
  checkboxValues = [],
  onCheckboxChange,
  textInputValues = [],
  onTextInputChange,
}: DisciplineInputProps) {
  return (
    <>
      <div className='grid grid-cols-2 pr-4 py-1 border-b-2 border-slate-300'>
        <div className='dropdown'>
          <select
            className='mt-2 border-none w-44 text-xl bg-inherit text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent rounded-md cursor-pointer'
            value={dropdownValue}
            onChange={(e) => onDropdownChange(e.target.value)}
          >
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className='checkboxes flex justify-end mt-1'>
          {checkboxValues.map((value, index) => (
            <input
              key={index}
              type='checkbox'
              id={`${value}-${index}`}
              name={`${value}-${index}`}
              checked={value}
              onChange={(e) => onCheckboxChange(index, e.target.checked)}
              className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-3 w-4 h-4 mt-1 inline-block cursor-pointer checked:bg-slate-300 ${
                value ? 'bg-slate-300' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col'>
        {textInputValues.map((value, index) => (
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
              onChange={(e) => onTextInputChange(index, e.target.value)}
              className=' mx-2 bg-inherit p-1 text-slate-300 shadow-sm col-span-11'
            />
          </div>
        ))}
      </div>
    </>
  );
}
