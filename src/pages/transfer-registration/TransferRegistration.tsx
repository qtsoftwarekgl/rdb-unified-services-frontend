import { Controller, FieldValues, useForm } from 'react-hook-form';
import UserLayout from '../../containers/UserLayout';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import Table from '../../components/table/Table';
import { useEffect, useState } from 'react';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { attachmentColumns } from '@/constants/business.constants';
import { BusinessAttachment } from '@/types/models/attachment';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { AppDispatch, RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  fetchBusinessesThunk,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  uploadAmendmentAttachmentThunk,
} from '@/states/features/businessSlice';
import TextArea from '@/components/inputs/TextArea';
import Loader from '@/components/Loader';
import { ColumnDef } from '@tanstack/react-table';
import ViewDocument from '../user-company-details/ViewDocument';
import { formatDate } from '@/helpers/strings';
import { useTransferBusinessRegistrationMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';

const TransferRegistration = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
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
  const {
    businessesList,
    businessesIsFetching,
    uploadAmendmentAttachmentIsLoading,
    uploadAmendmentAttachmentIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // NAVIGATION
  const navigate = useNavigate();

  // FETCH BUSINESSES
  useEffect(() => {
    dispatch(
      fetchBusinessesThunk({
        page: 1,
        size: 100,
        applicationStatus: 'APPROVED',
      })
    );
  }, [dispatch]);

  // INITIALIZE TRANSFER BUSINESS REGISTRATION
  const [
    transferBusinessRegistration,
    {
      isLoading: transferBusinessRegistrationIsLoading,
      isSuccess: transferBusinessRegistrationIsSuccess,
      isError: transferBusinessRegistrationIsError,
      error: transferBusinessRegistrationError,
      reset: resetTransferBusinessRegistration,
      data: transferBusinessRegistrationData,
    },
  ] = useTransferBusinessRegistrationMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    transferBusinessRegistration({
      businessId: data?.businessId,
      transferDate: formatDate(data?.transferDate),
      transferReason: data?.transferReason,
    });
  };

  // HANDLE TRANSFER BUSINESS REGISTRATION RESPONSE
  useEffect(() => {
    if (transferBusinessRegistrationIsSuccess) {
      attachmentFiles?.forEach((attachmentFile) => {
        dispatch(
          uploadAmendmentAttachmentThunk({
            file: attachmentFile?.file,
            attachmentType: 'Transfer of registration',
            businessId: watch('businessId'),
            fileName: attachmentFile?.fileName,
            amendmentId: transferBusinessRegistrationData?.data?.id,
          })
        );
      });
    } else if (transferBusinessRegistrationIsError) {
      const errorResponse =
        (transferBusinessRegistrationError as ErrorResponse)?.data?.message ||
        'An error occurred while processing your request. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    attachmentFiles,
    dispatch,
    resetTransferBusinessRegistration,
    transferBusinessRegistrationData,
    transferBusinessRegistrationError,
    transferBusinessRegistrationIsError,
    transferBusinessRegistrationIsSuccess,
    watch,
  ]);

  // HANDLE UPLOAD ATTACHMENT RESPONSE
  useEffect(() => {
    if (
      uploadAmendmentAttachmentIsSuccess &&
      transferBusinessRegistrationIsSuccess &&
      attachmentFiles?.length > 0
    ) {
      toast.success('Transfer of registration submitted successfully');
      resetTransferBusinessRegistration();
      setAttachmentFiles([]);
      dispatch(setUploadAmendmentAttachmentIsLoading(false));
      dispatch(setUploadAmendmentAttachmentIsSuccess(false));
      navigate('/services');
    }
  }, [
    attachmentFiles?.length,
    dispatch,
    navigate,
    resetTransferBusinessRegistration,
    transferBusinessRegistrationIsSuccess,
    uploadAmendmentAttachmentIsSuccess,
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

  return (
    <UserLayout>
      <main className="flex flex-col gap-4 w-full bg-white rounded-md p-6">
        <h1 className="uppercase text-primary font-semibold text-lg text-center">
          Transfer of Registarion
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[90%] mx-auto flex flex-col gap-4"
        >
          <fieldset className="grid grid-cols-2 gap-5 w-full">
            <Controller
              control={control}
              name="businessId"
              rules={{ required: 'Select business to open new branch' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
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
                                business?.enterpriseBusinessName ||
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
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.businessId?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch('businessId') && (
              <>
                <Controller
                  name="transferDate"
                  control={control}
                  rules={{ required: 'Tranfer date is required' }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          type="date"
                          label="Transfer date"
                          required
                          {...field}
                        />
                        {errors?.transferDate && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.transferDate?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="transferReason"
                  rules={{ required: 'Transfer reason is required' }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <TextArea
                          label="Transfer reason"
                          required
                          {...field}
                          placeholder="Select transfer reason"
                        />
                      </label>
                    );
                  }}
                />
                <section className={`w-full flex flex-col gap-2 mt-2`}>
                  <h1 className="text-md uppercase font-medium flex items-center gap-2">
                    Attachments <span className="text-red-600">*</span>
                  </h1>
                  <menu className="grid grid-cols-2 gap-5 w-full">
                    <Controller
                      name={'attachment'}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="w-full flex flex-col gap-1">
                            <p className="flex items-center gap-2">
                              Attachments (optional)
                            </p>
                            <Input
                              type="file"
                              multiple
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if ((e.target.files ?? [])?.length > 0) {
                                  setAttachmentFiles(
                                    Array.from(e?.target?.files ?? [])?.map(
                                      (file) => {
                                        return {
                                          file,
                                          attachmentType:
                                            'Transfer of registration',
                                          size: file?.size,
                                          fileName: file?.name,
                                          attachmentUrl:
                                            URL.createObjectURL(file),
                                        };
                                      }
                                    )
                                  );
                                }
                              }}
                            />
                            {errors?.attachment && (
                              <p className="text-red-500 text-[13px]">
                                {String(errors?.attachment?.message)}
                              </p>
                            )}
                          </label>
                        );
                      }}
                    />
                  </menu>
                </section>
              </>
            )}
          </fieldset>
          {attachmentFiles?.length > 0 && (
            <menu className="flex flex-col gap-4 w-full">
              <Table
                showFilter={false}
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
          <menu className="w-full flex items-center gap-3 justify-between my-4">
            <Button
              value={'Cancel'}
              onClick={(e) => {
                e.preventDefault();
                navigate('/services');
              }}
            />
            <Button
              disabled={
                transferBusinessRegistrationIsLoading ||
                uploadAmendmentAttachmentIsLoading
              }
              submit
              value={
                transferBusinessRegistrationIsLoading ||
                uploadAmendmentAttachmentIsLoading ? (
                  <Loader />
                ) : (
                  'Submit'
                )
              }
              primary
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

export default TransferRegistration;
