import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Loader from "../../../../components/Loader";
import Input from "../../../../components/inputs/Input";
import { faSearch, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { userData } from "../../../../constants/authentication";
import { countriesList } from "../../../../constants/countries";
import validateInputs from "../../../../helpers/validations";
import Button from "../../../../components/inputs/Button";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { capitalizeString, maskPhoneDigits } from "../../../../helpers/strings";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import {
  RDBAdminEmailPattern,
  validNationalID,
} from "../../../../constants/Users";
import ConfirmModal from "../../../../components/confirm-modal/ConfirmModal";
import ViewDocument from "../../../user-company-details/ViewDocument";
import { business_board_of_directors } from "@/pages/business-applications/business-registration/management/BoardDirectors";
import OTPVerificationCard from "@/components/cards/OTPVerificationCard";

interface BoardDirectorsProps {
  entry_id: string | null;
  foreign_board_of_directors: any;
  status?: string;
}

const BoardDirectors = ({
  entry_id,
  foreign_board_of_directors,
  status,
}: BoardDirectorsProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    setValue,
    clearErrors,
    reset,
    trigger,
    formState: { isSubmitSuccessful, errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({});
  const [previewAttachment, setPreviewAttachment] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);

  // CLEAR FORM
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setAttachmentFile(null);
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
    }
  }, [isSubmitSuccessful, reset]);

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    setValue("country", "");
    setValue("phone", "");
    setValue("street_name", "");
    setValue("first_name", "");
    setValue("middle_name", "");
    setValue("last_name", "");
    setSearchMember({
      ...searchMember,
      data: null,
    });
  }, [setValue, watch("document_type")]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    clearErrors("position_conflict");
    clearErrors("board_of_directors");
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entry_id,
          foreign_board_of_directors: [
            {
              ...data,
              attachment: attachmentFile?.name,
              step: "foreign_board_of_directors",
            },
            ...foreign_board_of_directors,
          ],
        })
      );
      setIsLoading(false);
      setValue("attachment", null);
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
      reset();
    }, 1000);
    return data;
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: {
        row: {
          original: {
            no: number;
          };
        };
      
      }) => {
        return (
          <menu className="flex items-center">
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                if (isFormDisabled) return;
                setConfirmModalData(row?.original);
                setConfirmModal(true);
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
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
            <Controller
              name="position"
              rules={{
                required:
                  status !== 'in_preview' ? "Select member's position" : false,
              }}
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
                        if (
                          String(e) === 'chairman' &&
                          foreign_board_of_directors?.find(
                            (director: business_board_of_directors) =>
                              director?.position === 'chairman'
                          )
                        ) {
                          setError('position_conflict', {
                            type: 'manual',
                            message:
                              'Cannot have more than one chairpeople in a company.',
                          });
                          return;
                        }
                        if (
                          errors?.position_conflict &&
                          String(e) !== 'chairman'
                        ) {
                          clearErrors('position_conflict');
                        }
                        setValue('document_type', '');
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
                        placeholder="Select document type"
                        options={options}
                        label="Document Type"
                        required
                        {...field}
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
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger('document_no');
                          }}
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
                              const index =
                                field?.value.trim() === validNationalID
                                  ? Math.floor(Math.random() * 10)
                                  : Math.floor(Math.random() * 11) + 11;

                              const userDetails = userData[index];
                              if (!userDetails) {
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
                                setValue('gender', userDetails?.gender);
                              }
                            }, 700);
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                        />
                        {searchMember?.loading && (
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
              {watch('document_type') === 'passport' && (
                <Controller
                  name="passport_no"
                  rules={{
                    required: 'Passport number is required',
                    validate: (value) => {
                      return (
                        validateInputs(value, 'passsport') ||
                        'Invalid passport number'
                      );
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label
                        className={`flex flex-col gap-1 w-full items-start ${
                          watch('document_type') !== 'nid' && '!w-[49%]'
                        }`}
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
              control={control}
              name="gender"
              defaultValue={watch('gender') || searchMember?.data?.gender}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => {
                return (
                  <label className="flex items-center w-full gap-2 py-4">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch('document_type') !== 'passport' ? (
                      <p className="px-2 py-1 rounded-md bg-background">
                        {searchMember?.data?.gender || watch('gender')}
                      </p>
                    ) : (
                      <menu className="flex items-center gap-4 mt-2">
                        <Input
                          type="radio"
                          label="Male"
                          name={field?.name}
                          value={'Male'}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        <Input
                          type="radio"
                          label="Female"
                          name={field?.name}
                          value={'Female'}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </menu>
                    )}
                    {errors?.gender && (
                      <span className="text-sm text-red-500">
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
                required: watch('phone') ? 'Phone number is required' : false,
                pattern: {
                  value: /^(?:[0-9] ?){6,14}[0-9]$/,
                  message: 'Invalid phone number',
                },
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
            {watch('document_type') !== 'nid' ? (
              <Controller
                name="country"
                control={control}
                rules={{ required: 'Nationality is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1 items-start">
                      <Select
                        placeholder="Select country"
                        {...field}
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
                        onChange={(e) => {
                          field.onChange(e);
                        }}
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
            {watch('document_type') !== 'nid' && (
              <menu className="flex-col items-start w-full gap-3 my-3 max-md:items-center">
                <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                  Passport copy <span className="text-red-600">*</span>
                </h3>
                <menu className="flex gap-4">
                  <Controller
                    name="attachment"
                    rules={{ required: 'Passport is required' }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                          <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                            <Input
                              type="file"
                              accept="application/pdf"
                              className="!w-fit max-sm:!w-full"
                              onChange={(e) => {
                                field.onChange(e?.target?.files?.[0]);
                                setAttachmentFile(e?.target?.files?.[0]);
                              }}
                            />
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
                  {attachmentFile && (
                    <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                      <FontAwesomeIcon
                        className="cursor-pointer text-primary"
                        icon={faEye}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAttachment(
                            URL.createObjectURL(attachmentFile)
                          );
                        }}
                      />
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
                </menu>
              </menu>
            )}
          </section>
          <menu className="flex items-center justify-center w-full">
            {errors?.position_conflict && (
              <p className="text-red-600 text-[14px] text-center">
                {String(errors?.position_conflict?.message)}
              </p>
            )}
          </menu>
          <section className="flex items-center justify-end w-full">
            <Button
              value={isLoading ? <Loader /> : 'Add board member'}
              primary
              disabled={isFormDisabled}
              onClick={async (e) => {
                e.preventDefault();
                await trigger();
                if (Object.keys(errors).length > 0) return;
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  if (watch('document_type') === 'nid') {
                    setShowVerifyPhone(true);
                    return;
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
              rowClickHandler={undefined}
              data={foreign_board_of_directors?.map((member, index) => {
                return {
                  ...member,
                  no: index + 1,
                  name: `${member?.first_name} ${member?.middle_name ?? ''} ${
                    member?.last_name ?? ''
                  }`,
                  position:
                    member?.position && capitalizeString(member?.position),
                };
              })}
              columns={columns}
              showFilter={false}
              showPagination={false}
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
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setForeignBusinessActiveStep('foreign_business_activity_vat')
                );
                dispatch(setForeignBusinessActiveTab('general_information'));
              }}
            />
            {status === 'is_Amending' && (
              <Button
                value={'Complete Amendment'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setForeignBusinessActiveTab('foreign_preview_submission')
                  );
                }}
              />
            )}
            {['in_preview', 'action_required'].includes(status) && (
              <Button
                value={'Save & Complete Review'}
                primary
                onClick={(e) => {
                  e.preventDefault();
                  if (foreign_board_of_directors?.length <= 0) {
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
                    setForeignBusinessCompletedStep(
                      'foreign_board_of_directors'
                    )
                  );

                  dispatch(
                    setForeignBusinessActiveTab('foreign_preview_submission')
                  );
                }}
                disabled={isFormDisabled}
              />
            )}
            <Button
              value="Save & Continue"
              primary
              disabled={isFormDisabled}
              onClick={(e) => {
                e.preventDefault();
                if (foreign_board_of_directors?.length <= 0) {
                  setError('board_of_directors', {
                    type: 'manual',
                    message: 'Add at least one board member',
                  });
                  setTimeout(() => {
                    clearErrors('board_of_directors');
                  }, 4000);
                  return;
                }
                if (
                  foreign_board_of_directors?.find(
                    (director: business_board_of_directors) =>
                      director?.document_type === 'nid'
                  ) === undefined
                ) {
                  setError('board_of_directors', {
                    type: 'manual',
                    message: 'Board requires at least one Rwandan local resident in its members',
                  });
                  setTimeout(() => {
                    clearErrors('board_of_directors');
                  }, 4000);
                  return;
                }
                dispatch(
                  setUserApplications({ entry_id, status: 'in_progress' })
                );
                dispatch(
                  setForeignBusinessCompletedStep('foreign_board_of_directors')
                );
                dispatch(
                  setForeignBusinessActiveStep('foreign_senior_management')
                );
              }}
            />
          </menu>
        </fieldset>
      </form>
      {previewAttachment && (
        <ViewDocument
          documentUrl={previewAttachment}
          setDocumentUrl={setPreviewAttachment}
        />
      )}
      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => {
          setConfirmModal(false);
          setConfirmModalData({});
        }}
        onConfirm={(e) => {
          e.preventDefault();
          dispatch(
            setUserApplications({
              entry_id,
              foreign_board_of_directors: foreign_board_of_directors?.filter(
                (_: unknown, index: number) => {
                  return index !== confirmModalData?.no - 1;
                }
              ),
            })
          );
        }}
        message="Are you sure you want to delete this member?"
        description="This action cannot be undone"
      />
      <OTPVerificationCard
        isOpen={showVerifyPhone}
        onClose={() => {
          setShowVerifyPhone(false);
          handleSubmit(onSubmit)();
        }}
        phone={watch('phone')}
      />
    </section>
  );
};

export default BoardDirectors;