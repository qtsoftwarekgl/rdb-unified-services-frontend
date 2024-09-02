import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface ComboboxProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  value?: string;
}

const Combobox = ({
  options,
  placeholder,
  onChange,
  label,
  required,
  labelClassName,
  value,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <label className={`flex flex-col gap-1 w-full ${labelClassName}`}>
      <p
        className={
          label ? 'flex items-center gap-1 text-[14px] px-1' : 'hidden'
        }
      >
        {label} <span className={required ? `text-red-600` : 'hidden'}>*</span>
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 font-normal"
          >
            {value ? (
              options.find((option) => option.value === value)?.label
            ) : (
              <p className="text-gray-500 text-[13px]">
                {placeholder || 'Select option...'}
              </p>
            )}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search option..." className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.label}
                    disabled={option?.disabled}
                    className="flex items-center gap-2"
                    value={option.label}
                    onSelect={(currentValue) => {
                      const selectedOption = options.find(
                        (option) => option.label === currentValue
                      );
                      onChange?.(selectedOption?.value || '');
                      setOpen(false);
                    }}
                  >
                    <p className="text-[13px] text-wrap text-ellipsis">
                      {option.label}
                    </p>
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </label>
  );
};

export default Combobox;
