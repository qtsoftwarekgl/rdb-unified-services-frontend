import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import Loader from '../../../components/Loader';
import Input from '../../../components/inputs/Input';
import { faSearch, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { userData } from '../../../constants/Authentication';
import { countriesList } from '../../../constants/Countries';
import validateInputs from '../../../helpers/Validations';
import Button from '../../../components/inputs/Button';
import {
  setSeniorManagement,
  setBusinessActiveStep,
  setBusinessCompletedStep,
} from '../../../states/features/businessRegistrationSlice';
import { AppDispatch, RootState } from '../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { capitalizeString } from '../../../helpers/Strings';

interface SeniorManagementProps {
  isOpen: boolean;
}

const SeniorManagement: FC<SeniorManagementProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    trigger,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { senior_management } = useSelector(
    (state: RootState) => state.businessRegistration
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    if (watch('document_type') === 'passport') {
      setValue('country', '');
      setValue('phone', '');
      setValue('street_name', '');
      setValue('first_name', '');
      setValue('middle_name', '');
      setValue('last_name', '');
    }
  }, [setValue, watch('document_type')]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      clearErrors('submit');
      dispatch(setSeniorManagement([data, ...senior_management]));
      reset(undefined, { keepDirtyValues: true });
      setValue('attachment', null);
    }, 1000);
    return data;
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setSeniorManagement(
                    senior_management?.filter(
                      (member: unknown) =>
                        member?.first_name !== row?.original?.first_name
                    )
                  )
                );
              }}
            />
          </menu>
        );
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5"
      >
        <menu className="w-full flex flex-col gap-4">
          <h3 className="font-medium text-md uppercase">Add members</h3>
          <Controller
            name="position"
            rules={{ required: "Select member's position" }}
            control={control}
            render={({ field }) => {
              const options = [
                {
                  value: 'md/gm',
                  label: 'MD / GM',
                },
                {
                  value: 'secretary',
                  label: 'Secretary',
                },
                {
                  value: 'accountant',
                  label: 'Accountant',
                },
                {
                  value: 'auditor',
                  label: 'Auditor',
                },
              ];
              return (
                <label className="flex flex-col gap-1 w-[49%]">
                  <Select
                    label="Select position"
                    required
                    options={options}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.position && (
                    <p className="text-red-500 text-[13px]">
                      {String(errors?.position?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <ul className="w-full flex items-start gap-6">
            <Controller
              name="document_type"
              rules={{ required: 'Select document type' }}
              control={control}
              render={({ field }) => {
                const options = [
                  { value: 'nid', label: 'National ID' },
                  { label: 'Passport', value: 'passport' },
                ];
                return (
                  <label
                    className={`flex flex-col gap-1 w-full items-start ${
                      watch('document_type') !== 'nid' && '!w-[49%]'
                    }`}
                  >
                    <Select
                      options={options}
                      label="Document Type"
                      required
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                  </label>
                );
              }}
            />
            {watch('document_type') === 'nid' && (
              <Controller
                control={control}
                name="document_no"
                rules={{
                  required: watch('document_type')
                    ? 'Document number is required'
                    : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-2 items-start w-full">
                      <Input
                        required
                        suffixIcon={faSearch}
                        suffixIconHandler={async (e) => {
                          e.preventDefault();
                          if (!field.value) {
                            setError('document_no', {
                              type: 'manual',
                              message: 'Document number is required',
                            });
                            return;
                          }
                          setSearchMember({
                            ...searchMember,
                            loading: true,
                            error: false,
                          });
                          setTimeout(() => {
                            const randomNumber = Math.floor(Math.random() * 16);
                            const userDetails = userData[randomNumber];

                            if (!userDetails) {
                              setSearchMember({
                                ...searchMember,
                                data: null,
                                loading: false,
                                error: true,
                              });
                            }

                            if (userDetails) {
                              setSearchMember({
                                ...searchMember,
                                data: userDetails,
                                loading: false,
                                error: false,
                              });
                              setValue('first_name', userDetails?.first_name);
                              setValue('middle_name', userDetails?.middle_name);
                              setValue('last_name', userDetails?.last_name);
                              setValue('gender', userDetails?.data?.gender);
                              setValue('phone', userDetails?.data?.phone);
                            }
                          }, 700);
                        }}
                        label="ID Document No"
                        suffixIconPrimary
                        placeholder="1 XXXX X XXXXXXX X XX"
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger('document_no');
                        }}
                      />
                      {searchMember?.loading &&
                        !errors?.document_no &&
                        !searchMember?.error && (
                          <span className="flex items-center gap-[2px] text-[13px]">
                            <Loader size={4} /> Validating document
                          </span>
                        )}
                      {searchMember?.error && !searchMember?.loading && (
                        <span className="text-red-600 text-[13px]">
                          Invalid document number
                        </span>
                      )}
                      {errors?.document_no && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.document_no?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
          </ul>
        </menu>
        <section
          className={`${
            (watch('document_type') === 'nid' && searchMember?.data) ||
            watch('document_type') === 'passport'
              ? 'flex'
              : 'hidden'
          } flex-wrap gap-4 items-start justify-between w-full`}
        >
          <Controller
            name="first_name"
            control={control}
            defaultValue={searchMember?.data?.first_name}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
                  <Input
                    required
                    defaultValue={searchMember?.data?.first_name}
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.first_name && (
                    <span className="text-red-500 text-sm">
                      {String(errors?.first_name?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="middle_name"
            control={control}
            defaultValue={searchMember?.data?.middle_name}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
                  <Input
                    defaultValue={searchMember?.data?.middle_name}
                    placeholder="Middle name"
                    label="Middle name"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="last_name"
            control={control}
            defaultValue={searchMember?.data?.last_name}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
                  <Input
                    defaultValue={searchMember?.last_name}
                    placeholder="Last name"
                    label="Last name"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
            defaultValue={searchMember?.data?.gender}
            rules={{ required: 'Select gender' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-2 items-start w-[49%]">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<span className="text-red-500">*</span>
                  </p>
                  <menu className="flex items-center gap-4 mt-2">
                    <Input type="radio" label="Male" {...field} />
                    <Input type="radio" label="Female" {...field} />
                  </menu>
                  {errors?.gender && (
                    <span className="text-red-500 text-[13px]">
                      {String(errors?.gender?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          {watch('document_type') !== 'nid' ? (
            <menu className="w-full flex items-start gap-6 max-sm:flex-col max-sm:gap-3">
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Nationality is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1 items-start">
                      <Select
                        isSearchable
                        label="Country"
                        options={countriesList?.map((country) => {
                          return {
                            ...country,
                            label: country.name,
                            value: country?.code,
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e?.value);
                        }}
                      />
                      {errors?.country && (
                        <p className="text-red-500 text-sm">
                          {String(errors?.country?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="phone"
                control={control}
                defaultValue={searchMember?.data?.phone}
                rules={{
                  required: 'Phone number is required',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-full">
                      <p className="flex items-center gap-1">
                        Phone number <span className="text-red-600">*</span>
                      </p>
                      <menu className="flex items-center gap-0 relative">
                        <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                          <select
                            className="w-full !text-[12px]"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          >
                            {countriesList?.map((country) => {
                              return (
                                <option
                                  key={country?.dial_code}
                                  value={country?.dial_code}
                                >
                                  {`${country?.code} ${country?.dial_code}`}
                                </option>
                              );
                            })}
                          </select>
                        </span>
                        <input
                          onChange={field.onChange}
                          className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                          type="text"
                        />
                      </menu>
                      {errors?.phone && (
                        <p className="text-red-500 text-sm">
                          {String(errors?.phone?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </menu>
          ) : (
            <menu className="w-full flex items-center gap-6">
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  validate: (value) => {
                    return (
                      validateInputs(value, 'tel') || 'Invalid phone number'
                    );
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-full">
                      <Input
                        label="Phone number"
                        placeholder="07XX XXX XXX"
                        required
                        {...field}
                      />
                      {errors?.phone && (
                        <p className="text-red-500 text-sm">
                          {String(errors?.phone?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                name="street_name"
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Input
                        label="Street Name"
                        placeholder="Street name"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            </menu>
          )}
          <menu
            className={`${
              watch('document_type') === 'passport' ? 'flex' : 'hidden'
            } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
          >
            <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
              Attachment <span className="text-red-600">*</span>
            </h3>
            <Controller
              name="attachment"
              rules={{
                required:
                  watch('document_type') === 'passport'
                    ? 'Document attachment is required'
                    : false,
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                    <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                      <Input
                        type="file"
                        accept="application/pdf,image/*"
                        className="!w-fit max-sm:!w-full"
                        onChange={(e) => {
                          field.onChange(e?.target?.files?.[0]);
                          setAttachmentFile(e?.target?.files?.[0]);
                          setValue('attachment', e?.target?.files?.[0]?.name);
                        }}
                      />
                      {attachmentFile && (
                        <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                          {attachmentFile?.name}
                          <FontAwesomeIcon
                            icon={faX}
                            className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentFile(null);
                              setValue('attachment', null);
                            }}
                          />
                        </p>
                      )}
                    </ul>
                    {errors?.attachment && (
                      <p className="text-red-500 text-sm">
                        {String(errors?.attachment?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
        </section>
        <section className="w-full flex items-center justify-end">
          <Button
            value={isLoading ? <Loader /> : 'Add position'}
            submit
            primary
          />
        </section>
        <section className={`flex members-table flex-col w-full`}>
          <Table
            data={senior_management?.map((member, index) => {
              return {
                ...member,
                no: index + 1,
                name: `${member?.first_name} ${member?.middle_name} ${member?.last_name}`,
                position:
                  member?.position && capitalizeString(member?.position),
              };
            })}
            columns={columns}
            showFilter={false}
            showPagination={false}
            tableTitle="Management members"
          />
          {errors?.submit && (
            <p className="text-red-500 text-[15px] text-center">
              {String(errors?.submit?.message)}
            </p>
          )}
        </section>
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setBusinessActiveStep('board_of_directors'));
            }}
          />
          <Button
            value="Continue"
            primary
            onClick={(e) => {
              e.preventDefault();
              if (!senior_management?.length) {
                setError('submit', {
                  type: 'manual',
                  message: 'Add at least one member',
                });
                setTimeout(() => {
                  clearErrors('submit');
                }, 5000);
                return;
              }
              dispatch(setBusinessCompletedStep('senior_management'));
              dispatch(setBusinessActiveStep('employment_info'));
            }}
          />
        </menu>
      </form>
    </section>
  );
};

export default SeniorManagement;
