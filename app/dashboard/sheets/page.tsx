import GlowUpButtonMedium from '@/app/ui/glowUpButtonMedium';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function Sheets() {
  return (
    <div className='text-slate-300'>
      <p>Click the button to start creating your next character</p>
      <div className='mt-6'>
        <GlowUpButtonMedium
          buttonText='Create New'
          buttonIcon={<FaPlus className='inline h-3 ml-2' />}
          buttonHref='./sheets/create'
        ></GlowUpButtonMedium>
      </div>
    </div>
  );
}
