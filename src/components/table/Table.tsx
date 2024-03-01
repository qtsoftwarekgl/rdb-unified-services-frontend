import { useState, FC, useEffect } from 'react';
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
} from '@tanstack/react-table';
import DebouncedInput from './DebouncedInput';
import Filter from './Filter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Button from '../inputs/Button';
import { setFilterModal } from '../../states/features/tableSlice';
import TablePagination from './TablePagination';
import { setTotalPages } from '../../states/features/paginationSlice';

interface Column extends ColumnDef<unknown> {
  header: string;
  cell: ({ value }: { value: unknown }) => JSX.Element | unknown;
  filter?: boolean;
}

interface TableProps {
  data: Array<unknown>;
  columns: Array<Column>;
}

const Table: FC<TableProps> = ({ data, columns }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { size, page } = useSelector((state: RootState) => state.pagination);
  const { filterModal } = useSelector((state: RootState) => state.table);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // SET TOTAL PAGES
  useEffect(() => {
    if (data?.length > size) {
      dispatch(setTotalPages(Math.ceil(data.length / size)));
    }
  }, [data, dispatch, size]);

  const table = useReactTable({
    data,
    columns: columns?.map((column: Column) => {
      return {
        ...column,
        filterFn: column.filter ? 'includesString' : 'auto',
      };
    }),
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageSize: size,
        pageIndex: page,
      }
    },
    initialState: {
      pagination: {
        pageSize: size,
        pageIndex: page,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableColumnFilters: true,
    enableRowSelection: true,
    enableFilters: true,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <section className="flex flex-col gap-6 w-full rounded-md">
      <menu className="flex w-full items-start gap-6 justify-between">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className="w-full max-w-[45%]"
          placeholder="Search all columns..."
        />
        <menu className="flex flex-col gap-2 w-full max-w-[50%]:">
          <Button
            primary
            className="!px-3 !py-2 !w-fit self-end"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setFilterModal(!filterModal));
            }}
            value={
              <menu className="text-[12px] flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} />
                Filter
              </menu>
            }
          />
          <ul
            className={`${
              filterModal
                ? 'flex gap-4 w-full self-end'
                : '!h-[0px] opacity-0 pointer-events-none'
            } duration-200`}
          >
            {table.getHeaderGroups()?.map((headerGroup, index) => (
              <span key={index} className="w-full flex items-center gap-2">
                {headerGroup.headers.map((header) => (
                  <span
                    key={header.id}
                    className={`${
                      header?.column?.columnDef?.filterFn !==
                        'includesString' && 'hidden'
                    } text-[14px] w-full font-medium text-left`}
                  >
                    <menu className="flex items w-full gap-2">
                      <Filter
                        column={header?.column}
                        table={table}
                        label={
                          <p>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </p>
                        }
                      />
                    </menu>
                  </span>
                ))}
              </span>
            ))}
          </ul>
        </menu>
      </menu>
      <table className="border-[1.5px] border-background">
        <thead className="">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b uppercase">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 pr-2 py-4 text-[14px] font-medium text-left"
                >
                  {header.isPlaceholder ? null : (
                    <menu className="flex flex-col gap-2">
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
                    </menu>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="">
          {table.getRowModel().rows.map((row, index, arr) => (
            <tr
              key={row.id}
              className={`${
                index !== arr.length - 1 && 'border-b'
              } ease-in-out duration-200 hover:bg-background`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 py-3 text-[14px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination />
    </section>
  );
};

export default Table;
