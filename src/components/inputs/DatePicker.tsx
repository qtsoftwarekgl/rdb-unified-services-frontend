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

interface DatePickerProps {
  onChange: SelectSingleEventHandler | ((e: ChangeEvent<HTMLInputElement>) => void)
  value: Date | undefined

}

const DatePicker: FC<DatePickerProps> = ({ onChange, value = undefined }) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal py-2",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <p className="text-[13px]">Select date</p>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange as SelectSingleEventHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker;
