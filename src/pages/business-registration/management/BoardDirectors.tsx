import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import Loader from "../../../components/Loader";
import Input from "../../../components/inputs/Input";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { previewUrl, userData } from "../../../constants/authentication";
import { countriesList } from "../../../constants/countries";
import Button from "../../../components/inputs/Button";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from "../../../states/features/businessRegistrationSlice";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { capitalizeString, generateUUID } from "../../../helpers/strings";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import {
  RDBAdminEmailPattern,
  validNationalID,
} from "../../../constants/Users";
import validateInputs from "../../../helpers/validations";
import { attachmentFileColumns } from "../../../constants/businessRegistration";
import Modal from "../../../components/Modal";
import ViewDocument from "../../user-company-details/ViewDocument";
import OTPVerificationCard from "@/components/cards/OTPVerificationCard";

export interface business_board_of_directors {
  first_name: string;
  middle_name: string;
  last_name: string;
  id: string;
}

interface BoardDirectorsProps {
  isOpen: boolean;
  board_of_directors: business_board_of_directors[];
  entry_id: string | null;
  status: string;
}

const BoardDirectors: FC<BoardDirectorsProps> = ({
  isOpen,
  board_of_directors = [],
  entry_id,
  status,
}) => {
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
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    director: boolean;
    attachment: boolean;
    first_name?: string;
    last_name?: string;
  }>({
    director: false,
    attachment: false,
  });
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    setValue('country', '');
    setValue('phone', '');
    setValue('street_name', '');
    setValue('first_name', '');
    setValue('middle_name', '');
    setValue('last_name', '');
    setSearchMember({
      ...searchMember,
      data: null,
    });
  }, [setValue, watch('document_type')]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    clearErrors('position_conflict');
    clearErrors('board_of_directors');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          active_step: 'senior_management',
          active_tab: 'management',
          board_of_directors: [
            {
              ...data,
              attachment: {
                name: attachmentFile?.name,
                size: attachmentFile?.size,
                type: attachmentFile?.type,
              },
              step: 'board_of_directors',
              id: generateUUID(),
            },
            ...board_of_directors,
          ],
        })
      );
      reset();
      setAttachmentFile(null);
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
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
          <menu className="flex items-center justify-center gap-6 w-fit">
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
                  director: true,
                  first_name: row?.original?.first_name,
                  last_name: row?.original?.last_name,
                });
              }}
            />
            <Modal
              isOpen={confirmDeleteModal?.director}
              onClose={() => {
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  director: false,
                });
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium text-center uppercase">
                  Are you sure you want to delete{' '}
                  {confirmDeleteModal?.first_name}{' '}
                  {confirmDeleteModal?.last_name || ''}
                </h1>
                <menu className="flex items-center justify-between gap-3">
                  <Button
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        director: false,
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
                          entry_id,
                          board_of_directors: board_of_directors?.filter(
                            (director: business_board_of_directors) => {
                              return director?.id !== row?.original?.id;
                            }
                          ),
                        })
                      );
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        director: false,
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
                  Are you sure you want to delete {attachmentFile?.name}
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
                      setAttachmentFile(null);
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
    <section className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
            <Controller
              name="position"
              rules={{ required: "Select member's position" }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Select
                      {...field}
                      label="Select position"
                      placeholder="Select position"
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
                        reset({
                          position: e,
                        });
                        if (
                          String(e) === 'chairman' &&
                          board_of_directors?.find(
                            (director) => director?.position === 'chairman'
                          )
                        ) {
                          setError('position_conflict', {
                            type: 'manual',
                            message:
                              'Cannot have more than one chairpeople in a company.',
                          });
                          setValue('document_type', '');
                          setValue('position', '');
                          return;
                        }
                        if (
                          errors?.position_conflict &&
                          String(e) !== 'chairman' &&
                          e !== undefined
                        ) {
                          clearErrors('position_conflict');
                        }
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
                        placeholder="Select document type"
                        label="Document Type"
                        required
                        {...field}
                      />
                    </label>
                  );
                }}
              />
              {watch('document_type') && watch('document_type') === 'nid' && (
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
                          {...field}
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
                              const randomNumber = Math.floor(
                                Math.random() * 10
                              );
                              const userDetails = userData[randomNumber];

                              if (
                                String(field?.value) !== String(validNationalID)
                              ) {
                                setSearchMember({
                                  ...searchMember,
                                  data: null,
                                  loading: false,
                                  error: true,
                                });
                              } else {
                                setSearchMember({
                                  ...searchMember,
                                  data: userDetails,
                                  loading: false,
                                  error: false,
                                });
                                setValue('first_name', userDetails?.first_name);
                                setValue(
                                  'middle_name',
                                  userDetails?.middle_name
                                );
                                setValue('last_name', userDetails?.last_name);
                                setValue('gender', userDetails?.data?.gender);
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
              rules={{ required: 'First name is required' }}
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
                  watch('document_type') === 'passport'
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
                          label="Male"
                          {...field}
                          checked={watch('gender') === 'Male'}
                          value={'Male'}
                        />
                        <Input
                          type="radio"
                          label="Female"
                          {...field}
                          checked={watch('gender') === 'Female'}
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
              name="phone"
              control={control}
              rules={{
                required: 'Phone number is required',
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
                        placeholder="Select phone number"
                        required
                        options={userData?.slice(0, 3)?.map((user) => {
                          return {
                            ...user,
                            label: `(+250) ${user?.phone}`,
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
            {watch('document_type') !== 'nid' ? (
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Nationality is required' }}
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
            ) : (
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
            )}
            <menu
              className={`${
                watch('document_type') === 'passport' ? 'flex' : 'hidden'
              } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
            >
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Passport <span className="text-red-600">*</span>
              </h3>
              <Controller
                defaultValue={attachmentFile?.name}
                name="attachment"
                rules={{
                  required:
                    watch('document_type') === 'passport'
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
          <article className="flex items-center justify-center w-full">
            {errors?.position_conflict && (
              <p className="text-red-600 text-[14px] text-center">
                {String(errors?.position_conflict?.message)}
              </p>
            )}
          </article>
          <section className="flex items-center justify-end w-full">
            <Button
              value={isLoading ? <Loader /> : 'Add board member'}
              primary
              disabled={disableForm}
              onClick={async (e) => {
                e.preventDefault();
                await trigger();
                if (Object.keys(errors).length > 0) return;
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  if (watch('document_type') === 'nid') {
                    setShowVerifyPhone(true);
                  } else {
                    handleSubmit(onSubmit)();
                  }
                }, 1000);
              }}
            />
          </section>
          <section className={`flex members-table flex-col w-full`}>
            <h2 className="text-lg font-semibold uppercase text-primary">
              Board Members
            </h2>
            <Table
              data={
                board_of_directors?.length > 0
                  ? board_of_directors?.map((member, index) => {
                      return {
                        ...member,
                        no: index,
                        name: `${member?.first_name || ''} ${
                          member?.middle_name || ''
                        } ${member?.last_name || ''}`,
                        position:
                          member?.position &&
                          capitalizeString(member?.position),
                      };
                    })
                  : []
              }
              columns={columns}
              showFilter={false}
              showPagination={false}
              rowClickHandler={undefined}
            />
          </section>
          {errors?.board_of_directors && (
            <p className="text-red-600 text-[13px] text-center">
              {String(errors?.board_of_directors?.message)}
            </p>
          )}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              disabled={disableForm}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep('business_activity_vat'));
                dispatch(setBusinessActiveTab('general_information'));
              }}
            />
            {status === 'is_Amending' && (
              <Button
                submit
                value={'Complete Amendment'}
                disabled={Object.keys(errors).length > 0 || disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  if (board_of_directors?.length <= 0) {
                    setError('board_of_directors', {
                      type: 'manual',
                      message: 'Add at least one board member',
                    });
                    setTimeout(() => {
                      clearErrors('board_of_directors');
                    }, 4000);
                    return;
                  }
                  dispatch(setBusinessCompletedStep('board_of_directors'));
                  dispatch(setBusinessActiveTab('preview_submission'));
                  dispatch(setBusinessActiveStep('preview_submission'));
                }}
              />
            )}
            {['in_preview', 'action_required'].includes(status) && (
              <Button
                value="Save & Complete Review"
                primary
                disabled={disableForm || Object.keys(errors).length > 0}
                onClick={(e) => {
                  e.preventDefault();
                  if (board_of_directors?.length <= 0) {
                    setError('board_of_directors', {
                      type: 'manual',
                      message: 'Add at least one board member',
                    });
                    setTimeout(() => {
                      clearErrors('board_of_directors');
                    }, 4000);
                    return;
                  }
                  dispatch(setBusinessCompletedStep('board_of_directors'));
                  dispatch(setBusinessActiveTab('preview_submission'));
                  dispatch(setBusinessActiveStep('preview_submission'));
                }}
              />
            )}
            <Button
              value="Save & Continue"
              primary
              disabled={disableForm || Object.keys(errors).length > 0}
              onClick={(e) => {
                e.preventDefault();
                if (board_of_directors?.length <= 0) {
                  setError('board_of_directors', {
                    type: 'manual',
                    message: 'Add at least one board member',
                  });
                  setTimeout(() => {
                    clearErrors('board_of_directors');
                  }, 4000);
                  return;
                }
                dispatch(
                  setUserApplications({ entry_id, status: 'in_progress' })
                );
                dispatch(setBusinessCompletedStep('board_of_directors'));
                dispatch(setBusinessActiveTab('management'));
                dispatch(setBusinessActiveStep('senior_management'));
              }}
            />
          </menu>
        </fieldset>
      </form>
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
      <OTPVerificationCard
        isOpen={showVerifyPhone}
        onClose={async () => {
          setShowVerifyPhone(false);
          handleSubmit(onSubmit)();
        }}
        phone={watch('phone')}
      />
    </section>
  );
};

export default BoardDirectors;
