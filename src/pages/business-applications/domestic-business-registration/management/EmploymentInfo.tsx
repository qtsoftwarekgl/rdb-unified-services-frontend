import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/Input';
import Button from '../../../../components/inputs/Button';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import Loader from '../../../../components/Loader';
import { setUserApplications } from '../../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import { Link } from 'react-router-dom';
import { attachmentFileColumns } from '@/constants/businessRegistration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import Modal from '@/components/Modal';
import Table from '@/components/table/Table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ViewDocument from '@/pages/user-company-details/ViewDocument';
import { previewUrl } from '@/constants/authentication';
import moment from 'moment';

export interface business_employment_info {
  has_employees: string;
  hiring_date?: string;
  employees_no?: number;
  reference_date?: string;
  number_of_employees?: number;
}

interface EmploymentInfoProps {
  isOpen: boolean;
  employment_info: business_employment_info;
  entryId: string | null;
  status: string;
}

const EmploymentInfo: FC<EmploymentInfoProps> = ({
  isOpen,
  employment_info,
  entryId,
  status,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    setError,
    clearErrors
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [customReferenceDate, setCustomReferenceDate] =
    useState<boolean>(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>('');
  const [attachmentFiles, setAttachmentFiles] = useState<[]>([]);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    attachment: false,
  });

  // SET DEFAULT VALUES
  useEffect(() => {
    if (employment_info) {
      setValue('has_employees', employment_info?.has_employees);
      setValue('hiring_date', employment_info?.hiring_date);
      setValue('employees_no', employment_info?.employees_no);
      setValue('reference_date', employment_info?.reference_date);
    }
  }, [employment_info, setValue]);

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entryId,
          active_tab: 'capital_information',
          active_step: 'share_details',
          employment_info: {
            ...data,
            reference_date: customReferenceDate
              ? data?.reference_date
              : moment(`12/31/${new Date().getFullYear()}`).format(
                  'YYYY-MM-DD'
                ),
            step: 'employment_info',
          },
        })
      );

      // SET ACTIVE TAB AND STEP
      let active_tab = 'capital_information';
      let active_step = 'share_details';

      if (
        ['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) ||
        isLoading?.amend
      ) {
        active_tab = 'preview_submission';
        active_step = 'preview_submission';
      }

      dispatch(setBusinessCompletedStep('employment_info'));
      dispatch(setBusinessActiveStep(active_step));
      dispatch(setBusinessActiveTab(active_tab));

      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  // ATTACHMENT COLUMNS
  const attachmentColumns = [
    ...attachmentFileColumns,
    {
      header: 'action',
      accesorKey: 'action',
      cell: ({ row }: {
        row: {
          original: {
            name: string;
          };
        };
      }) => {
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
                      setAttachmentFiles([]);
                      setValue('attachment', null);
                      setError('attachment', {
                        type: 'manual',
                        message: 'Supporting documents are required is required',
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
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={disableForm} className="flex flex-col w-full gap-6">
          <Controller
            name="reference_date"
            control={control}
            rules={{
              required: customReferenceDate
                ? 'Account reference date is required'
                : false,
            }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  {customReferenceDate ? (
                    <menu className="flex flex-col gap-2">
                      <Input
                        type="date"
                        required
                        label="Account reference date"
                        {...field}
                      />
                      {errors?.reference_date && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.reference_date?.message)}
                        </p>
                      )}
                      <ul className="flex flex-col gap-1">
                        <p className="text-[13px]">Supporting documents</p>
                        <Input
                          label="Supporting documents"
                          multiple
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              setAttachmentFiles((prev) => [...prev, ...files]);
                            }
                          }}
                        />
                        {errors?.attachment && (
                          <p className="text-red-600 text-[13px]">
                            {String(errors?.attachment?.message)}
                          </p>
                        )}
                        <Link
                          to={'#'}
                          className="text-primary text-[12px] hover:underline cursor-pointer w-fit"
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentFiles([]);
                            setCustomReferenceDate(false);
                            clearErrors('attachment');
                          }}
                        >
                          Use default date
                        </Link>
                      </ul>
                    </menu>
                  ) : (
                    <menu className="flex flex-col gap-2">
                      <label className="flex flex-col gap-2">
                        <p className="flex items-center gap-1">
                          Account reference date{' '}
                          <span className="text-red-600">*</span>
                        </p>
                        <p className="text-[14px] p-1 px-2 bg-secondary text-white w-fit rounded-md">
                          31st December
                        </p>
                      </label>
                      <ul className="flex flex-col items-start gap-1">
                        <p className="text-[11px] text-secondary">
                          The default date for account reference dates is
                          determined by the National Bank of Rwanda. Click the
                          button below to use a custom date. Supporting
                          documents are required.
                        </p>
                        <Link
                          to={'#'}
                          onClick={(e) => {
                            e.preventDefault();
                            setCustomReferenceDate(true);
                          }}
                          className="text-primary text-[12px] hover:underline cursor-pointer"
                        >
                          Click here
                        </Link>{' '}
                      </ul>
                    </menu>
                  )}
                  {errors?.reference_date && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.reference_date?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="has_employees"
            control={control}
            defaultValue={employment_info?.has_employees}
            rules={{ required: 'Select a choice' }}
            render={({ field }) => {
              return (
                <menu className="flex flex-col w-full gap-3">
                  <h4 className="flex items-center gap-1 text-[15px]">
                    Does the company have employees?{' '}
                    <span className="text-red-600">*</span>
                  </h4>
                  <ul className="flex items-center gap-6">
                    <Input
                      type="radio"
                      label="Yes"
                      defaultChecked={watch('has_employees') === 'yes'}
                      name={field?.name}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(field?.name, 'yes');
                        }
                      }}
                    />
                    <Input
                      type="radio"
                      label="No"
                      name={field?.name}
                      defaultChecked={watch('has_employees') === 'no'}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(field?.name, 'no');
                        }
                      }}
                    />
                  </ul>
                  {errors?.has_employees && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.has_employees?.message)}
                    </p>
                  )}
                </menu>
              );
            }}
          />
          <menu
            className={`${
              watch('has_employees') === 'yes' ? 'flex' : 'hidden'
            } w-full items-start gap-5 flex-wrap`}
          >
            <Controller
              name="hiring_date"
              control={control}
              defaultValue={employment_info?.hiring_date}
              rules={{
                required:
                  watch('has_employees') === 'yes'
                    ? 'Hiring date is required'
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      defaultValue={employment_info?.hiring_date}
                      type="date"
                      required
                      label="Hiring Date"
                      {...field}
                    />
                    {errors?.hiring_date && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.hiring_date?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="employees_no"
              defaultValue={employment_info?.employees_no}
              rules={{
                required:
                  watch('has_employees') === 'yes'
                    ? 'Number of employees is required'
                    : false,
                validate: (value) => {
                  if (watch('has_employees') === 'yes') {
                    if (!value) return 'Number of employees is required';
                    if (value < 1)
                      return 'Number of employees must be greater than 0';
                  }
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      required
                      label="Number of employees"
                      defaultValue={employment_info?.employees_no}
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger('employees_no');
                      }}
                    />
                    {errors?.employees_no && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.employees_no?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-center w-full gap-6">
            {attachmentFiles?.length > 0 && (
              <Table
                data={
                  attachmentFiles?.length > 0 &&
                  attachmentFiles?.map((file: File) => {
                    return {
                      name: file?.name,
                      type: file?.type,
                      size: file?.size,
                      // source: capitalizeString(file?.source),
                    };
                  })
                }
                columns={attachmentColumns}
                showFilter={false}
                showPagination={false}
              />
            )}
          </menu>
          {[
            'IN_PREVIEW',
            'ACTION_REQUIRED',
            'IS_AMENDING',
            'IN_PROGRESS',
          ].includes(status) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('executive_management'));
                }}
              />
              {status === 'IS_AMENDING' && (
                <Button
                  value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                  onClick={() => {
                    setIsLoading({
                      ...isLoading,
                      amend: true,
                      submit: false,
                      preview: false,
                    });
                  }}
                  submit
                />
              )}
              {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) && (
                <Button
                  value={
                    isLoading?.preview ? <Loader /> : 'Save & Complete Review'
                  }
                  onClick={() => {
                    setIsLoading({
                      ...isLoading,
                      preview: true,
                      submit: false,
                      amend: false,
                    });
                  }}
                  submit
                  primary
                  disabled={disableForm}
                />
              )}
              <Button
                value={isLoading?.submit ? <Loader /> : 'Save & Continue'}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors).length > 0) return;
                  setIsLoading({
                    ...isLoading,
                    submit: true,
                    preview: false,
                    amend: false,
                  });
                  dispatch(
                    setUserApplications({ entryId, status: 'IN_PROGRESS' })
                  );
                }}
                submit
                primary
                disabled={disableForm}
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
                  dispatch(setBusinessActiveStep('executive_management'));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('share_details'));
                  dispatch(setBusinessActiveTab('capital_information'));
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

export default EmploymentInfo;
