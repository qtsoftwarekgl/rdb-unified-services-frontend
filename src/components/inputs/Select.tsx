import { FC, LegacyRef, useEffect, useRef, useState } from 'react';
import ReactSelect, {
  SingleValue,
  MultiValue,
  OptionsOrGroups,
  GroupBase,
  PropsValue,
} from 'react-select';

interface Option {
  label?: string | number | undefined;
  text?: string | number;
  value: string | number;
  disabled?: boolean;
  id?: string | number;
  name?: string | number;
  title?: string | number;
}

interface SelectProps {
  options?: Option[] | undefined;
  onChange: (e: SingleValue<Option> | MultiValue<Option>) => void;
  className?: string;
  disabled?: boolean;
  defaultLabel?: string;
  isSearchable?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void | undefined;
  defaultValue?: PropsValue<Option | MultiValue<Option>> | undefined | string;
  styled?: boolean;
  label?: string | JSX.Element;
  required?: boolean;
  labelClassName?: string;
  value?: PropsValue<Option | MultiValue<Option>> | undefined;
}

const Select: FC<SelectProps> = ({
  options = [],
  onChange,
  className = '',
  defaultValue = undefined,
  disabled = false,
  isSearchable = true,
  multiple = false,
  autoFocus = false,
  onBlur,
  styled = true,
  label = null,
  required = false,
  labelClassName = null,
  value,
}) => {
  // STATE VARIABLES
  const [selectedOption, setSelectedOption] = useState<
    PropsValue<Option | MultiValue<Option>> | undefined
  >(value);
  const selectRef = useRef();
  useEffect(() => {
    if (!defaultValue && !value && selectRef?.current) {
      (selectRef.current as ReactSelect).clearValue();
    }
  }, [defaultValue, selectRef, value]);

  const mappedOptions: OptionsOrGroups<
    Option,
    GroupBase<Option>
  > = options?.map((option: Option) => ({
    ...option,
    label: option?.text || option?.name || option?.title || option?.label,
    value: option?.value || option?.id || '',
    isDisabled: option?.disabled,
  }));

  return (
    <label
      className={`flex flex-col gap-[5px] items-start w-full ${labelClassName}`}
    >
      <p
        className={`${
          label ? 'flex items-center gap-1 text-[14px]' : 'hidden'
        }`}
      >
        {label}{' '}
        <span className={`${required ? 'text-red-500' : 'hidden'}`}>*</span>
      </p>
      <ReactSelect
        onChange={(e: SingleValue<Option> | MultiValue<Option>) => {
          if (multiple) {
            onChange(Array.isArray(e) ? e.map((item) => item?.value) : []);
          } else {
            onChange(e?.value);
            setSelectedOption(e as Option);
          }
        }}
        isSearchable={isSearchable}
        isMulti={multiple}
        isDisabled={disabled}
        autoFocus={autoFocus}
        onBlur={onBlur}
        value={selectedOption}
        unstyled={!styled}
        ref={
          selectRef as
            | LegacyRef<
                Select<Option | MultiValue<Option>, boolean, GroupBase<Option>>
              >
            | undefined
        }
        options={mappedOptions}
        defaultValue={
          mappedOptions?.find(
            (option) =>
              'value' in option && String(option.value) === String(defaultValue)
          ) as PropsValue<Option | MultiValue<Option>> | undefined
        }
        className={`${className}`}
      />
    </label>
  );
};

export default Select;
