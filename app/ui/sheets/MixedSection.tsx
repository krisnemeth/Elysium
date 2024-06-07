'use client';

import React from 'react';
import MeritsFlawsInput from '@/app/ui/sheets/MeritsFlawsInput';
import BloodPotency from './BloodPotency';
import TextArea from './TextArea';
import BioData from './BioData';

export default function MixedSection() {
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
    <div className='border-t-2 border-slate-300 my-6 mx-0 px-2 xl:mx-6 xl:px-6'>
      <div className='grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-2'>
        <div className='flex flex-col col-span-6 my-4 lg:border-r border-slate-300'>
          <div className='text-center mt-2 mb-4 border-b-2 border-slate-300 mr-2'>
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
          <TextArea label='Notes' id='notes' rows={22} />
        </div>
        <div className='flex flex-col col-span-6 my-4'>
          <BloodPotency />
          <BioData />
        </div>
      </div>
    </div>
  );
}
