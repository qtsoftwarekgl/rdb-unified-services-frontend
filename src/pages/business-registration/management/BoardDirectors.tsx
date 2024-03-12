import { FC, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import Loader from '../../../components/Loader';
import Input from '../../../components/inputs/Input';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { userData } from '../../../constants/Authentication';
import { countriesList } from '../../../constants/Countries';
import moment from 'moment';
import validateInputs from '../../../helpers/Validations';

interface BoardDirectorsProps {
  isOpen: boolean;
}

const BoardDirectors: FC<BoardDirectorsProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const [documentType, setDocumentType] = useState<string>('nid');
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: '',
  });

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

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
              return (
                <label className="flex flex-col gap-1 w-[49%]">
                  <Select
                    label="Select position"
                    required
                    options={[
                      {
                        value: 'chairman',
                        label: 'Chairman',
                      },
                      {
                        value: 'member',
                        label: 'Member',
                      },
                    ]}
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
          <ul className="w-full flex items-center gap-6">
            <Controller
              name="document_type"
              rules={{ required: 'Select document type' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full items-start">
                    <Select
                      options={[
                        { value: 'nid', label: 'National ID' },
                        { label: 'Passport', value: 'passport' },
                      ]}
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
            {documentType === 'nid' && (
              <Controller
                control={control}
                name="document_no"
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-2 items-start w-full">
                      <Input
                        required
                        suffixIcon={faSearch}
                        suffixIconHandler={(e) => {
                          e.preventDefault();
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
                                loading: false,
                                error: false,
                              });
                            }
                          }, 700);
                        }}
                        label="ID Document No"
                        suffixIconPrimary
                        placeholder="1 XXXX X XXXXXXX X XX"
                        onChange={(e) => {
                          setSearchMember({
                            data: e?.target?.value,
                            loading: false,
                            error: false,
                          });
                          field.onChange(e);
                        }}
                      />
                      {searchMember?.loading && !searchMember?.error && (
                        <span className="flex items-center gap-[2px] text-[13px]">
                          <Loader size={4} /> Validating document
                        </span>
                      )}
                      {searchMember?.error && !searchMember?.loading && (
                        <span className="text-red-600 text-[13px]">
                          Invalid document number
                        </span>
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
            watch('document_type') ? 'flex' : 'hidden'
          } flex-wrap gap-4 justify-between w-full`}
        >
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
                  <Input
                    required
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <span className="text-red-500 text-sm">
                      {String(errors?.firstName?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
                  <Input
                    placeholder="Middle name"
                    label="Middle name"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
                  <Input placeholder="Last name" label="Last name" {...field} />
                </label>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
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
          {watch('document_type') !== 'nid' && (
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
            </menu>
          )}
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone number is required',
              validate: (value) => {
                if (watch('document_type') !== 'nid') return true;
                return (
                  validateInputs(
                    value?.length < 10 ? `0${value}` : String(value),
                    'tel'
                  ) || 'Invalid phone number'
                );
              },
            }}
            render={({ field }) => {
              if (watch('document_type') === 'passport') {
                return (
                  <label className="flex flex-col gap-1 w-[47%]">
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
              }
              return (
                <label className="flex flex-col gap-1 w-[49%]">
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
        </section>
      </form>
    </section>
  );
};

export default BoardDirectors;
