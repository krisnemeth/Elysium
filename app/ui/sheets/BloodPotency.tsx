'use client';
import React, { useState } from 'react';
import BloodPotencyTextInput from './BloodPotencyTextInput';
import Experience from './Experience';

export default function BloodPotency() {
  const [bloodPotency, setBloodPotency] = useState([
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
  ]);

  const [bloodPotencyValues, setBloodPotencyValues] = useState({
    bloodSurge: '',
    powerBonus: '',
    feedingPenalty: '',
    mendAmount: '',
    rouseReRoll: '',
    baneSeverity: '',
  });

  const [experience, setExperience] = useState({
    totalExperience: '',
    spentExperience: '',
  });

  const handleHungerChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;

      setBloodPotency((prevBloodPotency) =>
        prevBloodPotency.map((prevValue, i) =>
          i === index ? value : prevValue
        )
      );
    };

  const handleBloodPotencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setBloodPotencyValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setExperience((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='my-2'>
      <div className='grid grid-cols-12 mx-2'>
        <label htmlFor='hunger' className=' text-lg text-slate-300 col-span-4'>
          Blood Potency
        </label>
        <div className='flex justify-end mt-1 col-span-8'>
          {bloodPotency.map((value, index) => (
            <>
              <input
                key={index}
                type='checkbox'
                checked={value}
                onChange={handleHungerChange(index)}
                className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-3 w-4 h-4 inline-block cursor-pointer checked:bg-slate-300 ${
                  value ? 'bg-slate-300' : ''
                }`}
              />
            </>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-12 mt-4'>
        <div className='flex flex-col col-span-6 border-r-2 border-slate-300'>
          <BloodPotencyTextInput
            label='Blood Surge'
            name='bloodSurge'
            value={bloodPotencyValues.bloodSurge}
            onChange={handleBloodPotencyChange}
          />
          <BloodPotencyTextInput
            label='Power Bonus'
            name='powerBonus'
            value={bloodPotencyValues.powerBonus}
            onChange={handleBloodPotencyChange}
          />
          <BloodPotencyTextInput
            label='Feeding Penalty'
            name='feedingPenalty'
            value={bloodPotencyValues.feedingPenalty}
            onChange={handleBloodPotencyChange}
          />
        </div>
        <div className='flex flex-col col-span-6'>
          <BloodPotencyTextInput
            label='Mend Amount'
            name='mendAmount'
            value={bloodPotencyValues.mendAmount}
            onChange={handleBloodPotencyChange}
          />
          <BloodPotencyTextInput
            label='Rouse Re-Roll'
            name='rouseReRoll'
            value={bloodPotencyValues.rouseReRoll}
            onChange={handleBloodPotencyChange}
          />
          <BloodPotencyTextInput
            label='Bane Severity'
            name='baneSeverity'
            value={bloodPotencyValues.baneSeverity}
            onChange={handleBloodPotencyChange}
          />
        </div>
      </div>
      <div className='grid-grid-cols-12 mx-2 my-2'>
        <div className='flex flex-col col-span-12'>
          <Experience
            label='Total Experience'
            name='totalExperience'
            value={experience.totalExperience}
            onChange={handleExperienceChange}
          />
        </div>
        <div className='flex flex-col col-span-12'>
          <Experience
            label='Spent Experience'
            name='spentExperience'
            value={experience.spentExperience}
            onChange={handleExperienceChange}
          />
        </div>
      </div>
    </div>
  );
}
