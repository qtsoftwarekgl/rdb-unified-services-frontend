import { FC } from 'react';
import ReactSelect, { SingleValue, MultiValue, OptionsOrGroups, GroupBase } from 'react-select';

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
  selectedValue?: string;
  defaultLabel?: string;
  isSearchable?: boolean;
  multiple?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void | undefined;
  defaultValue?: Option | Option[] | null;
  styled?: boolean;
}

const Select: FC<SelectProps> = ({
      options = [],
      onChange,
      className = '',
      defaultValue = null,
      disabled = false,
      isSearchable = true,
      multiple = false,
      autoFocus = false,
      onBlur,
      styled = true,
    }) => {
    const mappedOptions: OptionsOrGroups<Option, GroupBase<Option>> = options.map((option: Option) => ({
        ...option,
        label: option.text || option.name || option.title || option.label,
        value: option.value || option.id || '',
        isDisabled: option.disabled,
    }));

    return (
      <ReactSelect
        onChange={(e) => {
          if (multiple) {
            onChange(Array.isArray(e) ? e.map((item) => item?.value) : []);
          } else {
            onChange(e);
          }
        }}
        isSearchable={isSearchable}
        isMulti={multiple}
        isDisabled={disabled}
        autoFocus={autoFocus}
        className={`outline-none w-full py-[7px] ${className} ${!styled && '!border-none !py-0'}`}
        defaultValue={defaultValue}
        onBlur={onBlur}
        options={mappedOptions}
      />
    );
  }

export default Select;
