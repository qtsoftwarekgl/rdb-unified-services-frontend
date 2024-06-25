import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../../components/inputs/Select';
import {
  attachmentFileColumns,
  personnelTypes,
} from '../../../../constants/businessRegistration';
import Input from '../../../../components/inputs/Input';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { previewUrl, userData } from '../../../../constants/authentication';
import Loader from '../../../../components/Loader';
import validateInputs from '../../../../helpers/validations';
import { countriesList } from '../../../../constants/countries';
import Button from '../../../../components/inputs/Button';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import { maskPhoneDigits } from '../../../../helpers/strings';
import { setUserApplications } from '../../../../states/features/userApplicationSlice';
import moment from 'moment';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import ViewDocument from '../../../user-company-details/ViewDocument';
import { businessId } from '@/types/models/business';
import Table from '@/components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { useCreateShareholderMutation } from '@/states/api/businessRegApiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import FoundersDetails from './FoundersDetails';

interface ShareHoldersProps {
  businessId: businessId;
  status: string;
}

const ShareHolders: FC<ShareHoldersProps> = ({ businessId, status }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    setValue,
    trigger,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  // INITIALIZE CREATE SHAREHOLDER MUTATION
  const [createShareholder, {
    isLoading: createShareholderIsLoading,
    error: createShareholderError,
    isSuccess: createShareholderIsSuccess,
    isError: createShareholderIsError,
  }] = useCreateShareholderMutation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>('');
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createShareholder({
      ...data,
      businessId,
      nationality: data?.persDocIssuePlace,
      isBasedInRwanda: data?.isBasedInRwanda === 'yes',
      countryOfIncorporation: data?.isBasedInRwanda
        ? 'RW'
        : data?.countryOfIncorporation,
    });
  };

  // HANDLE CREATE SHAREHOLDER RESPONSE
  useEffect(() => {
    if (createShareholderIsError) {
      if ((createShareholderError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((createShareholderError as ErrorResponse)?.data?.message);
      }
    } else if (createShareholderIsSuccess) {
      toast.success('Shareholder added successfully');
      reset({
        shareHolderType: '',
      });
      setAttachmentFile(null);
      window.location.reload();
    }
  }, [
    businessId,
    createShareholderError,
    createShareholderIsError,
    createShareholderIsSuccess,
    dispatch,
    reset,
  ]);

  // ATTACHMENT COLUMNS
  const attachmentColumns = [
    ...attachmentFileColumns,
    {
      header: 'action',
      accesorKey: 'action',
      cell: () => {
        return (
          <menu className="flex items-center gap-4">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[20px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
                setAttachmentPreview(previewUrl);
              }}
            />
            <FontAwesomeIcon
              className="cursor-pointer text-white bg-red-600 p-2 w-[13px] h-[13px] text-[16px] rounded-full font-bold ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-4" disabled={disableForm}>
          <Controller
            name="shareHolderType"
            control={control}
            defaultValue={watch('shareHolderType')}
            rules={{ required: 'Select shareholder type' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-[49%]">
                  <Select
                    label="Shareholder type"
                    placeholder="Select shareholder type"
                    options={personnelTypes}
                    {...field}
                    required
                    onChange={(e) => {
                      field.onChange(e);
                      setAttachmentFile(null);
                      reset({
                        shareHolderType: e,
                      });
                    }}
                  />
                  {errors?.shareHolderType && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.shareHolderType?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <ul className={`w-full flex items-start gap-6`}>
            {watch('shareHolderType') === 'person' && (
              <Controller
                name="personIdentType"
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
                        watch('personIdentType') !== 'nid' && '!w-[49%]'
                      }`}
                    >
                      <Select
                        options={options}
                        label="Document Type"
                        required
                        placeholder="Select document type"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.personIdentType && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.personIdentType?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch('personIdentType') === 'nid' &&
              watch('shareHolderType') === 'person' && (
                <Controller
                  control={control}
                  name="personDocNo"
                  rules={{
                    required: watch('personIdentType')
                      ? 'Document number is required'
                      : false,
                    validate: (value) => {
                      return (
                        validateInputs(value, 'nid') ||
                        'National ID must be 16 characters long'
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-2">
                        <Input
                          required
                          suffixIcon={faSearch}
                          suffixIconHandler={async (e) => {
                            e.preventDefault();
                            if (!field.value) {
                              setError('personDocNo', {
                                type: 'manual',
                                message: 'Document number is required',
                              });
                              return;
                            }
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          onChange={async (e) => {
                            field.onChange(e);
                            clearErrors('personDocNo');
                            await trigger('personDocNo');
                          }}
                        />
                        {errors?.personDocNo && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.personDocNo?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
          </ul>
          <menu
            className={`${
              watch('shareHolderType') && watch('shareHolderType') !== 'person'
                ? 'flex'
                : 'hidden'
            } flex flex-col gap-2 w-full`}
          >
            <Controller
              name="isBasedInRwanda"
              defaultValue={'yes'}
              rules={{ required: 'Select if business is based in Rwanda' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-2 items-start w-full">
                    <p className="text-[15px]">
                      Is the business based in Rwanda?
                    </p>
                    <menu className="flex items-center gap-4">
                      <Input
                        type="radio"
                        label="Yes"
                        {...field}
                        defaultChecked
                        value="yes"
                      />
                      <Input type="radio" label="No" {...field} value="no" />
                    </menu>
                    {errors?.isBasedInRwanda && (
                      <span className="text-red-500 text-[13px]">
                        {String(errors?.isBasedInRwanda?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          {(watch('shareHolderType') === 'person' &&
            watch('personIdentType') === 'nid') ||
            (watch('personIdentType') === 'passport' && (
              <section
                className={`grid grid-cols-2 gap-4 items-start justify-between w-full`}
              >
                {watch('personIdentType') === 'passport' && (
                  <>
                    <Controller
                      name="persDocNo"
                      control={control}
                      rules={{
                        required: 'Passport number is required',
                      }}
                      render={({ field }) => {
                        return (
                          <label
                            className={`w-full flex flex-col gap-1 items-start`}
                          >
                            <Input
                              required
                              placeholder="Passport number"
                              label="Passport number"
                              {...field}
                            />
                            {errors?.persDocNo && (
                              <span className="text-sm text-red-500">
                                {String(errors?.persDocNo?.message)}
                              </span>
                            )}
                          </label>
                        );
                      }}
                    />
                    <Controller
                      name="persDocIssueDate"
                      rules={{
                        required: 'Issue date is required',
                        validate: (value) => {
                          if (
                            moment(value).format() >
                            moment(watch('persDocExpiryDate')).format()
                          ) {
                            return 'Issue date must be before expiry date';
                          }
                          return true;
                        },
                      }}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col gap-1 w-full">
                            <Input
                              {...field}
                              label="Passport Issue Date"
                              type="date"
                              onChange={(e) => {
                                field.onChange(
                                  moment(String(e)).format('YYYY-MM-DD')
                                );
                                trigger('persDocIssueDate');
                                trigger('persDocExpiryDate');
                              }}
                            />
                            {errors?.persDocIssueDate && (
                              <p className="text-[13px] text-red-600">
                                {String(errors.persDocIssueDate.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                    <Controller
                      name="persDocExpiryDate"
                      rules={{
                        required: 'Expiry date is required',
                        validate: (value) => {
                          if (
                            moment(value).format() <
                            moment(watch('persDocIssueDate')).format()
                          ) {
                            return 'Expiry date must be after issue date';
                          }
                          return true;
                        },
                      }}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col gap-1 w-full">
                            <Input
                              {...field}
                              label="Passport Expiry Date"
                              type="date"
                              onChange={(e) => {
                                field.onChange(
                                  moment(String(e)).format('YYYY-MM-DD')
                                );
                                trigger('persDocExpiryDate');
                                trigger('persDocIssueDate');
                              }}
                            />
                            {errors?.persDocExpiryDate && (
                              <p className="text-[13px] text-red-600">
                                {String(errors.persDocExpiryDate.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                    <Controller
                      name="dateOfBirth"
                      rules={{ required: 'Date of birth is required' }}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col gap-1 w-full">
                            <Input
                              {...field}
                              type="date"
                              label="Date of birth"
                              placeholder="Select DOB"
                              onChange={(e) => {
                                field.onChange(
                                  moment(String(e)).format('YYYY-MM-DD')
                                );
                              }}
                            />
                            {errors?.dateOfBirth && (
                              <p className="text-[13px] text-red-600">
                                {String(errors.dateOfBirth.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                  </>
                )}
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1 items-start">
                        <Input
                          required
                          readOnly={watch('personIdentType') === 'nid'}
                          placeholder="First name"
                          label="First name"
                          {...field}
                        />
                        {errors?.firstName && (
                          <span className="text-sm text-red-500">
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
                      <label className="w-full flex flex-col gap-1 items-start">
                        <Input
                          readOnly={watch('personIdentType') === 'nid'}
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
                      <label className="w-full flex flex-col gap-1 items-start">
                        <Input
                          readOnly={watch('personIdentType') === 'nid'}
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
                  rules={{
                    required:
                      watch('personIdentType') === 'passport'
                        ? 'Select gender'
                        : false,
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-2 items-start w-full">
                        <p className="flex items-center gap-1 text-[15px]">
                          Gender<span className="text-red-500">*</span>
                        </p>
                        <menu className="flex items-center gap-4 mt-2">
                          <Input
                            type="radio"
                            label="Male"
                            {...field}
                            value={'Male'}
                          />
                          <Input
                            type="radio"
                            label="Female"
                            {...field}
                            value={'Female'}
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
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        {watch('personIdentType') === 'passport' ? (
                          <Input
                            label="Phone number"
                            required
                            type="tel"
                            {...field}
                          />
                        ) : (
                          <Select
                            label="Phone number"
                            required
                            placeholder="Select phone number"
                            options={userData?.slice(0, 3)?.map((user) => {
                              return {
                                ...user,
                                label: `(+250) ${maskPhoneDigits(user?.phone)}`,
                                value: user?.phone,
                              };
                            })}
                            {...field}
                          />
                        )}
                        {errors?.phoneNumber && (
                          <p className="text-sm text-red-500">
                            {String(errors?.phoneNumber?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="email"
                  rules={{
                    required: 'Email address is required',
                    validate: (value) => {
                      return validateInputs(value, 'email');
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-full">
                        <Input
                          {...field}
                          placeholder="Enter email address"
                          label="Email"
                          required
                        />
                        {errors?.email && (
                          <p className="text-[13px] text-red-600">
                            {String(errors.email.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                {watch('personIdentType') !== 'nid' ? (
                  <>
                    <Controller
                      name="persDocIssuePlace"
                      control={control}
                      rules={{ required: 'Country is required' }}
                      render={({ field }) => {
                        return (
                          <label className="w-full flex flex-col gap-1 items-start">
                            <Select
                              label="Country"
                              placeholder="Select country"
                              options={countriesList
                                ?.filter((country) => country?.code !== 'RW')
                                ?.map((country) => {
                                  return {
                                    ...country,
                                    label: country.name,
                                    value: country?.name,
                                  };
                                })}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                            {errors?.persDocIssuePlace && (
                              <p className="text-sm text-red-500">
                                {String(errors?.persDocIssuePlace?.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                  </>
                ) : (
                  <Controller
                    control={control}
                    name="poBox"
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            label="PO Box"
                            placeholder="PO Box"
                            {...field}
                          />
                        </label>
                      );
                    }}
                  />
                )}
              </section>
            ))}
          <menu
            className={`${
              watch('shareHolderType') === 'person' &&
              watch('personIdentType') === 'passport'
                ? 'flex'
                : 'hidden'
            } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
          >
            <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
              Passport <span className="text-red-600">*</span>
            </h3>
            <Controller
              name="attachment"
              rules={{
                required:
                  watch('personIdentType') === 'passport'
                    ? 'Passport is required'
                    : false,
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full items-start gap-2 max-sm:!w-full">
                    <Input
                      type="file"
                      accept="application/pdf,image/*"
                      className="!w-fit max-sm:!w-full self-start"
                      onChange={(e) => {
                        field.onChange(e?.target?.files?.[0]);
                        e?.target?.files?.[0] &&
                          setAttachmentFile(e?.target?.files?.[0]);
                        clearErrors('attachment');
                        setValue('attachment', e?.target?.files?.[0]);
                      }}
                    />
                    <ul className="flex flex-col items-center w-full gap-3">
                      {attachmentFile && (
                        <Table
                          columns={attachmentColumns}
                          data={[attachmentFile]}
                          showPagination={false}
                          showFilter={false}
                        />
                      )}
                    </ul>
                    {errors?.attachment && (
                      <p className="text-sm text-red-500">
                        {String(errors?.attachment?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <section
            className={`${
              watch('shareHolderType') && watch('shareHolderType') !== 'person'
                ? 'grid'
                : 'hidden'
            } grid-cols-2 gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="companyName"
              control={control}
              rules={{
                required:
                  watch('shareHolderType') !== 'person'
                    ? 'Company name is required'
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1 items-start">
                    <Input
                      label="Company Name"
                      placeholder="Company name"
                      required
                      {...field}
                    />
                    {errors?.companyName && (
                      <p className="text-sm text-red-500">
                        {String(errors?.companyName?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="companyCode"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1 items-start">
                    <Input
                      label="Company code"
                      placeholder="Company code"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            {watch('isBasedInRwanda') === 'no' && (
              <Controller
                name="countryOfIncorporation"
                control={control}
                rules={{
                  required:
                    watch('shareHolderType') !== 'person'
                      ? 'Select country of incorporation'
                      : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1 items-start">
                      <Select
                        required
                        label="Country of Incorporation"
                        placeholder="Select country of incorporation"
                        options={countriesList
                          ?.filter((country) => country?.code !== 'RW')
                          ?.map((country) => {
                            return {
                              ...country,
                              label: country.name,
                              value: country.code,
                            };
                          })}
                        {...field}
                      />
                      {errors?.countryOfIncorporation && (
                        <p className="text-sm text-red-500">
                          {String(errors?.countryOfIncorporation?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            <Controller
              name="incorporationDate"
              control={control}
              rules={{
                required:
                  watch('shareHolderType') !== 'person'
                    ? 'Registration date is required'
                    : false,
                validate: (value) => {
                  if (value) {
                    return (
                      moment(value).format() < moment().format() ||
                      'Invalid date selected'
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1 items-start">
                    <Input
                      label="Incorporation Date"
                      required
                      defaultValue={watch('incorporationDate')}
                      readOnly={watch('rwandan_company') === 'yes'}
                      type="date"
                      {...field}
                    />
                    {errors?.incorporationDate && (
                      <p className="text-sm text-red-500">
                        {String(errors?.incorporationDate?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required:
                  watch('shareHolderType') !== 'person' &&
                  'Email address is required',
                validate: (value) => {
                  if (watch('shareHolderType') !== 'person') {
                    return (
                      validateInputs(String(value), 'email') ||
                      'Invalid email address'
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1 items-start">
                    <Input
                      required
                      label="Email"
                      placeholder="name@domain.com"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {String(errors?.email?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="company_phone"
              control={control}
              rules={{
                required:
                  watch('shareHolderType') !== 'person'
                    ? 'Company phone number is required'
                    : false,
                validate: (value) => {
                  if (watch('rwandan_company') === 'yes') {
                    return (
                      validateInputs(value, 'tel') || 'Invalid phone number'
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      label="Phone number"
                      required
                      prefixText={watch('rwandan_company') === 'yes' && '+250'}
                      type={watch('rwandan_company') === 'yes' ? 'text' : 'tel'}
                      {...field}
                    />
                    {errors?.company_phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.company_phone?.message)}
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
            <Controller
              control={control}
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      label="PO Box"
                      placeholder="Postal code"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </section>
          <FoundersDetails businessId={businessId} />
          <article
            className={`${
              watch('shareHolderType') ? 'flex' : 'hidden'
            } w-full items-center justify-end`}
          >
            <Button
              submit
              value={
                createShareholderIsLoading ? <Loader /> : 'Add shareholder'
              }
              primary
            />
          </article>
          {[
            'IN_PROGRESS',
            'IS_AMENDING',
            'IN_PREVIEW',
            'ACTION_REQUIRED',
          ].includes(status) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('share_details'));
                  dispatch(setBusinessActiveTab('capital_information'));
                }}
              />
              {status === 'IS_AMENDING' && (
                <Button
                  value={'Complete Amendment'}
                  onClick={(e) => {
                    e.preventDefault();

                    // SET ACTIVE TAB AND STEP
                    const active_tab = 'preview_submission';
                    const active_step = 'preview_submission';

                    dispatch(setBusinessCompletedStep('shareholders'));
                    dispatch(setBusinessActiveStep(active_step));
                    dispatch(setBusinessActiveTab(active_tab));
                    dispatch(
                      setUserApplications({
                        businessId,
                        active_tab,
                        active_step,
                      })
                    );
                  }}
                />
              )}
              {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) && (
                <Button
                  value="Save & Complete Review"
                  primary
                  disabled={disableForm}
                  onClick={(e) => {
                    e.preventDefault();

                    // SET ACTIVE TAB AND STEP
                    const active_tab = 'preview_submission';
                    const active_step = 'preview_submission';

                    dispatch(setBusinessCompletedStep('shareholders'));
                    dispatch(setBusinessActiveStep(active_step));
                    dispatch(setBusinessActiveTab(active_tab));
                    dispatch(
                      setUserApplications({
                        businessId,
                        active_tab,
                        active_step,
                      })
                    );
                  }}
                />
              )}
              <Button
                value="Save & Continue"
                primary
                disabled={disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessCompletedStep('shareholders'));
                  dispatch(setBusinessActiveStep('capital_details'));
                  dispatch(setBusinessActiveTab('capital_information'));
                }}
              />
            </menu>
          )}
          {[
            'IN_REVIEW',
            'IS_APPROVED',
            'PENDING_APPROVAL',
            'PENDING_REJECTION',
          ].includes(status) && (
            <menu className="flex items-center gap-3 justify-between">
              <Button
                value="Back"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('share_details'));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('capital_details'));
                }}
              />
            </menu>
          )}
        </fieldset>
      </form>
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
    </section>
  );
};

export default ShareHolders;
