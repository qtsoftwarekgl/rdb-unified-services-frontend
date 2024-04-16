import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FC } from "react";

interface SelectProps {
    label?: string;
    options?: Array<{ label: string; value: string }>;
    defaultValue?: string | undefined;
    placeholder?: string;
    className?: string;
}

const Select: FC<SelectProps> = ({ options = [], defaultValue = undefined, placeholder = '', className = undefined }) => {


  return (
    <SelectComponent defaultValue={defaultValue}>
      <SelectTrigger
        className={`w-fit !text-[10px] focus:ring-transparent ring-0 rounded-r-none ${className}`}
      >
        <SelectValue
          className="!text-[10px]"
          placeholder={<p className="text-[12px] text-gray-500">{placeholder}</p>}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => {
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer text-[12px]"
              >
                <p className="text-[12px]">{option.label}</p>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </SelectComponent>
  );
}

export default Select
