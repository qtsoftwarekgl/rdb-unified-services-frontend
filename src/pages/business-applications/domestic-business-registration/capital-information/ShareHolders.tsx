import { FC, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import {
  attachmentFileColumns,
  personnelTypes,
  searchedCompanies,
} from "../../../../constants/businessRegistration";
import Input from "../../../../components/inputs/Input";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  previewUrl,
  userData,
  validTinNumber,
} from "../../../../constants/authentication";
import Loader from "../../../../components/Loader";
import validateInputs from "../../../../helpers/validations";
import { countriesList } from "../../../../constants/countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../../components/inputs/Button";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import Table from "../../../../components/table/Table";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setBusinessPersonDetailsModal,
} from "../../../../states/features/businessRegistrationSlice";
import { capitalizeString, generateUUID, maskPhoneDigits } from "../../../../helpers/strings";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import moment from "moment";
import { RDBAdminEmailPattern, validNationalID } from "../../../../constants/Users";
import Modal from "../../../../components/Modal";
import ViewDocument from "../../../user-company-details/ViewDocument";
import OTPVerificationCard from "@/components/cards/OTPVerificationCard";
import BusinessPersonDetails from "../BusinessPersonDetails";
import TextArea from "@/components/inputs/TextArea";

export interface business_shareholders {
  type: string;
  id: string;
  document_type: string;
  document_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  company_name?: File
}

interface ShareHoldersProps {
  isOpen: boolean;
  shareholders: business_shareholders[];
  entryId: string | null;
  status: string;
}

const ShareHolders: FC<ShareHoldersProps> = ({
  isOpen,
  shareholders = [],
  entryId,
  status,
}) => {
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

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    shareholder: boolean;
    attachment: boolean;
    first_name?: string;
    last_name?: string;
    company_name?: string;
  }>({
    shareholder: false,
    attachment: false,
  });
  const [attachmentPreview, setAttachmentPreview] = useState<string>('');
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [shareholderDetails, setShareholderDetails] =
    useState<business_shareholders | null>(null);
  const [showVerifyPhone, setShowVerifyPhone] = useState<boolean>(false);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entryId,
          shareholders: [
            {
              ...data,
              attachments: JSON.stringify(attachmentFiles),
              step: 'shareholders',
              no: shareholders?.length - 1,
              id: generateUUID(),
            },
            ...shareholders,
          ],
        })
      );
      setIsLoading(false);
      reset();
      setAttachmentFiles([]);
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
      reset({
        shareholder_type: '',
      });
    }, 1000);
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({
        row,
      }: {
        row: {
          original: business_shareholders;
        };
      }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className={`${
                disableForm
                  ? 'text-secondary cursor-default'
                  : 'text-red-600 cursor-pointer'
              } font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                if (disableForm) return;
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  shareholder: true,
                  first_name: row?.original?.first_name,
                  last_name: row?.original?.last_name,
                  company_name: row?.original?.company_name,
                });
              }}
            />
            <Modal
              isOpen={confirmDeleteModal?.shareholder}
              onClose={() => {
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  shareholder: false,
                });
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium text-center uppercase">
                  Are you sure you want to delete{' '}
                  {confirmDeleteModal?.first_name ||
                    confirmDeleteModal?.company_name}{' '}
                  {confirmDeleteModal?.last_name || ''}
                </h1>
                <menu className="flex items-center justify-between gap-3">
                  <Button
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        shareholder: false,
                      });
                    }}
                  />
                  <Button
                    value="Delete"
                    danger
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setUserApplications({
                          entryId,
                          shareholders: shareholders?.filter(
                            (shareholder: business_shareholders) => {
                              return shareholder?.id !== row?.original?.id;
                            }
                          ),
                        })
                      );
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        shareholder: false,
                        first_name: '',
                        last_name: '',
                      });
                    }}
                  />
                </menu>
              </section>
            </Modal>
          </menu>
        );
      },
    },
  ];

  const attachmentColumns = [
    ...attachmentFileColumns,
    {
      header: 'action',
      accesorKey: 'action',
      cell: ({ row }) => {
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
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  attachment: true,
                });
              }}
            />
            <Modal
              isOpen={confirmDeleteModal?.attachment}
              onClose={() => {
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  attachment: false,
                });
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium text-center uppercase">
                  Delete {row?.original?.name}
                </h1>
                <menu className="flex items-center justify-between gap-3">
                  <Button
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        attachment: false,
                      });
                    }}
                  />
                  <Button
                    value="Delete"
                    danger
                    onClick={(e) => {
                      e.preventDefault();
                      setAttachmentFiles(
                        attachmentFiles?.filter(
                          (file) => file?.name !== row?.original?.name
                        )
                      );
                      setValue('attachment', null);
                      setError('attachment', {
                        type: 'manual',
                        message: 'Passport is required',
                      });
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        attachment: false,
                      });
                    }}
                  />
                </menu>
              </section>
            </Modal>
          </menu>
        );
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <Controller
            name="type"
            control={control}
            defaultValue={watch('type')}
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
                      reset({
                        type: e,
                      });
                    }}
                  />
                  {errors?.type && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.type?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <ul className={`w-full flex items-start gap-6`}>
            {watch('type') === 'person' && (
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
                        placeholder="Select document type"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.document_type && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.document_type?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch('type') && (
              <menu className="flex flex-col gap-4 w-[49%]">
                {watch('type') && watch('type') === 'legal_entity' && (
                  <menu className="flex flex-col gap-4">
                    <Controller
                      name="description"
                      rules={{
                        required:
                          watch('type') === 'legal_entity'
                            ? 'Add more information'
                            : false,
                      }}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col gap-1 w-full">
                            <TextArea
                              label="Description"
                              required
                              placeholder="Add more information"
                              {...field}
                            />
                            {errors?.description && (
                              <p className="text-red-600 text-[13px]">
                                {String(errors?.description?.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                    <label className="flex flex-col gap-2">
                      <p className="text-[13px] text-secondary">
                        Add supporting documents (optional)
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="application/pdf"
                        onChange={(e) => {
                          const files = e?.target?.files;
                          setAttachmentFiles([...attachmentFiles, ...files]);
                        }}
                      />
                    </label>
                  </menu>
                )}
                {watch('type') && watch('type') !== 'person' && (
                  <menu className="flex flex-col w-full gap-6">
                    <Controller
                      control={control}
                      name="rwandan_company"
                      rules={{ required: 'Select Rwandan company status' }}
                      render={({ field }) => {
                        return (
                          <menu className="flex flex-col gap-2">
                            <p className="flex items-center gap-2 text-[15px]">
                              Is the company based in Rwanda?
                              <span className="text-red-600">*</span>
                            </p>
                            <menu className="flex items-center w-full gap-6">
                              <Input
                                type="radio"
                                label="Yes"
                                checked={watch('rwandan_company') === 'yes'}
                                {...field}
                                value="yes"
                                onChange={(e) => {
                                  setSearchMember({
                                    ...searchMember,
                                    data: null,
                                  });
                                  field.onChange(e.target.value);
                                }}
                              />
                              <Input
                                type="radio"
                                label="No"
                                checked={watch('rwandan_company') === 'no'}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  setValue('incorporation_country', '');
                                }}
                                value={'no'}
                              />
                              {errors?.rwandan_company && (
                                <p className="text-[13px] text-red-500">
                                  {String(errors?.rwandan_company.message)}
                                </p>
                              )}
                            </menu>
                          </menu>
                        );
                      }}
                    />
                    {watch('rwandan_company') === 'yes' && (
                      <Controller
                        name="reference_no"
                        control={control}
                        rules={{
                          required:
                            watch('type') !== 'person'
                              ? 'Company code is required'
                              : false,
                          validate: (value) => {
                            if (
                              watch('type') === 'person' ||
                              watch('rwandan_company') === 'no'
                            )
                              return true;
                            return (
                              validateInputs(value, 'tin') ||
                              'Company code must be 9 characters long'
                            );
                          },
                        }}
                        render={({ field }) => {
                          return (
                            <label className="flex flex-col gap-1 w-full">
                              <Input
                                label="Company/Entreprise Code"
                                placeholder="Company code"
                                suffixIcon={faSearch}
                                suffixIconPrimary
                                suffixIconHandler={async (e) => {
                                  e.preventDefault();
                                  if (!field.value) {
                                    setError('reference_no', {
                                      type: 'manual',
                                      message:
                                        'Company code is required to search',
                                    });
                                    return;
                                  }
                                  setSearchMember({
                                    ...searchMember,
                                    loading: true,
                                    error: false,
                                  });
                                  setTimeout(() => {
                                    const randomNumber = Math.floor(
                                      Math.random() * 10
                                    );
                                    const userDetails =
                                      searchedCompanies[randomNumber];

                                    if (
                                      field?.value !== String(validTinNumber)
                                    ) {
                                      setSearchMember({
                                        ...searchMember,
                                        data: null,
                                        loading: false,
                                        error: true,
                                      });
                                      setError('reference_no', {
                                        type: 'manual',
                                        message: 'Company not found',
                                      });
                                    } else {
                                      clearErrors();
                                      setSearchMember({
                                        ...searchMember,
                                        data: userDetails,
                                        loading: false,
                                        error: false,
                                      });
                                      setValue(
                                        'company_name',
                                        userDetails?.company_name
                                      );
                                      setValue('email', userDetails?.email);
                                      setValue(
                                        'gender',
                                        userDetails?.data?.gender
                                      );
                                      setValue(
                                        'phone',
                                        userDetails?.data?.phone
                                      );
                                      setValue('incorporation_country', 'RW');
                                      setValue(
                                        'registration_date',
                                        moment()
                                          .subtract(1, 'years')
                                          .format('YYYY-MM-DD')
                                      );
                                    }
                                  }, 700);
                                }}
                                onChange={async (e) => {
                                  field.onChange(e);
                                  clearErrors('reference_no');
                                  await trigger('reference_no');
                                }}
                              />
                              {searchMember?.loading &&
                                !errors?.reference_no && (
                                  <p className="flex items-center gap-[2px] text-[13px]">
                                    <Loader size={4} /> Validating company code
                                  </p>
                                )}
                              {errors?.reference_no && (
                                <p className="text-red-500 text-[13px]">
                                  {String(errors?.reference_no?.message)}
                                </p>
                              )}
                            </label>
                          );
                        }}
                      />
                    )}
                  </menu>
                )}
              </menu>
            )}
            {watch('document_type') === 'nid' && watch('type') === 'person' && (
              <Controller
                control={control}
                name="document_no"
                rules={{
                  required: watch('document_type')
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

                            if (field.value !== String(validNationalID)) {
                              setSearchMember({
                                ...searchMember,
                                data: null,
                                loading: false,
                                error: true,
                              });
                            } else {
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
                          clearErrors('document_no');
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
              watch('type') !== 'person' && 'hidden'
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="passport_no"
              control={control}
              rules={{
                required:
                  watch('document_type') === 'passport'
                    ? 'Passport number is required'
                    : false,
                validate: (value) => {
                  if (watch('document_type') !== 'passport') {
                    return true;
                  }
                  return (
                    validateInputs(value, 'passport') ||
                    'Invalid passport number'
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label
                    className={`${
                      watch('document_type') === 'passport' ? 'flex' : 'hidden'
                    } w-[49%] flex flex-col gap-1 items-start`}
                  >
                    <Input
                      required
                      placeholder="Passport number"
                      label="Passport number"
                      {...field}
                    />
                    {errors?.passport_no && (
                      <span className="text-sm text-red-500">
                        {String(errors?.passport_no?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="first_name"
              control={control}
              defaultValue={searchMember?.data?.first_name}
              rules={{
                required:
                  watch('type') === 'person' ? 'First name is required' : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      readOnly={watch('document_type') === 'nid'}
                      defaultValue={searchMember?.data?.first_name}
                      placeholder="First name"
                      label="First name"
                      {...field}
                    />
                    {errors?.first_name && (
                      <span className="text-sm text-red-500">
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
                      readOnly={watch('document_type') === 'nid'}
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
                      readOnly={watch('document_type') === 'nid'}
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
                  watch('type') === 'person' && watch('document_type') !== 'nid'
                    ? 'Select gender'
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-2 items-start w-[49%]">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch('document_type') === 'nid' ? (
                      <p className="px-2 py-1 rounded-md bg-background">
                        {searchMember?.data?.gender || watch('gender')}
                      </p>
                    ) : (
                      <menu className="flex items-center gap-4 mt-2">
                        <Input
                          type="radio"
                          checked={
                            searchMember?.data?.gender === 'Female' ||
                            watch('gender') === 'Male'
                          }
                          label="Male"
                          {...field}
                          value={'Male'}
                        />
                        <Input
                          type="radio"
                          checked={
                            searchMember?.data?.gender === 'Female' ||
                            watch('gender') === 'Female'
                          }
                          label="Female"
                          {...field}
                          value={'Female'}
                        />
                      </menu>
                    )}

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
                  watch('type') === 'person' &&
                  watch('document_type') === 'passport' &&
                  'Nationality is required',
              }}
              render={({ field }) => {
                return (
                  <label
                    className={`${
                      watch('document_type') === 'nid' ? 'hidden' : 'flex'
                    } w-[49%] flex-col gap-1 items-start`}
                  >
                    <Select
                      placeholder="Select country"
                      required
                      label="Country"
                      options={countriesList
                        ?.filter((country) => country?.code !== 'RW')
                        ?.map((country) => {
                          return {
                            ...country,
                            label: country.name,
                            value: country?.code,
                          };
                        })}
                      {...field}
                    />
                    {errors?.country && (
                      <p className="text-sm text-red-500">
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
              rules={{
                required:
                  watch('type') === 'person' && 'Phone number is required',
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    {watch('document_type') === 'passport' ? (
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
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
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
                Passport <span className="text-red-600">*</span>
              </h3>
              <Controller
                name="attachment"
                rules={{
                  required:
                    watch('document_type') === 'passport' &&
                    watch('type') === 'person'
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
                          setAttachmentFiles([
                            ...attachmentFiles,
                            e?.target?.files?.[0],
                          ]);
                          clearErrors('attachment');
                          setValue('attachment', e?.target?.files?.[0]);
                        }}
                      />
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
          <section
            className={`${
              (watch('type') &&
                watch('type') !== 'person' &&
                watch('rwandan_company') === 'no') ||
              (watch('rwandan_company') === 'yes' && searchMember?.data)
                ? 'flex'
                : 'hidden'
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="company_name"
              control={control}
              defaultValue={searchMember?.data?.company_name}
              rules={{
                required:
                  watch('type') !== 'person'
                    ? 'Company name is required'
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      label="Company Name"
                      placeholder="Company name"
                      required
                      readOnly={watch('rwandan_company') === 'yes'}
                      defaultValue={searchMember?.data?.company_name}
                      {...field}
                    />
                    {errors?.company_name && (
                      <p className="text-sm text-red-500">
                        {String(errors?.company_name?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="reference_no"
              defaultValue={searchMember?.data?.reference_no}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      label="Company code"
                      placeholder="Company code"
                      readOnly={watch('rwandan_company') === 'yes'}
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="incorporation_country"
              control={control}
              rules={{
                required:
                  watch('type') !== 'person' &&
                  watch('rwandan_company') === 'no'
                    ? 'Select country of incorporation'
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    {watch('type') !== 'person' &&
                    watch('rwandan_company') === 'yes' ? (
                      <menu className="flex flex-col gap-2">
                        <p className="flex items-center gap-1 text-[14px]">
                          Country <span className="text-red-600">*</span>
                        </p>
                        <p className="px-2 py-1 rounded-md bg-background">
                          Rwanda
                        </p>
                      </menu>
                    ) : (
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
                    )}
                    {errors?.incorporation_country && (
                      <p className="text-sm text-red-500">
                        {String(errors?.incorporation_country?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="registration_date"
              control={control}
              rules={{
                required:
                  watch('type') !== 'person' &&
                  watch('rwandan_company') === 'no'
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
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    {watch('type') !== 'person' &&
                    watch('rwandan_company') === 'yes' ? (
                      <menu className="flex flex-col gap-2">
                        <p className="flex items-center gap-1 text-[14px]">
                          Incorporation Date{' '}
                          <span className="text-red-600">*</span>
                        </p>
                        <p className="px-2 py-1 text-[14px] w-fit rounded-md bg-background">
                          {watch('registration_date')}
                        </p>
                      </menu>
                    ) : (
                      <Input
                        label="Incorporation Date"
                        required
                        defaultValue={watch('registration_date')}
                        readOnly={watch('rwandan_company') === 'yes'}
                        type="date"
                        {...field}
                      />
                    )}
                    {errors?.registration_date && (
                      <p className="text-sm text-red-500">
                        {String(errors?.registration_date?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              defaultValue={searchMember?.data?.email}
              rules={{
                required:
                  watch('type') !== 'person' && 'Email address is required',
                validate: (value) => {
                  if (watch('type') !== 'person') {
                    return (
                      validateInputs(String(value), 'email') ||
                      'Invalid email address'
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      defaultValue={searchMember?.data?.email}
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
                  watch('type') !== 'person'
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
                  <label className="flex flex-col gap-1 w-[49%]">
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
              control={control}
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
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
          <ul className="flex flex-col items-center w-full gap-3">
            {attachmentFiles?.length > 0 && (
              <Table
                columns={attachmentColumns}
                data={[...attachmentFiles]}
                showPagination={false}
                showFilter={false}
              />
            )}
          </ul>
          <article
            className={`${
              watch('type') ? 'flex' : 'hidden'
            } w-full items-center justify-end`}
          >
            <Button
              value={isLoading ? <Loader /> : 'Add shareholder'}
              primary
              onClick={async (e) => {
                e.preventDefault();
                await trigger();
                if (Object.keys(errors).length > 0) return;
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  if (
                    watch('type') === 'person' &&
                    watch('document_type') === 'nid'
                  ) {
                    setShowVerifyPhone(true);
                  } else {
                    handleSubmit(onSubmit)();
                  }
                }, 1000);
              }}
            />
          </article>
          <section className={`flex members-table flex-col w-full`}>
            <h2 className="text-lg font-semibold uppercase text-primary">
              Shareholders
            </h2>
            <Table
              rowClickHandler={(row) => {
                dispatch(setBusinessPersonDetailsModal(true));
                setShareholderDetails(row?.original);
              }}
              data={
                shareholders?.length > 0
                  ? shareholders?.map((shareholder: unknown, index: number) => {
                      return {
                        ...shareholder,
                        no: index,
                        name: shareholder?.first_name
                          ? `${shareholder?.first_name || ''} ${
                              shareholder?.last_name || ''
                            }`
                          : shareholder?.company_name,
                        type: capitalizeString(shareholder?.type),
                      };
                    })
                  : []
              }
              columns={columns}
              showFilter={false}
              showPagination={false}
            />
          </section>
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
                        entryId,
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
                        entryId,
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
                  dispatch(
                    setUserApplications({
                      entryId,
                      active_tab: 'capital_information',
                      active_step: 'capital_details',
                      status: 'IN_PROGRESS',
                    })
                  );
                }}
              />
            </menu>
          )}
          {['IN_REVIEW', 'IS_APPROVED', 'PENDING_APPROVAL', 'PENDING_REJECTION'].includes(
            status
          ) && (
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
      <BusinessPersonDetails personDetails={shareholderDetails} />
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

export default ShareHolders;
