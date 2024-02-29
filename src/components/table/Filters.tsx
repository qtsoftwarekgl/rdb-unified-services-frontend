import { FC } from 'react';
import { Table } from '@tanstack/react-table';

interface FiltersProps {
    setColumnFilters: (prev: Array<unknown>) => void;
    table: Table<unknown>;
}

const Filters: FC<FiltersProps> = ({ setColumnFilters, table }) => {

    const columns = table?.getHeaderGroups()?.flatMap((headerGroup) => headerGroup?.headers)?.map((header) => header?.column) || [];

    return (
        <menu className='flex flex-wrap items-center gap-3 w-full justify-end'>
            {columns?.filter((column) => column?.columnDef?.filter)?.map((column, index) => {
                // GET SORTED UNIQUE VALUES
                const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort()

                // RETURN FILTERS
                return (
                    <select key={index} className='basis-[20%] border cursor-pointer border-gray-400 px-4 py-[4px] text-[15px] w-full max-w-[35%] focus:border-[1.2px] focus:outline-none rounded-md ring-[.3px] ring-inset' onChange={(e) => {
                        e.preventDefault();
                        setColumnFilters((prev) => {
                            const newFilters = [...prev];
                            const index = newFilters.findIndex((filter) => filter.id === column.id);
                            if (index === -1) {
                                newFilters.push({
                                    id: column.id,
                                    value: e.target.value,
                                });
                            } else {
                                newFilters[index].value = e.target.value;
                            }
                            return newFilters;
                        })
                    }}>
                        <option value="">{column?.columnDef?.header}</option>
                        {sortedUniqueValues.map((value) => {
                            return (
                                <option className='cursor-pointer' key={value} value={value}>
                                    {value}
                                </option>
                            )
                        })}
                    </select>
                )
            })}
        </menu>
    )
}

export default Filters;