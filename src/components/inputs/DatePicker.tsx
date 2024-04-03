import Datepicker from 'flowbite-datepicker/Datepicker';
import { useEffect, FC, ChangeEvent } from 'react';

interface DatePickerProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  ref: unknown;
}

const DatePicker: FC<DatePickerProps> = ({ onChange, placeholder = 'Select date', ref }) => {
  useEffect(() => {
    const datepickerEl = document?.getElementById('datepickerId');
    new Datepicker(datepickerEl, {});
  }, []);

  return (
    <article className="relative w-full">
      <input
        datepicker
        datepicker-autohide
        type="text"
        ref={(ref) => ref && ref.setAttribute('data-datepicker', '')}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
        placeholder={placeholder}
        id="datepickerId"
        onSelect={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e);
        }}
      />
      <span className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
    </article>
  );
};

export default DatePicker;
