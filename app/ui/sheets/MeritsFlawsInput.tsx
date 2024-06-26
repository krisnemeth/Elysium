interface MeritsFlawsInputProps {
  textInputValue: string;
  checkboxValues: boolean[];
  handleTextInputChange: (value: string) => void;
  handleCheckboxChange: (index: number, value: boolean) => void;
}

export default function MeritsFlawsInput({
  textInputValue,
  checkboxValues,
  handleTextInputChange,
  handleCheckboxChange,
}: MeritsFlawsInputProps) {
  return (
    <div className='grid grid-cols-12 mt-1.5 xl:mx-2'>
      <div className=' col-span-8 px-2'>
        <input
          type='text'
          value={textInputValue}
          onChange={(e) => handleTextInputChange(e.target.value)}
          className='w-full appearance-none bg-transparent border-b-2 border-dotted border-slate-300 text-slate-300 text-lg font-semibold px-2 py-1 leading-tight focus:outline-none focus:ring-0'
        />
      </div>
      <div className='flex flex-row justify-end mr-2 xl:mr-4 col-span-4'>
        {checkboxValues.map((value, index) => (
          <input
            key={index}
            type='checkbox'
            checked={value}
            onChange={(e) => handleCheckboxChange(index, e.target.checked)}
            className={`border-2 border-slate-300 text-slate-300 shadow-sm rotate-45 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent rounded-md ml-2 w-3 h-3 mt-3 inline-block cursor-pointer checked:bg-slate-300 ${
              value ? 'bg-slate-300' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
