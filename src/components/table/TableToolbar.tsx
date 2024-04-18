// In TableToolbar component
import { useState } from 'react';
import { Table, ColumnDef } from '@tanstack/react-table';
import { DataTableViewOptions } from './TableViewOptions';
import DateRangePicker from '../inputs/DateRangePicker';
import { DataTableFacetedFilter } from './FacetedFilter';
import { DateRange } from 'react-day-picker';
import moment from 'moment';
import { capitalizeString } from '@/helpers/strings';
import { Button } from '../ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import Select from '../inputs/SingleSelect';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import exportPDF from './Export';

interface TableToolbarProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export default function TableToolbar<TData, TValue>({
  table,
  columns,
}: TableToolbarProps<TData, TValue>) {
  // STATE VARIABLES
  const isFiltered = table.getState().columnFilters.length > 0;

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
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  // Function to handle global filter change
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilterValue(value);
    table.setGlobalFilter(value);
  };

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
      <nav className="flex flex-1 items-center space-x-2 w-full">
        <menu className="flex items-center gap-0 w-full">
          <Select
            className="border border-r-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-l-md"
            placeholder="Search by column..."
            options={Array.from(columns)
              ?.filter((column) => column?.filterFn && column?.id !== 'date')
              ?.map((column) => {
                return {
                  label: capitalizeString(column?.accessorKey),
                  value: column?.accessorKey,
                };
              })}
          />
          <input
            placeholder="Search all columns..."
            className="placeholder:text-[13px] text-[14px] h-9 w-full max-w-[30%] border border-l-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-r-md"
            value={globalFilterValue}
            onChange={(event) => {
              handleGlobalFilterChange(event.target.value);
            }}
          />
        </menu>
      </nav>
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
      <Button
        variant="outline"
        className="flex items-center gap-2 font-normal"
        onClick={(e) => {
          e.preventDefault();
          exportPDF({
            columns: Array.from(columns)?.filter(
              (column) =>
                column?.accessorKey !== 'actions' &&
                column?.accessorKey !== 'action' &&
                column?.id !== 'no'
            ),
            table,
          });
        }}
      >
        <FontAwesomeIcon icon={faFile} className="text-primary" /> Export
      </Button>
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => {
            table.resetColumnFilters();
            setDateRange(undefined);
          }}
          className="h-8 px-2 lg:px-3 text-[12px] font-normal hover:font-medium"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </section>
  );
}
