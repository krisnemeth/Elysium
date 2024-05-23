'use client';
import React, { use, useState } from 'react';
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
  const [textValues, setTextValues] = useState({
    athletics: '',
    brawl: '',
    craft: '',
    drive: '',
    firearms: '',
    melee: '',
    larceny: '',
    stealth: '',
    survival: '',
    animal_ken: '',
    etiquette: '',
    insight: '',
    intimidation: '',
    leadership: '',
    performance: '',
    persuasion: '',
    streetwise: '',
    subterfuge: '',
    academics: '',
    awareness: '',
    finance: '',
    investigation: '',
    medicine: '',
    occult: '',
    politics: '',
    science: '',
    technology: '',
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

  const handleTextChange = (
    attribute: keyof typeof textValues,
    newValue: string
  ) => {
    setTextValues({
      ...textValues,
      [attribute]: newValue,
    });
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 px-2 xl:px-6 my-2'>
      <div className='flex flex-col  mt-2'>
        <SkillCheckBoxInput
          label='Athletics'
          values={checkboxValues.athletics}
          onChange={(index) => handleSkillCheckboxChange('athletics', index)}
          textValues={textValues.athletics.split(' ')}
          onTextChange={(newValue) => handleTextChange('athletics', newValue)}
        />
        <SkillCheckBoxInput
          label='Brawl'
          values={checkboxValues.brawl}
          onChange={(index) => handleSkillCheckboxChange('brawl', index)}
          textValues={textValues.brawl.split(' ')}
          onTextChange={(newValue) => handleTextChange('brawl', newValue)}
        />
        <SkillCheckBoxInput
          label='Craft'
          values={checkboxValues.craft}
          onChange={(index) => handleSkillCheckboxChange('craft', index)}
          textValues={textValues.craft.split(' ')}
          onTextChange={(newValue) => handleTextChange('craft', newValue)}
        />
        <SkillCheckBoxInput
          label='Drive'
          values={checkboxValues.drive}
          onChange={(index) => handleSkillCheckboxChange('drive', index)}
          textValues={textValues.drive.split(' ')}
          onTextChange={(newValue) => handleTextChange('drive', newValue)}
        />
        <SkillCheckBoxInput
          label='Firearms'
          values={checkboxValues.firearms}
          onChange={(index) => handleSkillCheckboxChange('firearms', index)}
          textValues={textValues.firearms.split(' ')}
          onTextChange={(newValue) => handleTextChange('firearms', newValue)}
        />
        <SkillCheckBoxInput
          label='Melee'
          values={checkboxValues.melee}
          onChange={(index) => handleSkillCheckboxChange('melee', index)}
          textValues={textValues.melee.split(' ')}
          onTextChange={(newValue) => handleTextChange('melee', newValue)}
        />
        <SkillCheckBoxInput
          label='Larceny'
          values={checkboxValues.larceny}
          onChange={(index) => handleSkillCheckboxChange('larceny', index)}
          textValues={textValues.larceny.split(' ')}
          onTextChange={(newValue) => handleTextChange('larceny', newValue)}
        />
        <SkillCheckBoxInput
          label='Stealth'
          values={checkboxValues.stealth}
          onChange={(index) => handleSkillCheckboxChange('stealth', index)}
          textValues={textValues.stealth.split(' ')}
          onTextChange={(newValue) => handleTextChange('stealth', newValue)}
        />
        <SkillCheckBoxInput
          label='Survival'
          values={checkboxValues.survival}
          onChange={(index) => handleSkillCheckboxChange('survival', index)}
          textValues={textValues.survival.split(' ')}
          onTextChange={(newValue) => handleTextChange('survival', newValue)}
        />
      </div>
      <div className='flex flex-col  mt-2'>
        <SkillCheckBoxInput
          label='Animal Ken'
          values={checkboxValues.animal_ken}
          onChange={(index) => handleSkillCheckboxChange('animal_ken', index)}
          textValues={textValues.animal_ken.split(' ')}
          onTextChange={(newValue) => handleTextChange('animal_ken', newValue)}
        />
        <SkillCheckBoxInput
          label='Etiquette'
          values={checkboxValues.etiquette}
          onChange={(index) => handleSkillCheckboxChange('etiquette', index)}
          textValues={textValues.etiquette.split(' ')}
          onTextChange={(newValue) => handleTextChange('etiquette', newValue)}
        />
        <SkillCheckBoxInput
          label='Insight'
          values={checkboxValues.insight}
          onChange={(index) => handleSkillCheckboxChange('insight', index)}
          textValues={textValues.insight.split(' ')}
          onTextChange={(newValue) => handleTextChange('insight', newValue)}
        />
        <SkillCheckBoxInput
          label='Intimidation'
          values={checkboxValues.intimidation}
          onChange={(index) => handleSkillCheckboxChange('intimidation', index)}
          textValues={textValues.intimidation.split(' ')}
          onTextChange={(newValue) =>
            handleTextChange('intimidation', newValue)
          }
        />
        <SkillCheckBoxInput
          label='Leadership'
          values={checkboxValues.leadership}
          onChange={(index) => handleSkillCheckboxChange('leadership', index)}
          textValues={textValues.leadership.split(' ')}
          onTextChange={(newValue) => handleTextChange('leadership', newValue)}
        />
        <SkillCheckBoxInput
          label='Performance'
          values={checkboxValues.performance}
          onChange={(index) => handleSkillCheckboxChange('performance', index)}
          textValues={textValues.performance.split(' ')}
          onTextChange={(newValue) => handleTextChange('performance', newValue)}
        />
        <SkillCheckBoxInput
          label='Persuasion'
          values={checkboxValues.persuasion}
          onChange={(index) => handleSkillCheckboxChange('persuasion', index)}
          textValues={textValues.persuasion.split(' ')}
          onTextChange={(newValue) => handleTextChange('persuasion', newValue)}
        />
        <SkillCheckBoxInput
          label='Streetwise'
          values={checkboxValues.streetwise}
          onChange={(index) => handleSkillCheckboxChange('streetwise', index)}
          textValues={textValues.streetwise.split(' ')}
          onTextChange={(newValue) => handleTextChange('streetwise', newValue)}
        />
        <SkillCheckBoxInput
          label='Subterfuge'
          values={checkboxValues.subterfuge}
          onChange={(index) => handleSkillCheckboxChange('subterfuge', index)}
          textValues={textValues.subterfuge.split(' ')}
          onTextChange={(newValue) => handleTextChange('subterfuge', newValue)}
        />
      </div>
      <div className='flex flex-col  mt-2'>
        <SkillCheckBoxInput
          label='Academics'
          values={checkboxValues.academics}
          onChange={(index) => handleSkillCheckboxChange('academics', index)}
          textValues={textValues.academics.split(' ')}
          onTextChange={(newValue) => handleTextChange('academics', newValue)}
        />
        <SkillCheckBoxInput
          label='Awareness'
          values={checkboxValues.awareness}
          onChange={(index) => handleSkillCheckboxChange('awareness', index)}
          textValues={textValues.awareness.split(' ')}
          onTextChange={(newValue) => handleTextChange('awareness', newValue)}
        />
        <SkillCheckBoxInput
          label='Finance'
          values={checkboxValues.finance}
          onChange={(index) => handleSkillCheckboxChange('finance', index)}
          textValues={textValues.finance.split(' ')}
          onTextChange={(newValue) => handleTextChange('finance', newValue)}
        />
        <SkillCheckBoxInput
          label='Investigation'
          values={checkboxValues.investigation}
          onChange={(index) =>
            handleSkillCheckboxChange('investigation', index)
          }
          textValues={textValues.investigation.split(' ')}
          onTextChange={(newValue) =>
            handleTextChange('investigation', newValue)
          }
        />
        <SkillCheckBoxInput
          label='Medicine'
          values={checkboxValues.medicine}
          onChange={(index) => handleSkillCheckboxChange('medicine', index)}
          textValues={textValues.medicine.split(' ')}
          onTextChange={(newValue) => handleTextChange('medicine', newValue)}
        />
        <SkillCheckBoxInput
          label='Occult'
          values={checkboxValues.occult}
          onChange={(index) => handleSkillCheckboxChange('occult', index)}
          textValues={textValues.occult.split(' ')}
          onTextChange={(newValue) => handleTextChange('occult', newValue)}
        />
        <SkillCheckBoxInput
          label='Politics'
          values={checkboxValues.politics}
          onChange={(index) => handleSkillCheckboxChange('politics', index)}
          textValues={textValues.politics.split(' ')}
          onTextChange={(newValue) => handleTextChange('politics', newValue)}
        />
        <SkillCheckBoxInput
          label='Science'
          values={checkboxValues.science}
          onChange={(index) => handleSkillCheckboxChange('science', index)}
          textValues={textValues.science.split(' ')}
          onTextChange={(newValue) => handleTextChange('science', newValue)}
        />
        <SkillCheckBoxInput
          label='Technology'
          values={checkboxValues.technology}
          onChange={(index) => handleSkillCheckboxChange('technology', index)}
          textValues={textValues.technology.split(' ')}
          onTextChange={(newValue) => handleTextChange('technology', newValue)}
        />
      </div>
    </div>
  );
}
