import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";

interface SelectProps {
  label?: string | undefined;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string | undefined;
  placeholder?: string;
  className?: string;
  onChange?: ((value: string) => void) | undefined;
  value?: string | undefined;
  required?: boolean;
  labelClassName?: string | undefined;
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
}) => {
  return (
    <label className={`flex flex-col gap-1 w-full ${labelClassName}`}>
      <p className="flex items-center gap-1 text-[14px]">
        {label} <span className={required ? `text-red-600` : "hidden"}>*</span>
      </p>
      <SelectComponent
        onValueChange={onChange}
        defaultValue={defaultValue}
        value={value}
      >
        <SelectTrigger
          className={`w-full focus:ring-transparent ring-0 h-10 ${className}`}
        >
          <SelectValue
            className="!text-[10px]"
            placeholder={
              <p className="text-[14px] text-gray-500">{placeholder}</p>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index: number) => {
              return (
                <SelectItem
                  key={index}
                  value={option.value}
                  className="cursor-pointer text-[12px]"
                >
                  <p className="text-[14px]">{option.label}</p>
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
