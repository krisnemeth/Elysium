import React, { useState } from 'react';
import BioDataDateOf from './BioDataDateOf';
import BioDataAge from './BioDataAge';
import BioDataTextArea from './BioDataTextArea';

export default function BioData() {
  const [date, setDate] = useState({
    birth: new Date(),
    death: new Date(),
  });

  // Calculate the difference in years between the two dates
  const apparentAge = date.death.getFullYear() - date.birth.getFullYear();
  const trueAge = new Date().getFullYear() - date.birth.getFullYear();

  // Convert the Date objects to strings in the 'yyyy-mm-dd' format
  const birthDateForInput = date.birth.toISOString().split('T')[0];
  const deathDateForInput = date.death.toISOString().split('T')[0];

  const handleDateChange = (id: string, newDate: Date) => {
    if (isNaN(newDate.getTime())) {
      // The input value is not a valid date
      return;
    }

    setDate((prevDate) => ({ ...prevDate, [id]: newDate }));
  };

  return (
    <div className='flex flex-col'>
      <div className='text-center my-2 border-b-2 border-slate-300 mt-4'>
        <h4 className='text-lg text-slate-300'>Biographical Data</h4>
      </div>
      <BioDataDateOf
        label='Date Of Birth'
        id='birth'
        placeholder='DD/MM/YYYY'
        value={birthDateForInput}
        onChange={(newDate) => handleDateChange('birth', newDate)}
      />
      <BioDataDateOf
        label='Date Of Death'
        id='death'
        placeholder='DD/MM/YYYY'
        value={deathDateForInput}
        onChange={(newDate) => handleDateChange('death', newDate)}
      />
      <BioDataAge label='True Age' id='trueAge' age={trueAge} />
      <BioDataAge label='Apparent Age' id='trueAge' age={apparentAge} />
      <BioDataTextArea label='Appearance' id='appearance' rows={5} />
      <BioDataTextArea
        label='Distinguishing Features'
        id='distinguishingFeatures'
        rows={5}
      />
      <BioDataTextArea label='History' id='history' rows={8} />
    </div>
  );
}
