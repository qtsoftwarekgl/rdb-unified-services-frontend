import { Controller, useForm, FieldValues } from 'react-hook-form';
import UserLayout from '../../../containers/UserLayout';
import Select from '../../../components/inputs/Select';
import Input from '../../../components/inputs/Input';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/inputs/Button';
import Table from '../../../components/table/Table';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { BusinessAttachment } from '@/types/models/attachment';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { attachmentColumns } from '@/constants/business.constants';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import {
  fetchBusinessesThunk,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  uploadAmendmentAttachmentThunk,
} from '@/states/features/businessSlice';
import { useSelector } from 'react-redux';
import TextArea from '@/components/inputs/TextArea';
import Loader from '@/components/Loader';
import { ColumnDef } from '@tanstack/react-table';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import ViewDocument from '@/pages/user-company-details/ViewDocument';
import { formatDate } from '@/helpers/strings';
import { useCessationToDormancyMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';

const CessationToDormant = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
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

  // INITIALIZE CESSATION TO DORMANCY MUTATION
  const [cessationToDormancy, {
    data: cessationToDormancyData,
    error: cessationToDormancyError,
    isLoading: cessationToDormancyIsLoading,
    isSuccess: cessationToDormancyIsSuccess,
    isError: cessationToDormancyIsError,
    reset: cessationToDormancyReset,
  }] = useCessationToDormancyMutation();

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

  const onSubmit = (data: FieldValues) => {
    cessationToDormancy({
      businessId: data?.businessId,
      resoulutionReason: data?.resolutionReason,
      resolutionStartDate: formatDate(data?.resolutionStartDate),
      resolutionEndDate: formatDate(data?.resolutionEndDate)
    });
  };

  // HANDLE CESSATION TO DORMANCY RESPONSE
  useEffect(() => {
    if (cessationToDormancyIsSuccess) {
      attachmentFiles?.forEach((attachmentFile) => {
        dispatch(
          uploadAmendmentAttachmentThunk({
            file: attachmentFile?.file,
            fileName: attachmentFile?.fileName,
            attachmentType: attachmentFile?.attachmentType,
            businessId: watch('businessId'),
            amendmentId: cessationToDormancyData?.data?.id,
          })
        );
      });
    } else if (cessationToDormancyIsError) {
      const errorResponse =
        (cessationToDormancyError as ErrorResponse)?.data?.message ||
        'An error occurred while requesting cessation to be dormant. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    attachmentFiles,
    cessationToDormancyData,
    cessationToDormancyError,
    cessationToDormancyIsError,
    cessationToDormancyIsSuccess,
    dispatch,
    navigate,
    watch,
  ]);

  // HANDLE UPLOAD ATTACHMENT RESPONSE
  useEffect(() => {
    if (uploadAmendmentAttachmentIsSuccess) {
      dispatch(setUploadAmendmentAttachmentIsLoading(false));
      dispatch(setUploadAmendmentAttachmentIsSuccess(false));
      setAttachmentFiles([]);
      cessationToDormancyReset();
      toast.success('Cessation to be dormant request submitted successfully');
      navigate('/services');
    }
  }, [
    cessationToDormancyReset,
    dispatch,
    navigate,
    uploadAmendmentAttachmentIsSuccess,
  ]);

  // CESSATION TO DORMANT ATTACHMENTS
  const cessationToDormatAttachments = [
    {
      label: 'Shareholders resolution for cessation',
      name: 'shareholdersResolution',
      required: true,
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col gap-4">
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <h1 className="text-xl font-medium uppercase text-primary text-center">
            Request cessation to be dormant
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[90%] mx-auto flex flex-col gap-4"
          >
            <fieldset className="flex flex-col gap-4 w-full">
              <Controller
                control={control}
                name="businessId"
                rules={{ required: 'Select business to open new branch' }}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
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
                <menu className="w-full grid grid-cols-2 gap-5">
                  <Controller
                    name="resolutionStartDate"
                    rules={{
                      required: 'Enter resolution start date',
                      validate: (value) => {
                        if (value > watch('resolutionEndDate')) {
                          return 'Resolution start date cannot be greater than resolution end date';
                        } else {
                          return true;
                        }
                      },
                    }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col gap-1 w-full">
                          <Input
                            label="Cessation start date"
                            required
                            type="date"
                            {...field}
                            onChange={async (e) => {
                              field.onChange(e);
                              await trigger('resolutionEndDate');
                              await trigger('resolutionStartDate');
                            }}
                          />
                          {errors?.resolutionStartDate && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.resolutionStartDate?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="resolutionEndDate"
                    control={control}
                    rules={{
                      required: 'Enter resolution end date',
                      validate: (value) => {
                        if (value < watch('resolutionStartDate')) {
                          return 'Resolution end date cannot be less than resolution start date';
                        } else {
                          return true;
                        }
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col gap-1 w-full">
                          <Input
                            label="Cessation end date"
                            required
                            type="date"
                            {...field}
                            onChange={async (e) => {
                              field.onChange(e);
                              await trigger('resolutionEndDate');
                              await trigger('resolutionStartDate');
                            }}
                          />
                          {errors?.resolutionEndDate && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.resolutionEndDate?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="resolutionReason"
                    rules={{ required: 'Resolution reason is required' }}
                    render={({ field }) => (
                      <label className="flex flex-col gap-1">
                        <TextArea
                          label="Reason for cessation"
                          placeholder="Enter reason for cessation"
                          required
                          {...field}
                        />
                        {errors?.resolutionReason && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.resolutionReason?.message)}
                          </p>
                        )}
                      </label>
                    )}
                  />
                </menu>
              )}
            </fieldset>
            {watch('businessId') && (
              <section className={`w-full flex flex-col gap-2 mt-2`}>
                <h1 className="text-md uppercase font-medium flex items-center gap-2">
                  Attachments <span className="text-red-600">*</span>
                </h1>
                <menu className="grid grid-cols-2 gap-5 w-full">
                  {cessationToDormatAttachments.map((attachment, index) => {
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
                                  {String(errors?.[attachment?.name]?.message)}
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
            )}
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
            <menu className="flex items-center justify-between w-full gap-3 my-4">
              <Button
                value={'Cancel'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
              />
              <Button
                disabled={
                  cessationToDormancyIsLoading ||
                  uploadAmendmentAttachmentIsLoading
                }
                value={
                  cessationToDormancyIsLoading ||
                  uploadAmendmentAttachmentIsLoading ? (
                    <Loader />
                  ) : (
                    'Submit'
                  )
                }
                primary
                submit
              />
            </menu>
          </form>
        </section>
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

export default CessationToDormant;
