import { useState, FC } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  ColumnDef,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getFacetedRowModel,
  ColumnFiltersState,
  OnChangeFn
} from '@tanstack/react-table';
import Filters from './Filters';

interface TableProps {
    data: Array<unknown>;
    columns: Array<ColumnDef<unknown>>;
}

const Table: FC<TableProps> = ({ data, columns }) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns: columns?.map((column) => {
      if (!column?.filter) {
        return column;
      }
      return {
        ...column,
        filterFn: "includesString",
      };
    }),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 40,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: setColumnFilters,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    enableColumnFilters: true,
    enableRowSelection: true,
    enableFilters: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <section className="flex flex-col gap-6 w-full rounded-md">
      <menu>
        <Filters setColumnFilters={setColumnFilters} table={table} />
      </menu>
      <table className="border-[1.5px] border-background">
        <thead className=''>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b  uppercase"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 pr-2 py-4 text-[14px] font-medium text-left"
                >
                  {header.isPlaceholder ? null : (
                    <p
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none text-[14px] flex min-w-[36px]'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <span className="pl-2">↑</span>,
                        desc: <span className="pl-2">↓</span>,
                      }[header.column.getIsSorted() as string] ?? null}
                    </p>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className=''>
          {table.getRowModel().rows.map((row, index, arr) => (
            <tr key={row.id} className={`${index !== arr.length - 1 && 'border-b'} ease-in-out duration-200 hover:bg-background`}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 text-[14px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Table;
