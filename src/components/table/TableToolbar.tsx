import { capitalizeString } from '@/helpers/strings';
import { Controller, useForm } from 'react-hook-form';
import Select from '../inputs/SingleSelect';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { MouseEventHandler } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

type TableToolbarProps = {
  searchTypes?: { label: string | undefined; value: string }[];
  searchTypeHandler?: ((value: string) => void) | undefined;
  searchInputHandler?: ((value: string) => void) | undefined;
  showExport?: boolean;
  exportHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  filterHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
  showFilter?: boolean;
};

const TableToolbar = ({
  searchTypes = [{ value: 'all', label: 'All' }],
  searchTypeHandler = undefined,
  searchInputHandler = undefined,
  showExport = false,
  exportHandler,
  filterHandler,
  showFilter = true,
}: TableToolbarProps) => {
  // REACT HOOK FORM
  const { control, watch } = useForm();

  return (
    <header className="w-full flex items-center gap-3 justify-between px-1">
      <label className="w-[45%] flex items-center">
        <menu className="flex items-center w-full gap-0">
          <Controller
            name="searchType"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  defaultValue="all"
                  placeholder="Search by..."
                  className="w-[50%] border border-r-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-l-md"
                  options={searchTypes}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    console.log(e);
                    searchTypeHandler && searchTypeHandler(e);
                  }}
                />
              );
            }}
          />
          <Controller
            name="searchInput"
            control={control}
            render={({ field }) => {
              return (
                <input
                  placeholder={
                    watch('searchType') === 'all'
                      ? 'Search all columns...'
                      : `Search by ${capitalizeString(watch('searchType'))}...`
                  }
                  className="placeholder:text-[13px] w-full text-[12px] h-10 border border-l-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-r-md"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    searchInputHandler && searchInputHandler(e.target.value);
                  }}
                />
              );
            }}
          />
        </menu>
      </label>
      <menu className="w-full flex items-center gap-2 justify-end">
        {showFilter && (
          <Button
            variant="outline"
            className="flex items-center gap-2 font-normal"
            onClick={filterHandler}
          >
            <FontAwesomeIcon icon={faFilter} className="text-primary" /> Filter
          </Button>
        )}
        {showExport && (
          <Button
            variant="outline"
            className="flex items-center gap-2 font-normal"
            onClick={exportHandler}
          >
            <FontAwesomeIcon icon={faFile} className="text-primary" /> Export
          </Button>
        )}
      </menu>
    </header>
  );
};

export default TableToolbar;
