import { useSelector } from 'react-redux';
import UserLayout from '../../../containers/UserLayout';
import { AppDispatch, RootState } from '../../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import Input from '../../../components/inputs/Input';
import Table from '../../../components/table/Table';
import { faCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Button from '../../../components/inputs/Button';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader';
import { dissolutionReasons } from '../../../constants/amendment.constants';
import {
  fetchBusinessesThunk,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  uploadAmendmentAttachmentThunk,
} from '@/states/features/businessSlice';
import { useDispatch } from 'react-redux';
import { ColumnDef } from '@tanstack/react-table';
import { BusinessAttachment } from '@/types/models/attachment';
import { attachmentColumns } from '@/constants/business.constants';
import ViewDocument from '@/pages/user-company-details/ViewDocument';
import { useCloseCompanyMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import CustomTooltip from '@/components/inputs/CustomTooltip';

const CloseCompany = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessesList,
    businessesIsFetching,
    uploadAmendmentAttachmentIsLoading,
    uploadAmendmentAttachmentIsSuccess,
  } = useSelector((state: RootState) => state.business);
  const [attachmentFiles, setAttachmentFiles] = useState<
    {
      file: File;
      attachmentType: string;
      size: number;
      fileName: string;
      attachmentUrl: string;
    }[]
  >([]);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string>('');

  // NAVIGATE
  const navigate = useNavigate();

  // FETCH BUSINESSES
  useEffect(() => {
    dispatch(fetchBusinessesThunk({ page: 1, size: 100 }));
  }, [dispatch]);

  // INITIALIZE CLOSE COMPANY MUTATION
  const [
    closeCompany,
    {
      data: closeCompanyData,
      error: closeCompanyError,
      isLoading: closeCompanyIsLoading,
      isError: closeCompanyIsError,
      isSuccess: closeCompanyIsSuccess,
      reset: resetCloseCompany,
    },
  ] = useCloseCompanyMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    closeCompany({
      businessId: data?.businessId,
      dissolutionDate: data?.dissolutionDate,
      dissolutionReason: data?.dissolutionReason,
      resolutionDate: data?.resolutionDate || data?.dissolutionDate,
      resolutionReason: data?.resolutionReason || data?.dissolutionReason,
    });
  };

  // HANDLE CLOSE COMPANY RESPONSE
  useEffect(() => {
    if (closeCompanyIsSuccess) {
      Array.from(attachmentFiles)?.forEach((attachmentFile) => {
        dispatch(
          uploadAmendmentAttachmentThunk({
            file: attachmentFile?.file,
            businessId: watch('businessId'),
            amendmentId: closeCompanyData?.data?.id,
            fileName: attachmentFile?.fileName,
            attachmentType: attachmentFile?.attachmentType,
          })
        );
      });
    } else if (closeCompanyIsError) {
      toast.error(
        (closeCompanyError as ErrorResponse)?.data?.message ||
          'An error occurred while closing company. Refresh and try again'
      );
    }
  }, [
    attachmentFiles,
    closeCompanyData,
    closeCompanyError,
    closeCompanyIsError,
    closeCompanyIsSuccess,
    dispatch,
    navigate,
    watch,
  ]);

  useEffect(() => {
    if (
      uploadAmendmentAttachmentIsSuccess &&
      closeCompanyIsSuccess &&
      attachmentFiles?.length > 0
    ) {
      toast.success('Company closed successfully');
      dispatch(setUploadAmendmentAttachmentIsSuccess(false));
      dispatch(setUploadAmendmentAttachmentIsLoading(false));
      setAttachmentFiles([]);
      resetCloseCompany();
      navigate('/services');
    }
  }, [
    uploadAmendmentAttachmentIsSuccess,
    navigate,
    dispatch,
    attachmentFiles,
    closeCompanyIsSuccess,
    resetCloseCompany,
  ]);

  // TABLE COLUMNS
  const attachmentExtendedColumns = [
    ...attachmentColumns,
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({
        row,
      }: {
        row: {
          original: BusinessAttachment;
        };
      }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
                setPreviewAttachmentUrl(row?.original?.attachmentUrl);
              }}
            />
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                setAttachmentFiles(
                  Array.from(attachmentFiles)?.filter(
                    (attachmentFile) =>
                      attachmentFile?.fileName !== row?.original?.fileName
                  )
                );
              }}
            />
          </menu>
        );
      },
    },
  ];

  const closeCompanyAttachments = [
    {
      label: 'Shareholder resolution',
      name: 'shareHolderResolution',
      required: true,
    },
    {
      label: 'RRA De-registration certificate',
      name: 'rraDeRegistrationCertificate',
      required: true,
    },
    {
      label: 'Evidence of publication',
      name: 'evidenceOfPublication',
      required: false,
    },
    {
      label: 'Solvency Test',
      name: 'solvencyTest',
      required: false,
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-5 p-6 rounded-md bg-white">
        <h1 className="uppercase text-lg font-semibold text-center">
          Request closing of company
        </h1>
        <form
          className="w-[90%] mx-auto flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex flex-col w-full gap-5">
            <Controller
              name="businessId"
              control={control}
              rules={{ required: 'Select a business to close' }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-2">
                    <Select
                      label="Select business"
                      required
                      options={businessesList?.map((business) => {
                        return {
                          label: businessesIsFetching
                            ? '....'
                            : (
                                business?.companyName ||
                                business?.enterpriseName ||
                                business?.branchName
                              )?.toUpperCase(),
                          value: business?.id,
                        };
                      })}
                      {...field}
                      placeholder="Select business"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.businessId && (
                      <p className="text-[13px] text-red-500">
                        {String(errors?.businessId?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch('businessId') && (
              <>
                <menu className="grid grid-cols-2 w-full gap-5">
                  <Controller
                    name="dissolutionDate"
                    rules={{ required: 'Dissolution date is required' }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            type="date"
                            label="Date of dissolution"
                            {...field}
                          />
                          {errors?.dissolutionDate && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.dissolutionDate?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="dissolutionReason"
                    control={control}
                    rules={{ required: 'Dissolution reason is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Select
                            {...field}
                            placeholder="Select dissolution reason"
                            label="Dissolution reason"
                            options={dissolutionReasons}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          {errors?.dissolutionReason && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.dissolutionReason?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="resolutionDate"
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            type="date"
                            label="Date of resolution (optional)"
                            {...field}
                          />
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="resolutionReason"
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Select
                            {...field}
                            placeholder="Select resolution reason"
                            label="Resolution reason (optional)"
                            options={dissolutionReasons}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </label>
                      );
                    }}
                  />
                </menu>
                <section className={`w-full flex flex-col gap-3`}>
                  <h1 className="text-md uppercase font-semibold flex items-center gap-1">
                    Attachments <span className="text-red-600">*</span>
                  </h1>
                  <menu className="grid grid-cols-2 gap-5 w-full">
                    {closeCompanyAttachments.map((attachment, index) => {
                      return (
                        <Controller
                          key={index}
                          name={attachment?.name}
                          control={control}
                          rules={{
                            required: attachment?.required
                              ? `${attachment?.label} is required`
                              : false,
                          }}
                          render={({ field }) => {
                            return (
                              <label className="w-full flex flex-col gap-1">
                                <p className="flex items-center gap-2">
                                  {attachment?.label}{' '}
                                  {!attachment?.required ? (
                                    '(optional)'
                                  ) : (
                                    <span className="text-red-600">*</span>
                                  )}
                                  {attachmentFiles?.find(
                                    (file) =>
                                      file?.attachmentType === attachment?.label
                                  ) && (
                                    <CustomTooltip label="File has been added successfully">
                                      <FontAwesomeIcon
                                        icon={faCircleCheck}
                                        className="text-primary cursor-pointer"
                                      />
                                    </CustomTooltip>
                                  )}
                                </p>
                                <Input
                                  type="file"
                                  label={attachment.label}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (
                                      e?.target?.files != null &&
                                      e?.target?.files?.length > 0
                                    ) {
                                      const file = e?.target?.files[0];
                                      if (file != null) {
                                        setAttachmentFiles((prev) => [
                                          ...prev,
                                          {
                                            file: file,
                                            attachmentType: attachment?.label,
                                            size: file?.size,
                                            fileName: file?.name,
                                            attachmentUrl:
                                              URL.createObjectURL(file),
                                          },
                                        ]);
                                      }
                                    }
                                  }}
                                />
                                {errors?.[attachment?.name] && (
                                  <p className="text-red-500 text-[13px]">
                                    {String(
                                      errors?.[attachment?.name]?.message
                                    )}
                                  </p>
                                )}
                              </label>
                            );
                          }}
                        />
                      );
                    })}
                  </menu>
                </section>
              </>
            )}
          </fieldset>
          {attachmentFiles?.length > 0 && (
            <menu className="flex flex-col gap-4 w-full">
              <Table
                columns={
                  attachmentExtendedColumns as ColumnDef<{
                    file: File;
                    attachmentType: string;
                    size: number;
                    fileName: string;
                    attachmentUrl: string;
                  }>[]
                }
                data={(Array.from(attachmentFiles) ?? [])?.map(
                  (attachmentFile) => {
                    return {
                      file: attachmentFile?.file as File,
                      attachmentType: attachmentFile?.attachmentType,
                      size: attachmentFile?.size,
                      fileName: attachmentFile?.fileName,
                      attachmentUrl: (
                        attachmentFile as unknown as BusinessAttachment
                      )?.attachmentUrl,
                    };
                  }
                )}
              />
              {uploadAmendmentAttachmentIsLoading && (
                <figure className="flex items-center gap-2 w-full justify-center">
                  <Loader className="text-primary" />
                  <p className="text-[14px]">Uploading attachment(s)...</p>
                </figure>
              )}
            </menu>
          )}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                navigate('/services');
              }}
            />
            <Button
              value={
                closeCompanyIsLoading || uploadAmendmentAttachmentIsLoading ? (
                  <Loader />
                ) : (
                  'Submit'
                )
              }
              primary
              submit
              disabled={
                closeCompanyIsLoading || uploadAmendmentAttachmentIsLoading
              }
            />
          </menu>
        </form>
      </main>
      {previewAttachmentUrl && (
        <ViewDocument
          documentUrl={previewAttachmentUrl}
          setDocumentUrl={setPreviewAttachmentUrl}
        />
      )}
    </UserLayout>
  );
};

export default CloseCompany;
