import { forwardRef, FC } from 'react';

interface TextAreaProps {
  cols?: number;
  rows?: number;
  className?: string;
  defaultValue?: string | null | undefined;
  resize?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string | null | undefined;
  required?: boolean;
  readonly?: boolean;
  onBlur?: () => void | undefined;
  label?: string | JSX.Element;
}

const TextArea: FC<TextAreaProps> = forwardRef(
  (
    {
      cols = 50,
      rows = 5,
      className,
      defaultValue = null,
      resize = false,
      onChange,
      placeholder = null,
      required = false,
      readonly,
      onBlur,
      label = null,
    },
    ref
  ) => {
    return (
      <label className="flex flex-col gap-[6px] item-start w-full">
        <p
          className={`text-[15px] flex items-center gap-1 ${
            !label && 'hidden'
          }`}
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
          className={`border-[1.5px] border-opacity-50 text-[15px] border-secondary flex items-center justify-center px-4 py-[8px] w-full focus:border-[1.3px] focus:outline-none focus:border-primary rounded-md ${
            resize ? null : 'resize-none'
          } ${className}`}
          onChange={onChange}
          onBlur={onBlur}
          defaultValue={defaultValue && defaultValue}
        ></textarea>
      </label>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
