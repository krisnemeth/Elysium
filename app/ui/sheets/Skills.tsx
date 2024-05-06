'use client';
import React, { useState } from 'react';
import SkillCheckBoxInput from '@/app/ui/sheets/SkillCheckBoxInput';

export default function Skills() {
  const [checkboxValues, setCheckboxValues] = useState({
    athletics: [false, false, false, false, false],
    brawl: [false, false, false, false, false],
    craft: [false, false, false, false, false],
    drive: [false, false, false, false, false],
    firearms: [false, false, false, false, false],
    melee: [false, false, false, false, false],
    larceny: [false, false, false, false, false],
    stealth: [false, false, false, false, false],
    survival: [false, false, false, false, false],
    animal_ken: [false, false, false, false, false],
    etiquette: [false, false, false, false, false],
    insight: [false, false, false, false, false],
    intimidation: [false, false, false, false, false],
    leadership: [false, false, false, false, false],
    performance: [false, false, false, false, false],
    persuasion: [false, false, false, false, false],
    streetwise: [false, false, false, false, false],
    subterfuge: [false, false, false, false, false],
    academics: [false, false, false, false, false],
    awareness: [false, false, false, false, false],
    finance: [false, false, false, false, false],
    investigation: [false, false, false, false, false],
    medicine: [false, false, false, false, false],
    occult: [false, false, false, false, false],
    politics: [false, false, false, false, false],
    science: [false, false, false, false, false],
    technology: [false, false, false, false, false],

    // Add more fields as needed
  });

  const handleSkillCheckboxChange = (
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
    <div className='grid grid-cols-3 gap-2 px-6 my-2'>
      <div className='flex flex-col  mt-2'>
        <SkillCheckBoxInput
          label='Athletics'
          values={checkboxValues.athletics}
          onChange={(index) => handleSkillCheckboxChange('athletics', index)}
        />
        <SkillCheckBoxInput
          label='Brawl'
          values={checkboxValues.brawl}
          onChange={(index) => handleSkillCheckboxChange('brawl', index)}
        />
        <SkillCheckBoxInput
          label='Craft'
          values={checkboxValues.craft}
          onChange={(index) => handleSkillCheckboxChange('craft', index)}
        />
        <SkillCheckBoxInput
          label='Drive'
          values={checkboxValues.drive}
          onChange={(index) => handleSkillCheckboxChange('drive', index)}
        />
        <SkillCheckBoxInput
          label='Firearms'
          values={checkboxValues.firearms}
          onChange={(index) => handleSkillCheckboxChange('firearms', index)}
        />
        <SkillCheckBoxInput
          label='Melee'
          values={checkboxValues.melee}
          onChange={(index) => handleSkillCheckboxChange('melee', index)}
        />
        <SkillCheckBoxInput
          label='Larceny'
          values={checkboxValues.larceny}
          onChange={(index) => handleSkillCheckboxChange('larceny', index)}
        />
        <SkillCheckBoxInput
          label='Stealth'
          values={checkboxValues.stealth}
          onChange={(index) => handleSkillCheckboxChange('stealth', index)}
        />
        <SkillCheckBoxInput
          label='Survival'
          values={checkboxValues.survival}
          onChange={(index) => handleSkillCheckboxChange('survival', index)}
        />
      </div>
      <div className='flex flex-col  mt-2'>
        <SkillCheckBoxInput
          label='Animal Ken'
          values={checkboxValues.animal_ken}
          onChange={(index) => handleSkillCheckboxChange('animal_ken', index)}
        />
        <SkillCheckBoxInput
          label='Etiquette'
          values={checkboxValues.etiquette}
          onChange={(index) => handleSkillCheckboxChange('etiquette', index)}
        />
        <SkillCheckBoxInput
          label='Insight'
          values={checkboxValues.insight}
          onChange={(index) => handleSkillCheckboxChange('insight', index)}
        />
        <SkillCheckBoxInput
          label='Intimidation'
          values={checkboxValues.intimidation}
          onChange={(index) => handleSkillCheckboxChange('intimidation', index)}
        />
        <SkillCheckBoxInput
          label='Leadership'
          values={checkboxValues.leadership}
          onChange={(index) => handleSkillCheckboxChange('leadership', index)}
        />
        <SkillCheckBoxInput
          label='Performance'
          values={checkboxValues.performance}
          onChange={(index) => handleSkillCheckboxChange('performance', index)}
        />
        <SkillCheckBoxInput
          label='Persuasion'
          values={checkboxValues.persuasion}
          onChange={(index) => handleSkillCheckboxChange('persuasion', index)}
        />
        <SkillCheckBoxInput
          label='Streetwise'
          values={checkboxValues.streetwise}
          onChange={(index) => handleSkillCheckboxChange('streetwise', index)}
        />
        <SkillCheckBoxInput
          label='Subterfuge'
          values={checkboxValues.subterfuge}
          onChange={(index) => handleSkillCheckboxChange('subterfuge', index)}
        />
      </div>
      <div className='flex flex-col  mt-2'>
        <SkillCheckBoxInput
          label='Academics'
          values={checkboxValues.academics}
          onChange={(index) => handleSkillCheckboxChange('academics', index)}
        />
        <SkillCheckBoxInput
          label='Awareness'
          values={checkboxValues.awareness}
          onChange={(index) => handleSkillCheckboxChange('awareness', index)}
        />
        <SkillCheckBoxInput
          label='Finance'
          values={checkboxValues.finance}
          onChange={(index) => handleSkillCheckboxChange('finance', index)}
        />
        <SkillCheckBoxInput
          label='Investigation'
          values={checkboxValues.investigation}
          onChange={(index) =>
            handleSkillCheckboxChange('investigation', index)
          }
        />
        <SkillCheckBoxInput
          label='Medicine'
          values={checkboxValues.medicine}
          onChange={(index) => handleSkillCheckboxChange('medicine', index)}
        />
        <SkillCheckBoxInput
          label='Occult'
          values={checkboxValues.occult}
          onChange={(index) => handleSkillCheckboxChange('occult', index)}
        />
        <SkillCheckBoxInput
          label='Politics'
          values={checkboxValues.politics}
          onChange={(index) => handleSkillCheckboxChange('politics', index)}
        />
        <SkillCheckBoxInput
          label='Science'
          values={checkboxValues.science}
          onChange={(index) => handleSkillCheckboxChange('science', index)}
        />
        <SkillCheckBoxInput
          label='Technology'
          values={checkboxValues.technology}
          onChange={(index) => handleSkillCheckboxChange('technology', index)}
        />
      </div>
    </div>
  );
}
