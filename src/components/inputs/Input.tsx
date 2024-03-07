import { FC, MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
import DatePicker from './DatePicker';

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number;
  submit?: boolean;
  type?: string;
  value?: string | number;
  password?: boolean;
  suffixIcon?: IconProp;
  prefixIcon?: IconProp;
  suffixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
  name?: string;
  suffixIconPrimary?: boolean;
  prefixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
  prefixIconPrimary?: boolean;
  prefixText?: string;
}

const Input: FC<InputProps> = ({
  type = 'text',
  label = null,
  placeholder,
  className,
  required = false,
  value,
  onChange,
  defaultValue,
  suffixIcon = null,
  suffixIconHandler,
  suffixIconPrimary = false,
  prefixIcon = null,
  prefixIconHandler,
  prefixIconPrimary = false,
  prefixText = null,
  name,
}) => {
  if (['checkbox', 'radio'].includes(type)) {
    return (
      <label className="flex items-center gap-2">
        <input
          type={type}
          name={name}
          onChange={onChange}
          className={`w-5 h-5 border-[1.5px] rounded-xl cursor-pointer border-secondary outline-none focus:outline-none accent-primary focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
        <span className={`${label ? 'text-[13px]' : 'hidden'}`}>{label}</span>
      </label>
    );
  }

  if (['date', 'month'].includes(type)) {
    return (
      <label className="flex flex-col gap-[5px] w-full">
        <p
          className={`${
            label ? 'flex items-center gap-[5px] text-[14px]' : 'hidden'
          }`}
        >
          {label}{' '}
          <span className={required ? 'text-[14px] text-red-600' : 'hidden'}>
            *
          </span>
        </p>
        <DatePicker onChange={onChange} />
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-[5px] w-full">
      <p
        className={`${
          label ? 'flex items-center gap-[5px] text-[14px]' : 'hidden'
        }`}
      >
        {label}{' '}
        <span className={required ? 'text-[14px] text-red-600' : 'hidden'}>
          *
        </span>
      </p>
      <menu className="relative w-full">
        <Link
          to={'#'}
          onClick={prefixIconHandler}
          className={`${
            !prefixIcon && !prefixText && 'hidden'
          } absolute top-0 left-0 p-2.5 px-3.5 text-sm font-medium h-full rounded-l-lg border focus:outline-none ${
            prefixIconPrimary
              ? 'bg-primary text-white border-primary border-r-none'
              : 'border-secondary border-opacity-50 bg-white text-primary border-r-none'
          } ${prefixText && '!bg-background !text-black'}`}
        >
          {prefixText ? (
            <p className='text-[15px]'>{prefixText}</p>
          ) : (
            <FontAwesomeIcon icon={prefixIcon || faSearch} />
          )}
        </Link>
        <input
          defaultValue={defaultValue}
          value={value && value}
          type={type || 'text'}
          onChange={onChange}
          placeholder={placeholder}
          className={`${
            prefixIcon && '!ml-10 !w-[90%]'
          } ${prefixText && '!ml-16 !w-[85%]'} py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
        <Link
          to={'#'}
          onClick={suffixIconHandler}
          className={`${
            !suffixIcon && 'hidden'
          } absolute top-0 end-0 p-2.5 px-3.5 text-sm font-medium h-full rounded-e-lg border focus:outline-none ${
            suffixIconPrimary
              ? 'bg-primary text-white border-primary border-l-none'
              : 'border-secondary border-opacity-50 bg-white text-primary border-l-none'
          }`}
        >
          <FontAwesomeIcon icon={suffixIcon || faSearch} />
        </Link>
      </menu>
    </label>
  );
};

export default Input;
