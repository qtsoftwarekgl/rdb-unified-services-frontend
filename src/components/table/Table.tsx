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
import { faFileExport, faFilter } from '@fortawesome/free-solid-svg-icons';
import Button from '../inputs/Button';
import { setFilterModal } from '../../states/features/tableSlice';
import TablePagination from './TablePagination';
import { setTotalPages } from '../../states/features/paginationSlice';
import exportPDF from './Export';

interface Column extends ColumnDef<unknown> {
  header: string;
  cell: ({ value }: { value: unknown }) => JSX.Element | unknown;
  filter?: boolean;
}

interface TableProps {
  data: Array<unknown>;
  columns: Array<Column>;
  showPagination?: boolean;
  pageSize?: number;
  showFilter?: boolean;
  className?: string;
  tableTitle?: string;
  headerClassName?: string;
  columnsToExport?: Array<string>;
  exportOptions?: {
    orientation: 'portrait' | 'landscape';
    format: 'a3' | 'a4' | 'a5' | 'letter' | 'legal';
    fileName: string;
  };
  exportFIleName?: string;
  showExport?: boolean;
}

const Table: FC<TableProps> = ({
  data,
  columns,
  showPagination = true,
  pageSize,
  showFilter = true,
  className,
  tableTitle,
  headerClassName,
  showExport = false,
  exportFIleName,
  exportOptions = {
    orientation: 'landscape',
    format: 'a4',
    fileName: exportFIleName ?? 'Applications',
  },
  columnsToExport = [],
}) => {

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
        pageSize: pageSize || size,
        pageIndex: page,
      },
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
    <section className="flex flex-col w-full gap-6 rounded-md">
      <menu
        className={`${
          showFilter ? 'flex' : 'hidden'
        } w-full items-start gap-6 justify-between `}
      >
        <menu className="flex items-center w-full gap-2">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="!w-full !min-w-[15vw]"
            placeholder="Search all columns..."
          />
          {showExport && <Button
            className="!py-[5px] !my-auto"
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFileExport} />
                Export
              </menu>
            }
            primary
            onClick={(e) => {
              e.preventDefault();
              exportPDF({
                table,
                fileName: exportOptions?.fileName,
                columns: columns?.filter((column) =>
                  columnsToExport.includes(column.accessorKey)
                ),
                options: {
                  ...exportOptions,
                },
              });
            }}
          />}
        </menu>
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
              <span key={index} className="flex items-center w-full gap-2">
                {headerGroup.headers.map((header) => (
                  <span
                    key={header.id}
                    className={`${
                      header?.column?.columnDef?.filterFn !==
                        'includesString' && 'hidden'
                    } text-[14px] w-full font-medium text-left`}
                  >
                    <menu className="flex justify-end w-full gap-2 items">
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
      <section className="flex flex-col w-full mx-auto mt-2">
        <div className="-mx-4 -my-1 overflow-x-auto sm:-mx-6 lg:-mx-1">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-1">
            <span
              className={`flex border-[1.5px] border-background flex-col gap-4 overflow-hidden ${className}`}
            >
              <table className="">
                {tableTitle && (
                  <thead>
                    <tr>
                      <th
                        className="p-4 bg-[#5c7285] border-background uppercase font-semibold text-left text-white"
                        colSpan={columns.length}
                      >
                        {tableTitle}
                      </th>
                    </tr>
                  </thead>
                )}
                <thead className={headerClassName}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="uppercase border-b">
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
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: <span className="pl-2">↑</span>,
                                  desc: <span className="pl-2">↓</span>,
                                }[header.column.getIsSorted() as string] ??
                                  null}
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </span>
          </div>
        </div>
      </section>
      {showPagination && <TablePagination />}
    </section>
  );
};

export default Table;
