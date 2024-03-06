import { FC, MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
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
  search?: boolean;
  password?: boolean;
  suffixIcon?: IconProp;
  suffixIconHandler?: MouseEventHandler<HTMLAnchorElement> | undefined;
}

const Input: FC<InputProps> = ({
  type = 'text',
  label = null,
  placeholder,
  className,
  required = false,
  search = false,
  value,
  onChange,
  defaultValue,
  suffixIcon = null,
  suffixIconHandler,
}) => {
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2">
        <input
          type={type}
          onChange={onChange}
          className={`w-5 h-5 border-[1.5px] rounded-xl cursor-pointer border-secondary outline-none focus:outline-none accent-primary focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
        <span className={`${label ? 'text-[13px]' : 'hidden'}`}>{label}</span>
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
      {!search && !suffixIcon && (
        <input
          defaultValue={defaultValue}
          value={value && value}
          type={type || 'text'}
          onChange={onChange}
          placeholder={placeholder}
          className={`py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
        />
      )}
      {(search || suffixIcon) && (
        <div className="relative w-full">
          <input
            defaultValue={defaultValue}
            value={value && value}
            type={type || 'text'}
            onChange={onChange}
            placeholder={placeholder}
            className={`py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
          />
          <Link
            to={'#'}
            onClick={suffixIconHandler}
            className={`absolute top-0 end-0 p-2.5 px-3.5 text-sm font-medium h-full rounded-e-lg border focus:outline-none ${
              search
                ? 'bg-primary text-white border-primary border-l-none'
                : 'border-secondary border-opacity-50 bg-white text-primary border-l-none'
            }`}
          >
            <FontAwesomeIcon icon={suffixIcon || faSearch} />
            <span className="sr-only">Search</span>
          </Link>
        </div>
      )}
    </label>
  );
};

export default Input;
