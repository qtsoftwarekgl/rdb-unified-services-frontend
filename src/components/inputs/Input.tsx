import { FC } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  submit?: boolean;
  type?: string;
}

const Input: FC<InputProps> = ({
  type = 'text',
  label = null,
  placeholder,
  className,
  required = false,
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
    <label className="flex flex-col gap-[5px]">
      <p className={`${label ? 'flex items-center gap-[5px]' : 'hidden'}`}>
        {label}{' '}
        <span className={required ? 'text-[14px] text-red-600' : 'hidden'}>
          *
        </span>
      </p>
      <input
        defaultValue={defaultValue}
        type={type || 'text'}
        onChange={onChange}
        placeholder={placeholder}
        className={`py-2 px-4 flex items-center w-full rounded-lg border-[1.5px] border-secondary outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50 ${className}`}
      />
    </label>
  );
};

export default Input;
