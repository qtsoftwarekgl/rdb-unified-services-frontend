import { Controller, FieldValues, useForm } from 'react-hook-form';
import UserLayout from '../../../containers/UserLayout';
import { AppDispatch, RootState } from '../../../states/store';
import { useSelector } from 'react-redux';
import Select from '../../../components/inputs/Select';
import Input from '../../../components/inputs/Input';
import { dormancyReasons } from '../../../constants/businessRegistration';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchBusinessesThunk, uploadAmendmentAttachmentThunk } from '@/states/features/businessSlice';
import { attachmentColumns } from '@/constants/business.constants';
import Table from '@/components/table/Table';
import { ColumnDef } from '@tanstack/react-table';
import { BusinessAttachment } from '@/types/models/attachment';
import ViewDocument from '@/pages/user-company-details/ViewDocument';
import { useDeclareBusinessDormancyMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';

const CompanyDormancy = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File>
  >([]);
  const {
    businessesIsFetching,
    businessesList,
    uploadAmendmentAttachmentIsLoading,
    uploadAmendmentAttachmentIsSuccess,
  } = useSelector((state: RootState) => state.business);
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string>('');

  // NAVIGATE
  const navigate = useNavigate();

  // FETCH BUSINESSES
  useEffect(() => {
    dispatch(fetchBusinessesThunk({ page: 1, size: 100 }));
  }, [dispatch]);

  // INITIATE DECLARE BUSINESS DORMANCY MUTATION
  const [
    declareBusinessDormancy,
    {
      isLoading: businessDormancyIsLoading,
      isSuccess: businessDormancyIsSuccess,
      isError: businessDormancyIsError,
      error: businessDormancyError,
      data: businessDormancyData,
    },
  ] = useDeclareBusinessDormancyMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    declareBusinessDormancy({
      businessId: data?.businessId,
      dormantDeclarationDate: data?.dormantDeclarationDate,
      dormantStartDate: data?.dormantStartDate,
      dormantReason: data?.dormantReason,
    });
  };

  // HANDLE BUSINESS DORMANCY DECLARATION RESPONSE
  useEffect(() => {
    if (businessDormancyIsSuccess) {
      Array.from(attachmentFiles)?.forEach((element) => {
        dispatch(
          uploadAmendmentAttachmentThunk({
            businessId: watch('businessId'),
            fileName: element?.name,
            file: element,
            amendmentId: businessDormancyData?.data?.id,
          })
        );
      });
    } else if (businessDormancyIsError) {
      toast.error(
        (businessDormancyError as ErrorResponse)?.data?.message ||
          'An error occurred while declaring company dormancy. Refresh and try again'
      );
    }
  }, [
    attachmentFiles,
    businessDormancyData,
    businessDormancyError,
    businessDormancyIsError,
    businessDormancyIsSuccess,
    dispatch,
    navigate,
    watch,
  ]);

  // HANDLE AMENDMENT ATTACHMENT UPLOAD RESPONSE
  useEffect(() => {
    if (uploadAmendmentAttachmentIsSuccess) {
      toast.success('Company dormancy declared successfully');
      navigate('/services');
    }
  }, [
    dispatch,
    navigate,
    uploadAmendmentAttachmentIsSuccess,
    uploadAmendmentAttachmentIsLoading,
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
                setPreviewAttachmentUrl(
                  URL.createObjectURL(
                    (
                      row?.original as unknown as {
                        file: File;
                      }
                    )?.file as unknown as Blob
                  )
                );
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
                      attachmentFile?.name !== row?.original?.fileName
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
      <main className="bg-white p-6 rounded-md w-full flex flex-col gap-5">
        <h1 className="uppercase text-lg font-semibold text-center">
          Declare company dormancy
        </h1>
        <form
          className="w-[90%] mx-auto flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid grid-cols-2 gap-5 w-full">
            <Controller
              name="businessId"
              control={control}
              rules={{ required: 'Select a company to close' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <Select
                      label="Select company"
                      required
                      options={businessesList?.map((business) => {
                        return {
                          value: business?.id,
                          label: businessesIsFetching
                            ? '....'
                            : (
                                business?.companyName ||
                                business?.enterpriseName ||
                                business?.branchName
                              )?.toUpperCase(),
                        };
                      })}
                      {...field}
                      placeholder="Select company to close"
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
                <Controller
                  name="dormantDeclarationDate"
                  rules={{
                    required: 'Date of dormant declaration is required',
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          type="date"
                          required
                          label="Date of dormant resolution"
                          {...field}
                        />
                        {errors?.dormantDeclarationDate && (
                          <p className="text-[13px] text-red-500">
                            {String(errors?.dormantDeclarationDate?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="dormantStartDate"
                  rules={{ required: 'Start date of dormancy is required' }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          type="date"
                          required
                          label="Start date of dormancy"
                          {...field}
                        />
                        {errors?.dormantStartDate && (
                          <p className="text-[13px] text-red-500">
                            {String(errors?.dormantStartDate?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="dormantReason"
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Select
                          label="Dormancy reason"
                          options={dormancyReasons}
                          {...field}
                          placeholder="Select dormancy reason"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.dormantReason && (
                          <p className="text-[13px] text-red-500">
                            {String(errors?.dormantReason?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <section className={`w-full flex flex-col gap-2`}>
                  <h1 className="text-[14px] uppercase font-medium flex items-center gap-1">
                    Attachment <span className="text-red-600">*</span>
                  </h1>
                  <Controller
                    control={control}
                    name="attachments"
                    rules={{ required: 'Attach at least one document' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            type="file"
                            required
                            multiple
                            accept="application/pdf"
                            onChange={(e) => {
                              field.onChange(e?.target?.files);
                              if ((e?.target?.files?.length ?? 0) > 0) {
                                setAttachmentFiles((prev) => [
                                  ...prev,
                                  ...Array.from(e?.target?.files ?? []),
                                ]);
                              }
                            }}
                          />
                          {errors?.attachments && (
                            <p className="text-red-500 text-[13px]">
                              {String(errors?.attachments.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </section>
              </>
            )}
          </fieldset>
          {attachmentFiles?.length > 0 && (
            <menu className='flex flex-col gap-4 w-full'>
              <Table
              columns={
                attachmentExtendedColumns as ColumnDef<BusinessAttachment>[]
              }
              data={(Array.from(attachmentFiles) ?? [])?.map(
                (attachmentFile) => {
                  return {
                    file: (attachmentFile as File),
                    attachmentType: 'Declaration of dormancy',
                    size: attachmentFile?.size,
                    fileName: attachmentFile?.name,
                    attachmentUrl: (
                      attachmentFile as unknown as BusinessAttachment
                    )?.attachmentUrl,
                  };
                }
              )}
            />
            {uploadAmendmentAttachmentIsLoading && <Loader className='text-primary' />}
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
              value={businessDormancyIsLoading ? <Loader /> : 'Submit'}
              primary
              submit
              disabled={!watch('businessId')}
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

export default CompanyDormancy;
