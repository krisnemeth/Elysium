'use client';
import React, { useState } from 'react';
import BloodPotencyTextInput from './BloodPotencyTextInput';
import Experience from './Experience';
import BloodPotencyCheckbox from './BloodPotencyCheckbox';

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

  const handleBloodPotencyChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;

      setBloodPotency((prevBloodPotency) =>
        prevBloodPotency.map((prevValue, i) =>
          i === index ? value : prevValue
        )
      );
    };

  const handleBloodPotencyValueChange = (
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
      <BloodPotencyCheckbox
        bloodPotency={bloodPotency}
        handleBloodPotencyChange={handleBloodPotencyChange}
      />
      <div className='grid grid-cols-12 mt-4 mx-0 xl:mx-4'>
        <div className='flex flex-col col-span-6 border-r-2 border-slate-300'>
          <BloodPotencyTextInput
            label='Blood Surge'
            name='bloodSurge'
            value={bloodPotencyValues.bloodSurge}
            onChange={handleBloodPotencyValueChange}
          />
          <BloodPotencyTextInput
            label='Power Bonus'
            name='powerBonus'
            value={bloodPotencyValues.powerBonus}
            onChange={handleBloodPotencyValueChange}
          />
          <BloodPotencyTextInput
            label='Feeding Penalty'
            name='feedingPenalty'
            value={bloodPotencyValues.feedingPenalty}
            onChange={handleBloodPotencyValueChange}
          />
        </div>
        <div className='flex flex-col col-span-6'>
          <BloodPotencyTextInput
            label='Mend Amount'
            name='mendAmount'
            value={bloodPotencyValues.mendAmount}
            onChange={handleBloodPotencyValueChange}
          />
          <BloodPotencyTextInput
            label='Rouse Re-Roll'
            name='rouseReRoll'
            value={bloodPotencyValues.rouseReRoll}
            onChange={handleBloodPotencyValueChange}
          />
          <BloodPotencyTextInput
            label='Bane Severity'
            name='baneSeverity'
            value={bloodPotencyValues.baneSeverity}
            onChange={handleBloodPotencyValueChange}
          />
        </div>
      </div>
      <div className='grid-grid-cols-12 mx-0 xl:mx-2 my-2'>
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
