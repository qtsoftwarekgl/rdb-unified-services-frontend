import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UUID } from "crypto";
import { FC, useState, useRef, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

interface SelectProps {
  label?: string | number | undefined;
  options?: Array<{ label: string | undefined; value: string | UUID, disabled?: boolean }>;
  defaultValue?: string | undefined;
  placeholder?: string;
  className?: string;
  onChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
  required?: boolean;
  labelClassName?: string | undefined;
  name?: string | undefined;
  searchable?: boolean;
}

const Select: FC<SelectProps> = ({
  options = [],
  defaultValue = undefined,
  placeholder = "Select here...",
  className = undefined,
  value = "",
  onChange,
  label = undefined,
  required = false,
  labelClassName = undefined,
  name = undefined,
  searchable = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : options;

  const handleValueChange = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    setSearchTerm("");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [debouncedSearchTerm]);

  return (
    <label className={`flex flex-col gap-1 w-full ${labelClassName}`}>
      <p className={label ? "flex items-center gap-1 text-[14px]" : "hidden"}>
        {label} <span className={required ? `text-red-600` : "hidden"}>*</span>
      </p>
      <SelectComponent
        onValueChange={handleValueChange}
        defaultValue={defaultValue}
        value={value}
        name={name}
      >
        <SelectTrigger
          className={`w-full focus:ring-transparent ring-0 h-10 ${className}`}
        >
          <SelectValue
            className="!text-[10px]"
            placeholder={
              <p className="text-[13px] text-gray-500">{placeholder}</p>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredOptions.map((option, index: number) => {
              return (
                <SelectItem
                  key={index}
                  value={option.value}
                  disabled={option?.disabled}
                  className="cursor-pointer text-[13px] py-1"
                >
                  <p className="text-[13px] py-[3px]">{option.label}</p>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </SelectComponent>
    </label>
  );
};

export default Select;
