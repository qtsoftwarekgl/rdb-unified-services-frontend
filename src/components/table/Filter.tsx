import { Column } from 'react-table';
import { Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import Select from '../inputs/Select';

const Filter = ({
  column,
  table,
  label,
}: {
  column: Column<unknown>;
  table: Table<unknown>;
  label: JSX.Element;
}) => {
  // FILTER NON FILTERED COLUMNS
  if (column?.columnDef?.filterFn !== 'includesString') return null;

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id ?? '');

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return (
    <Select
      label={label}
      options={[{ value: '', label: 'All' }, ...sortedUniqueValues]
        ?.filter((value) => value !== undefined)
        ?.map((option) => {
          return {
            label: option?.label || option,
            value: option?.value === '' ? option?.value : option,
            isDisabled: !option,
          };
        })}
      onChange={(value) => column.setFilterValue(value?.value)}
    />
  );
};

export default Filter;
