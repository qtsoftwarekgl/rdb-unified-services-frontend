import { useEffect, useState, FC } from 'react';
import Input from '../inputs/Input';

interface DebouncedInputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  className?: string;
  placeholder?: string;
  type?: string;
}

const DebouncedInput: FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 200,
  className,
  placeholder,
  type = 'text',
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Input
      {...props}
      value={value}
      type={type}
      className={`${className}`}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default DebouncedInput;
