import { FC, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import { personnelTypes } from '../../../constants/businessRegistration';
import Input from '../../../components/inputs/Input';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import { userData } from '../../../constants/authentication';
import Loader from '../../../components/Loader';
import validateInputs from '../../../helpers/Validations';
import { countriesList } from '../../../constants/countries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/inputs/Button';

interface BeneficialOwnersProps {
  isOpen: boolean;
}

const BeneficialOwners: FC<BeneficialOwnersProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  if (!isOpen) return null;

  return (
    <section className="w-full flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <menu className="flex flex-col gap-3">
          <h3 className="text-lg uppercase font-medium">
            Add beneficial owner
          </h3>
          <Controller
            name="beneficial_type"
            rules={{ required: 'Select beneficial owner type' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Select
                    label="Beneficial owner type"
                    required
                    options={personnelTypes}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.beneficial_type && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.beneficial_type?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <ul className={`w-full flex items-start gap-6`}>
          {watch('beneficial_type') === 'person' && (
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
          )}
          {watch('beneficial_type') &&
            watch('beneficial_type') !== 'person' && (
              <Controller
                name="company_code"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-[49%]">
                      <Input
                        label="Company/Entreprise Code"
                        placeholder="Company code"
                        suffixIcon={faSearch}
                        suffixIconPrimary
                        suffixIconHandler={async (e) => {
                          e.preventDefault();
                          if (!field.value) {
                            setError('company_code', {
                              type: 'manual',
                              message: 'Company code is required to search',
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
                              clearErrors();
                              setSearchMember({
                                ...searchMember,
                                data: userDetails,
                                loading: false,
                                error: false,
                              });
                              setValue('email', userDetails?.email);
                              setValue('gender', userDetails?.data?.gender);
                              setValue('phone', userDetails?.data?.phone);
                            }
                          }, 700);
                        }}
                        {...field}
                      />
                      {searchMember?.loading && !errors?.company_code && (
                        <p className="flex items-center gap-[2px] text-[13px]">
                          <Loader size={4} /> Validating company code
                        </p>
                      )}
                      {searchMember?.error && !searchMember?.loading && (
                        <p className="text-red-600 text-[13px]">
                          Invalid company code
                        </p>
                      )}
                      {errors?.company_code && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.company_code?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
          {watch('document_type') === 'nid' &&
            watch('beneficial_type') === 'person' && (
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
                              clearErrors();
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
        <section
          className={`${
            (watch('document_type') === 'nid' && searchMember?.data) ||
            watch('document_type') === 'passport'
              ? 'flex'
              : 'hidden'
          } ${
            watch('beneficial_type') !== 'person' && 'hidden'
          } flex-wrap gap-4 items-start justify-between w-full`}
        >
          <Controller
            name="first_name"
            control={control}
            defaultValue={searchMember?.data?.first_name}
            rules={{
              required:
                watch('beneficial_type') === 'person' &&
                'First name is required',
            }}
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
            rules={{
              required:
                watch('beneficial_type') === 'person' && 'Select gender',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-2 items-start w-[49%]">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<span className="text-red-500">*</span>
                  </p>
                  <menu className="flex items-center gap-4 mt-2">
                    <Input
                      type="radio"
                      label="Male"
                      checked={searchMember?.data?.gender === 'Male'}
                      {...field}
                    />
                    <Input
                      type="radio"
                      label="Female"
                      checked={searchMember?.data?.gender === 'Female'}
                      {...field}
                    />
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
          <Controller
            name="country"
            control={control}
            rules={{
              required:
                watch('beneficial_type') === 'person' &&
                watch('document_type') === 'passport' &&
                'Nationality is required',
            }}
            render={({ field }) => {
              if (watch('document_type') === 'nid') return undefined;
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
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
            control={control}
            name="street_name"
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    label="Street Name"
                    placeholder="Street name"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="phone"
            control={control}
            defaultValue={searchMember?.data?.phone}
            rules={{
              required:
                watch('beneficial_type') === 'person' &&
                'Phone number is required',
              validate: (value) => {
                if (
                  watch('beneficial_type') === 'person' &&
                  watch('document_type') === 'nid'
                ) {
                  return validateInputs(value, 'tel') || 'Invalid phone number';
                } else {
                  return true;
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-[49%]">
                  <Input
                    label="Phone number"
                    placeholder="07XX XXX XXX"
                    required
                    type={
                      watch('document_type') === 'passport' ? 'tel' : 'text'
                    }
                    defaultValue={searchMember?.data?.phone}
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
                  watch('document_type') === 'passport' &&
                  watch('beneficial_type') === 'person'
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
        {watch('beneficial_type') === 'person' &&
          (watch('document_type') === 'passport' ||
            (watch('document_type') === 'nid' && !!searchMember?.data)) && (
            <article className="flex flex-col gap-3">
              <h1>
                Is the professional address same as the residential address?
              </h1>
              <Controller
                name="address"
                control={control}
                render={({ field }) => {
                  return (
                    <ul className="flex items-center gap-6">
                      <Input
                        type="radio"
                        label="Yes"
                        name={field?.name}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange(e.target.value);
                            setValue('address', 'yes');
                          }
                        }}
                      />
                      <Input
                        type="radio"
                        label="No"
                        name={field?.name}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange(e.target.value);
                            setValue('address', 'no');
                          }
                        }}
                      />
                    </ul>
                  );
                }}
              />
            </article>
          )}
        <section
          className={`${
            watch('address') === 'yes' ? 'flex' : 'hidden'
          } flex-wrap gap-4 items-start justify-between w-full`}
        >
          <Controller
            name="residential_country"
            control={control}
            rules={{
              required:
                watch('address') === 'yes' &&
                watch('beneficial_type') === 'person' &&
                watch('document_type') === 'passport' &&
                'Nationality is required',
            }}
            render={({ field }) => {
              if (watch('document_type') === 'nid') return undefined;
              return (
                <label className="w-[49%] flex flex-col gap-1 items-start">
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
                  {errors?.residential_country && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.residential_country?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />

          <Controller
            control={control}
            name="residential_street_name"
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    label="Street Name"
                    placeholder="Street name"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="residential_phone"
            control={control}
            defaultValue={searchMember?.data?.phone}
            rules={{
              required:
                watch('address') === 'yes' &&
                watch('beneficial_type') === 'person' &&
                'Phone number is required',
              validate: (value) => {
                if (
                  watch('beneficial_type') === 'person' &&
                  watch('document_type') === 'nid'
                ) {
                  return validateInputs(value, 'tel') || 'Invalid phone number';
                } else {
                  return true;
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-[49%]">
                  <Input
                    label="Phone number"
                    placeholder="07XX XXX XXX"
                    required
                    type={
                      watch('document_type') === 'passport' ? 'tel' : 'text'
                    }
                    defaultValue={searchMember?.data?.phone}
                    {...field}
                  />
                  {errors?.residential_phone && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.residential_phone?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu
            className={`${
              watch('document_type') === 'passport' ? 'flex' : 'hidden'
            } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
          >
            <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
              Attachment <span className="text-red-600">*</span>
            </h3>
            <Controller
              name="residential_attachment"
              rules={{
                required:
                  watch('address') === 'yes' &&
                  watch('document_type') === 'passport' &&
                  watch('beneficial_type') === 'person'
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
                    {errors?.residential_attachment && (
                      <p className="text-red-500 text-sm">
                        {String(errors?.residential_attachment?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
        </section>
        <menu
          className={`${
            watch('beneficial_type') ? 'flex' : 'hidden'
          } flex flex-col gap-4 w-full`}
        >
          <h1 className="text-lg uppercase font-medium">Ownership details</h1>
          <section
            className={`flex flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="beneficial_relationship"
              control={control}
              rules={{
                required: 'Select a relationship with the beneficial owner',
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Select
                      label="Beneficial owner relationship"
                      required
                      options={[]}
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                    {errors?.beneficial_relationship && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.beneficial_relationship?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              rules={{ required: 'Select control type' }}
              name="control_type"
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Select
                      required
                      label="Control type"
                      options={[
                        { value: 'direct', label: 'Direct' },
                        { value: 'indirect', label: 'Indirect' },
                      ]}
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="date_bo"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      type="date"
                      label="Date of becoming B.O"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="ownership_type"
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Select
                      label="Nature and extent of ownership"
                      options={[{ value: 'shares', label: 'Shares' }]}
                      onChange={(e) => {
                        field.onChange(e?.value);
                      }}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="voting_right"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      label="Extent of voting right"
                      placeholder="Voting rights"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </section>
        </menu>
        <menu className="w-full flex items-center justify-end">
          <Button value="Add beneficial owner" primary submit />
        </menu>
      </form>
    </section>
  );
};

export default BeneficialOwners;
