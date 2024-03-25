import { FC, LegacyRef, forwardRef } from "react";
import ReactSelect, {
  SingleValue,
  MultiValue,
  OptionsOrGroups,
  GroupBase,
  ThemeConfig,
} from "react-select";

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
  onChange: ((e: SingleValue<Option> | MultiValue<Option>) => void);
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
  label?: string | JSX.Element;
  required?: boolean;
  labelClassName?: string;
  ref?: LegacyRef<ReactSelect<Option, boolean, GroupBase<Option>>> | undefined;
}

const Select: FC<SelectProps> = forwardRef(
  (
    {
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
      label = null,
      required = false,
      labelClassName = null,
    },
    ref
  ) => {
    const mappedOptions: OptionsOrGroups<
      Option,
      GroupBase<Option>
    > = options?.map((option: Option) => ({
      ...option,
      label: option.text || option.name || option.title || option.label,
      value: option.value || option.id || '',
      isDisabled: option.disabled,
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
          onChange={(
            e: unknown | Option | SingleValue<Option> | MultiValue<Option>
          ) => {
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
          defaultValue={defaultValue}
          onBlur={onBlur}
          unstyled={!styled}
          ref={ref}
          options={mappedOptions}
          className={`${className}`}
          theme={(theme: ThemeConfig) => ({
            ...theme,
            borderRadius: '0.5rem',
            paddingTop: '0.2px',
            fontSize: '13px',
            colors: {
              ...theme.colors,
              primary: '#005A96',
              primary25: '#005A96',
            },
          })}
          styles={
            styled
              ? {
                  control: (provided) => ({
                    ...provided,
                    display: 'flex',
                    border: '1.5px solid #D1D5DB',
                    '&hover': {
                      border: '1.6px solid #005A96',
                    },
                    '&focus': {
                      border: '1.6px solid #005A96',
                    },
                  }),
                }
              : {}
          }
        />
      </label>
    );
  }
);

Select.displayName = 'Select'

export default Select;
