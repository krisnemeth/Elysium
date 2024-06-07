'use client';
import React, { useState } from 'react';
import LifeStatsInput from './LifeStatsInput';

export default function LifeStats() {
  const [checkboxValues, setCheckboxValues] = useState({
    health: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    willpower: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    humanity: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
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
    <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-0 xl:px-6'>
      <div className='flex flex-col mt-2'>
        <LifeStatsInput
          label='Health'
          values={checkboxValues.health}
          onChange={(index) => handleCheckboxChange('health', index)}
        />
      </div>
      <div className='flex flex-col mt-2'>
        <LifeStatsInput
          label='Willpower'
          values={checkboxValues.health}
          onChange={(index) => handleCheckboxChange('health', index)}
        />
      </div>
      <div className='flex flex-col mt-2'>
        <LifeStatsInput
          label='Humanity'
          values={checkboxValues.health}
          onChange={(index) => handleCheckboxChange('health', index)}
        />
      </div>
    </div>
  );
}
