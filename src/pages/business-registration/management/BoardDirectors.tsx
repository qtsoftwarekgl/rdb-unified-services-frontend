import { FC, useEffect, useRef, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import Loader from '../../../components/Loader';
import Input from '../../../components/inputs/Input';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { userData } from '../../../constants/authentication';
import { countriesList } from '../../../constants/countries';
import Button from '../../../components/inputs/Button';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../states/features/businessRegistrationSlice';
import { AppDispatch, RootState } from '../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { capitalizeString, generateUUID } from '../../../helpers/strings';
import { setUserApplications } from '../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern, validNationalID } from '../../../constants/Users';
import validateInputs from '../../../helpers/validations';
import { attachmentFileColumns } from '../../../constants/businessRegistration';
import { getBase64 } from '../../../helpers/uploads';
import Modal from '../../../components/Modal';

export interface business_board_of_directors {
  first_name: string;
  middle_name: string;
  last_name: string;
  id: string
}

interface BoardDirectorsProps {
  isOpen: boolean;
  board_of_directors: business_board_of_directors[];
  entry_id: string | null;
}

const BoardDirectors: FC<BoardDirectorsProps> = ({
  isOpen,
  board_of_directors = [],
  entry_id,
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
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const positionRef = useRef();
  const disableForm = RDBAdminEmailPattern.test(user?.email)

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
    clearErrors('position_conflict');

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
              attachment: attachmentFile?.name,
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
      if (positionRef?.current) {
        positionRef.current.clearValue();
        setValue('position', '');
        setValue('document_type', '')
      }
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
              className={`${
                disableForm
                  ? 'text-secondary cursor-default'
                  : 'text-red-600 cursor-pointer'
              } font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                if (disableForm) return;
                setConfirmDeleteModal(row?.original);
              }}
            />
            <Modal
              isOpen={confirmDeleteModal}
              onClose={() => {
                setConfirmDeleteModal(null);
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium uppercase text-center">
                  Are you sure you want to delete{' '}
                  {confirmDeleteModal?.first_name}{' '}
                  {confirmDeleteModal?.last_name || ''}
                </h1>
                <menu className="flex items-center gap-3 justify-between">
                  <Button
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteModal(false);
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
                      setConfirmDeleteModal(false);
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
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
                getBase64(row?.original, (result) => {
                  setAttachmentPreview(result);
                });
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
                      ref={positionRef}
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
                          setValue('position', '');
                          setValue('document_type', '');
                          return;
                        }
                        if (
                          errors?.position_conflict &&
                          String(e) !== 'chairman'
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
                        label="Document Type"
                        required
                        onChange={(e) => {
                          field.onChange(e);
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
                          value={'Male'}
                          name={field?.name}
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
              defaultValue={userData?.[0]?.phone}
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
                        required
                        defaultValue={{
                          label: `(+250) ${userData?.[0]?.phone}`,
                          value: userData?.[0]?.phone,
                        }}
                        options={userData?.slice(0, 3)?.map((user) => {
                          return {
                            ...user,
                            label: `(+250) ${user?.phone}`,
                            value: user?.phone,
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
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
                          setValue('attachment', e?.target?.files?.[0]?.name);
                        }}
                      />
                      <ul className="flex flex-col items-center gap-3 w-full">
                        {(attachmentFile || board_of_directors?.attachment) && (
                          <Table
                            columns={attachmentColumns}
                            data={[
                              attachmentFile || board_of_directors?.attachment,
                            ]}
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
          <article className="w-full flex items-center justify-center">
            {errors?.position_conflict && (
              <p className="text-red-600 text-[14px] text-center">
                {String(errors?.position_conflict?.message)}
              </p>
            )}
          </article>
          <section className="flex items-center justify-end w-full">
            <Button
              value={isLoading ? <Loader /> : 'Add board member'}
              submit
              primary
              disabled={disableForm}
            />
          </section>
          <section className={`flex members-table flex-col w-full`}>
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
              tableTitle="Board members"
            />
          </section>
          {errors?.board_of_directors && (
            <p className="text-red-600 text-[13px]">
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
            {isAmending && (
              <Button
                value={'Complete Amendment'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveTab('preview_submission'));
                }}
              />
            )}
            <Button
              value="Continue"
              primary
              disabled={disableForm}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessCompletedStep('board_of_directors'));
                dispatch(setBusinessActiveStep('senior_management'));
              }}
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default BoardDirectors;
