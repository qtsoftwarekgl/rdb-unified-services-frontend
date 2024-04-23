import { format } from 'date-fns';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  className?: string;
}

const DateRangePicker = ({
  value,
  onChange,
  className,
}: DateRangePickerProps) => {
  const [selectedValue, setSelectedValue] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const handleDateChange = (dateRange: DateRange) => {
    setSelectedValue(dateRange);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal items-center',
              !value && 'text-muted-foreground'
            )}
          >
            <FontAwesomeIcon
              icon={faCalendarWeek}
              className="mr-2 h-4 w-4 text-primary"
            />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <p className="text-[13px]">Select range</p>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 flex flex-col items-center"
          align="start"
        >
          <Calendar
            mode="range"
            selected={selectedValue}
            onSelect={handleDateChange as SelectRangeEventHandler}
            numberOfMonths={2}
          />
          <menu className="flex items-center gap-2">
            <Button
              variant="default"
              className="my-2 mx-auto text-[12px] bg-primary hover:bg-primary"
              onClick={(e) => {
                e.preventDefault();
                onChange(selectedValue);
              }}
            >
              Apply
            </Button>
            <Button
              variant="outline"
              className="my-2 mx-auto text-[12px]"
              onClick={(e) => {
                e.preventDefault();
                setSelectedValue({ from: undefined, to: undefined });
              }}
            >
              Clear
            </Button>
          </menu>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
