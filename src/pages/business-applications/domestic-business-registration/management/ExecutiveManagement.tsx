import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../../components/inputs/Select';
import Input from '../../../../components/inputs/Input';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { previewUrl, userData } from '../../../../constants/authentication';
import { countriesList } from '../../../../constants/countries';
import Button from '../../../../components/inputs/Button';
import {
  setBusinessActiveStep,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { maskPhoneDigits } from '../../../../helpers/strings';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import validateInputs from '../../../../helpers/validations';
import { attachmentFileColumns } from '../../../../constants/businessRegistration';
import ViewDocument from '../../../user-company-details/ViewDocument';
import OTPVerificationCard from '@/components/cards/OTPVerificationCard';
import moment from 'moment';
import { businessId } from '@/types/models/business';
import { useCreateManagementOrBoardPersonMutation } from '@/states/api/businessRegistrationApiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { addBusinessPerson } from '@/states/features/businessPeopleSlice';
import BusinessPeople from './BusinessPeople';

export interface business_executive_management {
  firstName: string;
  middleName: string;
  lastName: string;
  attachment: File | null;
  position: string;
}

type ExecutiveManagementProps = {
  businessId: businessId;
  status: string;
};

const ExecutiveManagement = ({
  businessId,
  status,
}: ExecutiveManagementProps) => {
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
  const { businessPeopleList } = useSelector(
    (state: RootState) => state.businessPeople
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>('');
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);

  // INITIALIZE CREATE MANAGAMENT PERSON MUTATION
  const [
    createManagementPerson,
    {
      data: managementPersonData,
      error: managementPersonError,
      isLoading: managementPersonIsLoading,
      isSuccess: managementPersonIsSuccess,
      isError: managementPersonIsError,
    },
  ] = useCreateManagementOrBoardPersonMutation();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createManagementPerson({ ...data, businessId });
  };

  // HANDLE CREATE MANAGEMENT PERSON RESPONSE
  useEffect(() => {
    if (managementPersonIsError) {
      if ((managementPersonError as ErrorResponse).status === 500) {
        toast.error('An error occured while adding person. Please try again');
      } else {
        toast.error((managementPersonError as ErrorResponse).data.message);
      }
    } else if (managementPersonIsSuccess) {
      reset({
        position: '',
        personIdentType: '',
      });
      setAttachmentFile(null);
      dispatch(addBusinessPerson(managementPersonData?.data));
    }
  }, [
    dispatch,
    managementPersonData,
    managementPersonError,
    managementPersonIsError,
    managementPersonIsSuccess,
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
    <section className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-5" disabled={disableForm}>
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
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
                      placeholder="Select position"
                      options={options}
                      {...field}
                      onChange={(e) => {
                        reset({
                          position: e,
                        });
                        field.onChange(e);
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
            <ul
              className={`${
                watch('position') ? 'flex' : 'hidden'
              } items-start w-full gap-6`}
            >
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
                        placeholder="Select document type"
                        required
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          reset({
                            position: watch('position'),
                            personIdentType: e,
                          });
                        }}
                      />
                    </label>
                  );
                }}
              />
              {watch('personIdentType') === 'nid' && (
                <Controller
                  control={control}
                  name="document_no"
                  rules={{
                    required: watch('personIdentType')
                      ? 'Document number is required'
                      : false,
                    validate: (value) => {
                      if (watch('personIdentType') !== 'nid') {
                        return true;
                      }
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
                              setError('document_no', {
                                type: 'manual',
                                message: 'Document number is required',
                              });
                              return;
                            }
                            console.log(field.value);
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger('document_no');
                          }}
                        />
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
              !watch('personIdentType') && 'hidden'
            } flex flex-wrap gap-4 items-start justify-between w-full`}
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
                        className={`w-[49%] flex flex-col gap-1 items-start`}
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
                      <label className="flex flex-col gap-1 w-[49%]">
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
                      <label className="flex flex-col gap-1 w-[49%]">
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
                      <label className="flex flex-col gap-1 w-[49%]">
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
                  <label className="w-[49%] flex flex-col gap-1 items-start">
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
                  <label className="w-[49%] flex flex-col gap-1 items-start">
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
                  <label className="w-[49%] flex flex-col gap-1 items-start">
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
                  <label className="flex flex-col gap-2 items-start w-[49%]">
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
                  <label className="flex flex-col w-[49%] gap-1">
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
                  <label className="flex flex-col gap-1 w-[49%]">
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
                      <label className="w-[49%] flex flex-col gap-1 items-start">
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
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input label="PO Box" placeholder="PO Box" {...field} />
                    </label>
                  );
                }}
              />
            )}
            <menu
              className={`${
                watch('personIdentType') === 'passport' ? 'flex' : 'hidden'
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
          </section>
          <section className="flex items-center justify-end w-full">
            <Button
              submit
              value={managementPersonIsLoading ? <Loader /> : 'Add position'}
              primary
              disabled={disableForm}
            />
          </section>
          <BusinessPeople
            type="executiveManagement"
            businessId={businessId}
          />
          {[
            'IN_PREVIEW',
            'IN_PROGRESS',
            'IS_AMENDING',
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
                  dispatch(setBusinessActiveStep('board_of_directors'));
                }}
              />
              {status === 'IS_AMENDING' && (
                <Button
                  value={'Complete Amendment'}
                  disabled={Object.keys(errors).length > 0 || disableForm}
                />
              )}
              {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) && (
                <Button
                  value="Save & Complete Review"
                  primary
                  disabled={disableForm || Object.keys(errors).length > 0}
                />
              )}
              <Button
                value="Save & Continue"
                primary
                disabled={disableForm || Object.keys(errors).length > 0}
                onClick={(e) => {
                  e.preventDefault();
                  if (!businessPeopleList?.length) {
                    setError('submit', {
                      type: 'manual',
                      message: 'Add at least one member',
                    });
                    setTimeout(() => {
                      clearErrors('submit');
                    }, 5000);
                    return;
                  }
                  dispatch(setBusinessCompletedStep('executive_management'));
                  dispatch(setBusinessActiveStep('board_of_directors'));
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
                  dispatch(setBusinessActiveStep('business_activity_vat'));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('board_of_directors'));
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
      <OTPVerificationCard
        phone={watch('phone')}
        isOpen={showVerifyPhone}
        onClose={() => {
          setShowVerifyPhone(false);
          handleSubmit(onSubmit)();
        }}
      />
    </section>
  );
};

export default ExecutiveManagement;
