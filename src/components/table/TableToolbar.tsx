import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { users } from '@/constants/Users';
import { DataTableFacetedFilter } from './FacetedFilter';
import { useState } from 'react';
import Input from '../inputs/Input';
import DateRangePicker from '../inputs/DateRangePicker';
import { DataTableViewOptions } from './TableViewOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {

  // STATE VARIABLES
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchValue, setSearchValue] = useState<string>(
    (table.getColumn('name')?.getFilterValue() as string) ?? ''
  );

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
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={users?.map((user) => {
              return {
                label: user?.status,
                value: user?.status,
              };
            })}
          />
        )}
        {table.getColumn('email') && (
          <DataTableFacetedFilter
            column={table.getColumn('email')}
            title="Email"
            options={Array.from(
              table.getColumn('email')?.getFacetedUniqueValues() || []
            )?.map((email) => {
              return {
                label: String(email),
                value: String(email),
              };
            })}
          />
        )}
        <DateRangePicker />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
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
