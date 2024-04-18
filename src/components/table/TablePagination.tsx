import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { useEffect } from 'react';
import {
  setCurrentPage,
  setSize,
  setTotalPages,
} from '@/states/features/paginationSlice';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { page, size, totalPages, totalSize, currentPage } = useSelector(
    (state: RootState) => state.pagination
  );

  // HANDLE PAGINATION CHANGE
  useEffect(() => {
    if (table.getState().pagination.pageSize) {
      dispatch(setSize(table.getState().pagination.pageSize));
    }
    if (table.getPageCount()) {
      dispatch(setTotalPages(table.getPageCount()));
    }
    if (table.getState().pagination.pageIndex) {
      dispatch(setCurrentPage(table.getState().pagination.pageIndex + 1));
    }
    if (table.getState().pagination.pageIndex !== page) {
      table.setPageIndex(page - 1);
    }
  }, [page, totalSize, dispatch, table]);

  return (
    <footer className="flex items-center justify-between px-2">
      <p className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </p>
      <menu className="flex items-center space-x-6 lg:space-x-8">
        <section className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${size}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
        <section className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </section>
        <section className="flex w-[100px] gap-2 items-center justify-center text-sm font-medium">
          <p className="text-[13px] text-secondary">Go to:</p>
          <input
            type="number"
            className="placeholder:text-[13px] text-[13px] max-w-[50%] py-1 px-2 w-full border border-[#E5E5E5] outline-none focus:outline-none rounded-md"
            onChange={(e) => {
              e.preventDefault();
              if (
                Number(e.target.value) <= 0 ||
                Number(e.target.value) > Number(totalPages)
              ) {
                return;
              } else {
                table.setPageIndex(Number(e.target.value) - 1);
                dispatch(setCurrentPage(Number(e.target.value)));
              }
            }}
          />
        </section>
        <section className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(0);
              dispatch(setCurrentPage(1));
            }}
            disabled={!table.getCanPreviousPage() || currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.preventDefault();
              table.previousPage();
              dispatch(setCurrentPage(currentPage - 1));
            }}
            disabled={!table.getCanPreviousPage() || currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.preventDefault();
              table.nextPage();
              dispatch(setCurrentPage(currentPage + 1));
            }}
            disabled={!table.getCanNextPage() || currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={(e) => {
              e.preventDefault();
              table.setPageIndex(table.getPageCount() - 1);
              dispatch(setCurrentPage(totalPages));
            }}
            disabled={!table.getCanNextPage() || currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </section>
      </menu>
    </footer>
  );
}
