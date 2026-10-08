'use client';

import { MdPictureAsPdf } from 'react-icons/md';

export default function PrintButton() {
  return (
    <button
      type='button'
      onClick={() => window.print()}
      className='inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 print:hidden'
    >
      <MdPictureAsPdf aria-hidden /> Save as PDF or print
    </button>
  );
}
