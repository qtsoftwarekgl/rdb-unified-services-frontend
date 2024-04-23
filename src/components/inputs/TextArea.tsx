import React, { FC, LegacyRef, forwardRef, ChangeEvent } from 'react';

interface TextAreaProps {
  cols?: number;
  rows?: number;
  className?: string;
  defaultValue?: string | number | readonly string[] | undefined;
  resize?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string | undefined;
  required?: boolean;
  readonly?: boolean;
  onBlur?: () => void | undefined;
  label?: string | JSX.Element;
  ref?: LegacyRef<HTMLTextAreaElement> | undefined;
}

const TextArea: FC<TextAreaProps> = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  cols = 50,
  rows = 5,
  className = '',
  defaultValue = undefined,
  resize = false,
  onChange,
  placeholder = undefined,
  required = false,
  readonly = false,
  onBlur,
  label = null,
}, ref) => {

  return (
    <label className="flex flex-col gap-[6px] item-start w-full">
      <p
        className={`text-[15px] flex items-center gap-1 ${!label && 'hidden'}`}
      >
        {label}{' '}
        <span className={`${required ? 'text-red-500' : 'hidden'}`}>*</span>
      </p>
      <textarea
        cols={cols}
        rows={rows}
        ref={ref}
        readOnly={readonly}
        placeholder={placeholder}
        className={`border-[1.5px] border-opacity-50 text-[15px] placeholder:text-[13px] border-secondary flex items-center justify-center px-4 py-[8px] w-full focus:border-[1.3px] focus:outline-none focus:border-primary rounded-md ${
          resize ? null : 'resize-none'
        } ${className}`}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
      ></textarea>
    </label>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
