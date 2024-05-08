import React from 'react';

interface DisciplineCheckboxProps {
  disciplineLevel: boolean[];
  values: string;
  onChange: (index: number, values: boolean[]) => void;
}

export default function DisciplineCheckbox({
  disciplineLevel,
  onChange,
}: DisciplineCheckboxProps) {
  return (
    <div className='flex justify-end mt-1'>
      {disciplineLevel.map((value, index) => (
        <>
          <input
            type='checkbox'
            id={`${value}-${index}`}
            name={`${value}-${index}`}
            checked={value}
            onChange={() => {
              const newValues = [...disciplineLevel];
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
  );
}
