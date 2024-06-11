import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChangeEvent, FC } from "react"
import { SelectSingleEventHandler } from "react-day-picker"
import moment from "moment"

interface DatePickerProps {
  value: Date | undefined
onChange: SelectSingleEventHandler | ((e: ChangeEvent<HTMLInputElement>) => void) | undefined
}

const DatePicker: FC<DatePickerProps> = ({ onChange, value = undefined }) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal py-2 h-[38px]',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'PPP')
          ) : (
            <p className="text-[13px]">Select date</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(e) => {
            e && onChange(moment(e).format());
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
