import { FC } from 'react';

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
        )
    }

  return (
    <label className="flex flex-col gap-[5px] w-full">
      <p className={`${label ? 'flex items-center gap-[5px]' : 'hidden'}`}>
        {label}{' '}
        <span className={required ? 'text-[14px] text-red-600' : 'hidden'}>
          *
        </span>
      </p>
      <input
        defaultValue={defaultValue}
        value={value && value}
        type={type || 'text'}
        onChange={onChange}
        placeholder={placeholder}
        className={`py-[6px] px-4 flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
      />
    </label>
  );
};

export default Input;
