'use client';
import React, { useState } from 'react';
import AttributeCheckBoxInput from '@/app/ui/sheets/AttributeCheckBoxInput';

export default function Attributes() {
  const [checkboxValues, setCheckboxValues] = useState({
    strength: [false, false, false, false, false],
    dexterity: [false, false, false, false, false],
    stamina: [false, false, false, false, false],
    charisma: [false, false, false, false, false],
    manipulation: [false, false, false, false, false],
    composure: [false, false, false, false, false],
    intelligence: [false, false, false, false, false],
    wits: [false, false, false, false, false],
    resolve: [false, false, false, false, false],
  });

  const handleCheckboxChange = (
    attribute: keyof typeof checkboxValues,
    index: number
  ) => {
    setCheckboxValues({
      ...checkboxValues,
      [attribute]: checkboxValues[attribute].map((value, i) =>
        i === index ? !value : value
      ),
    });
  };

  return (
    <div className='grid gap-4 grid-cols-1 md:grid-cols-3 px-2 md:px-2 xl:px-6'>
      <div className='flex flex-col mt-2'>
        <div className='flex flex-col text-center mt-2'>
          <h3 className='text-sm text-slate-300'>Physical</h3>
        </div>
        <div className='flex flex-col xl:border-r-2 xl:border-slate-300'>
          <AttributeCheckBoxInput
            label='Strength'
            values={checkboxValues.strength}
            onChange={(index) => handleCheckboxChange('strength', index)}
          />
          <AttributeCheckBoxInput
            label='Dexterity'
            values={checkboxValues.dexterity}
            onChange={(index) => handleCheckboxChange('dexterity', index)}
          />
          <AttributeCheckBoxInput
            label='Stamina'
            values={checkboxValues.stamina}
            onChange={(index) => handleCheckboxChange('stamina', index)}
          />
        </div>
      </div>
      <div className='flex flex-col mt-2'>
        <div className='flex flex-col text-center mt-2'>
          <h3 className='text-sm text-slate-300'>Social</h3>
        </div>
        <div className='flex flex-col xl:border-r-2 xl:border-slate-300'>
          <AttributeCheckBoxInput
            label='Charisma'
            values={checkboxValues.charisma}
            onChange={(index) => handleCheckboxChange('charisma', index)}
          />
          <AttributeCheckBoxInput
            label='Manipulation'
            values={checkboxValues.manipulation}
            onChange={(index) => handleCheckboxChange('manipulation', index)}
          />
          <AttributeCheckBoxInput
            label='Composure'
            values={checkboxValues.composure}
            onChange={(index) => handleCheckboxChange('composure', index)}
          />
        </div>
      </div>
      <div className='flex flex-col mt-2'>
        <div className='flex flex-col text-center mt-2'>
          <h3 className='text-sm text-slate-300'>Mental</h3>
        </div>
        <AttributeCheckBoxInput
          label='Intelligence'
          values={checkboxValues.intelligence}
          onChange={(index) => handleCheckboxChange('intelligence', index)}
        />
        <AttributeCheckBoxInput
          label='Wits'
          values={checkboxValues.wits}
          onChange={(index) => handleCheckboxChange('wits', index)}
        />
        <AttributeCheckBoxInput
          label='Resolve'
          values={checkboxValues.resolve}
          onChange={(index) => handleCheckboxChange('resolve', index)}
        />
      </div>
    </div>
  );
}
