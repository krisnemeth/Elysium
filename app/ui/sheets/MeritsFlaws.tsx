'use client';

import React from 'react';
import MeritsFlawsInput from '@/app/ui/sheets/MeritsFlawsInput';

export default function MeritsFlaws() {
  const [rows, setRows] = React.useState(
    Array(13).fill({ textInputValue: '', checkboxValues: Array(5).fill(false) })
  );

  const handleTextInputChange = (rowIndex: number, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex ? { ...row, textInputValue: value } : row
      )
    );
  };

  const handleCheckboxChange = (
    rowIndex: number,
    checkboxIndex: number,
    value: boolean
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              checkboxValues: row.checkboxValues.map(
                (checkboxValue: boolean, i: number) =>
                  i === checkboxIndex ? value : checkboxValue
              ),
            }
          : row
      )
    );
  };

  return (
    <div className='border-t-2 border-slate-300 my-6 mx-6 px-6'>
      <div className='grid grid-cols-2 gap-2'>
        <div className='flex flex-col mt-4 border-r-2 border-slate-300'>
          <div className='text-center my-2 border-b-2 border-slate-300 mr-2'>
            <h4 className='text-lg text-slate-300'>
              Backgrounds, Merits & Flaws
            </h4>
          </div>
          {rows.map((row, index) => (
            <MeritsFlawsInput
              key={index}
              textInputValue={row.textInputValue}
              checkboxValues={row.checkboxValues}
              handleTextInputChange={(value) =>
                handleTextInputChange(index, value)
              }
              handleCheckboxChange={(checkboxIndex, value) =>
                handleCheckboxChange(index, checkboxIndex, value)
              }
            />
          ))}
          <div className='text-center my-2 border-b-2 border-slate-300 mr-2 mt-4'>
            <h4 className='text-lg text-slate-300'>Notes</h4>
          </div>
          <div className='flex mr-2'>
            <textarea
              id='notes'
              rows={8}
              className='w-full bg-inherit border-2 border-slate-300 border-dotted text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
