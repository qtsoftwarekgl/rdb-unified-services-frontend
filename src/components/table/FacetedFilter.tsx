import { CheckIcon } from "@radix-ui/react-icons"
import { Column, Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { capitalizeString } from "@/helpers/strings"
import { useLocation, useNavigate } from "react-router-dom"
import { ComponentType, useEffect, useMemo, useState } from "react"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: ComponentType<{ className?: string }>
  }[];
  table: Table<TData>
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  table
}: DataTableFacetedFilterProps<TData, TValue>) {


  // STATE VARIABLES
  const [queryExists, setQueryExists] = useState<string[]>([])

  // TABLE DEFINITIONS
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = useMemo(
    () => new Set(column?.getFilterValue() as string[]),
    [column]
  );

  // NAVIGATE
  const navigate = useNavigate();
  const { search } = useLocation();

  // CATCH QUERY PARAMS
  const urlParams = new URLSearchParams(search);


  useEffect(() => {
    if (
      urlParams.has('status') &&
      !Array.from(selectedValues).includes(urlParams.get('status') as string)
    ) {
      const statusColumn = table.getColumn('status');
      const statuses = Array.from(
        statusColumn?.getFacetedUniqueValues() ?? []
      ).map((status) => {
        return String(status)?.split(',')[0];
      });
      // REMOVE STATUSES FROM SELECTED VALUES
      statuses.forEach((status) => {
        if (selectedValues.has(status)) {
          selectedValues.delete(status);
        }
      });
      setQueryExists([urlParams.get('status') as string]);
      queryExists.forEach((query) => {
        selectedValues.add(query);
      });
      const filterValues = Array.from(selectedValues);
      statusColumn?.setFilterValue(
        filterValues.length ? filterValues : undefined
      );
    }
  }, [urlParams]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="shadow-none text-[13px] font-normal flex items-center gap-2"
        >
          <FontAwesomeIcon
            icon={faFilter}
            className="text-primary text-opacity-90"
          />
          <p className="text-[13px]">{title}</p>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <menu className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </menu>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    className="flex items-center w-full"
                    key={option.value}
                    onSelect={() => {
                      navigate(``);
                      if (isSelected || queryExists.includes(option.value)) {
                        selectedValues.delete(option.value);
                        queryExists.splice(queryExists.indexOf(option.value), 1);
                      } else {
                        selectedValues.add(option.value?.split(',')[0]);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <figure
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary cursor-pointer',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-100 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon
                        className={cn('h-4 w-4 rounded-md cursor-pointer')}
                      />
                    </figure>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="text-[13px] text-black">
                      {capitalizeString(option.label)}
                    </p>
                    {facets?.get(option.value) && (
                      <p className="flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </p>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined);
                      navigate(``);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
