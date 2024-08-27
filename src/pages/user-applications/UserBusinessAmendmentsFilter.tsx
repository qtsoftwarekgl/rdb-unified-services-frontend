import CustomPopover from '@/components/inputs/CustomPopover';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import { Button } from '@/components/ui/button';
import {
  amendmentStatuses,
  amendmentTypes,
} from '@/constants/businessAmendment.constants';
import { capitalizeString } from '@/helpers/strings';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface UserBusinessAmendmentsFilterProps {
  onSelectAmendmentStatuses?: (statuses: string[]) => void;
  onSelectAmendmentType?: (type: string) => void;
}

const UserBusinessAmendmentsFilter = ({
  onSelectAmendmentStatuses,
  onSelectAmendmentType,
}: UserBusinessAmendmentsFilterProps) => {
  // REACT HOOK FORM
  const { control, reset } = useForm();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'AMENDMENT_SUBMITTED',
    'PENDING_APPROVAL',
  ]);

  return (
    <nav className="w-full flex justify-between items-center gap-5 my-2">
      <menu className="grid grid-cols-2 gap-5 w-[50%]">
        <Controller
          name="amendmentType"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  placeholder="Select amendment type"
                  {...field}
                  options={amendmentTypes?.map((amendmentType) => {
                    return {
                      label: capitalizeString(amendmentType),
                      value: amendmentType,
                    };
                  })}
                  onChange={(e) => {
                    field.onChange(e);
                    onSelectAmendmentType && onSelectAmendmentType(e);
                  }}
                />
                <Link
                  to="#"
                  className="text-primary text-[13px] underline self-start px-1"
                  onClick={(e) => {
                    e.preventDefault();
                    field.onChange({ target: { value: '' } });
                  }}
                >
                  Clear
                </Link>
              </label>
            );
          }}
        />
        <Controller
          name="amendmentStatus"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <CustomPopover
                  trigger={
                    <Button
                      variant={'outline'}
                      className="text-[13px] text-black w-fit flex items-center gap-2 h-10 font-normal"
                    >
                      <FontAwesomeIcon
                        className="text-primary"
                        icon={faFilter}
                      />
                      Choose status
                    </Button>
                  }
                >
                  <menu className="flex flex-col gap-4 p-2">
                    {amendmentStatuses?.map((status, index) => {
                      return (
                        <Input
                          key={index}
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          label={capitalizeString(status)}
                          onChange={(e) => {
                            if (e) {
                              setSelectedStatuses([...selectedStatuses, status]);
                            }
                            if (!e) {
                              setSelectedStatuses(
                                selectedStatuses.filter(
                                  (selectedStatus) => selectedStatus !== status
                                )
                              );
                            }
                          }}
                        />
                      );
                    })}
                    <ul className="flex items-center gap-2 justify-between">
                      <Button
                        className="text-[12px] font-normal p-2 py-1"
                        variant={'link'}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedStatuses([]);
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        className="text-[12px] font-light p-2 py-1"
                        variant={'outline'}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectAmendmentStatuses &&
                            onSelectAmendmentStatuses(selectedStatuses);
                        }}
                      >
                        Apply
                      </Button>
                    </ul>
                  </menu>
                </CustomPopover>
                <Link
                  to="#"
                  className="text-primary text-[13px] underline self-start px-1"
                  onClick={(e) => {
                    e.preventDefault();
                    field.onChange({ target: { value: '' } });
                  }}
                >
                  Clear
                </Link>
              </label>
            );
          }}
        />
      </menu>
      <Button
        variant={'outline'}
        className="flex items-center gap-2 font-normal self-center align-baseline"
        onClick={(e) => {
          e.preventDefault();
          reset();
        }}
      >
        Reset all
      </Button>
    </nav>
  );
};

export default UserBusinessAmendmentsFilter;
