import { Cross2Icon } from '@radix-ui/react-icons';
import { ColumnDef, Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { DataTableFacetedFilter } from './FacetedFilter';
import { useState } from 'react';
import Input from '../inputs/Input';
import { DataTableViewOptions } from './TableViewOptions';
import { capitalizeString } from '@/helpers/strings';
import DateRangePicker from '../inputs/DateRangePicker';
import { DateRange } from 'react-day-picker';
import moment from 'moment';

interface TableToolbarProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export default function TableToolbar<TData>({
  table,
  columns,
}: TableToolbarProps<TData, TValue>) {
  // STATE VARIABLES
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchValue, setSearchValue] = useState<string>(
    (table.getColumn('name')?.getFilterValue() as string) ?? ''
  );

  // HANDLE DATE RANGE SELECTOR
  const [dateRange, setDateRange] = useState<
    | DateRange
    | undefined
    | string
    | {
        from: string | undefined;
        to: string | undefined;
      }
  >(() => {
    return {
      from: undefined,
      to: undefined,
    };
  });

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    const column = table.getColumn('date');
    const selectedDate = {
      from: dateRange?.from && moment(dateRange?.from).format('YYYY-MM-DD'),
      to: dateRange?.to && moment(dateRange?.to).format('YYYY-MM-DD'),
    };
    setDateRange(selectedDate);
    column?.setFilterValue(selectedDate?.from);
  };

  return (
    <section className="flex items-center justify-between gap-4">
      <nav className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            table.getColumn('name')?.setFilterValue(event.target.value);
          }}
          className="py-2 w-full max-w-[30%]"
        />
        {Array.from(columns)
          ?.filter((column) => column?.filterFn)
          ?.map((column) => {
            if (column.id === 'date') {
              return (
                <DateRangePicker
                  key={column?.accessorKey}
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
              );
            }
            return (
              <DataTableFacetedFilter
                key={column?.accessorKey}
                column={table.getColumn(column?.accessorKey)}
                title={capitalizeString(column?.accessorKey)}
                options={Array.from(
                  table
                    .getColumn(column?.accessorKey)
                    ?.getFacetedUniqueValues() || []
                )?.map((column) => {
                  const splitColumn = String(column)?.split(',')[0];
                  return {
                    label: String(splitColumn),
                    value: String(splitColumn),
                  };
                })}
              />
            );
          })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              setDateRange(undefined);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </nav>
      <DataTableViewOptions table={table} />
    </section>
  );
}
