/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { setUserApplications } from '../../../../states/features/userApplicationSlice';
import { business_company_details } from '../general-information/CompanyDetails';
import Table from '../../../../components/table/Table';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import ViewDocument from '../../../user-company-details/ViewDocument';
import { previewUrl } from '../../../../constants/authentication';
import { capitalizeString } from '../../../../helpers/strings';
import Modal from '../../../../components/Modal';

export interface business_company_attachments {
  name: string;
  size: number;
  type: string;
}

interface CompanyAttachmentsProps {
  isOpen: boolean;
  company_attachments: business_company_attachments[];
  entryId: string | null;
  company_details: business_company_details;
  status: string;
}

const CompanyAttachments: FC<CompanyAttachmentsProps> = ({
  isOpen,
  company_attachments = [],
  entryId,
  company_details,
  status,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    trigger,
    clearErrors,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState({
    submit: false,
    amend: false,
    isSubmitting: false,
  });
  const [attachmentFiles, setAttachmentFiles] = useState<
    FileList | Array<File> | unknown
  >([]);
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>('');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    attachment: boolean;
    first_name?: string;
    last_name?: string;
    row_name: string;
  }>({
    attachment: false,
    row_name: '',
  });

  // SET DEFAULT ATTACHMENTS
  useEffect(() => {
    if (Object?.keys(company_attachments).length) {
      if (Object.keys(company_attachments?.articles_of_association)?.length) {
        setAttachmentFiles([
          ...attachmentFiles,
          company_attachments?.articles_of_association,
        ]);
      }
      if (Object.keys(company_attachments?.resolution)?.length) {
        setAttachmentFiles([
          ...attachmentFiles,
          company_attachments?.resolution,
        ]);
      }
      if (company_attachments?.shareholder_attachments?.length) {
        setAttachmentFiles([
          ...attachmentFiles,
          ...company_attachments?.shareholder_attachments,
        ]);
      }
      if (company_attachments?.others?.length) {
        setAttachmentFiles([
          ...attachmentFiles,
          ...company_attachments?.others,
        ]);
      }
    }
  }, [company_attachments]);

  // HANDLE FORM SUBMIT
  const onSubmit = async (data: FieldValues) => {
    await trigger();
    if (Object.keys(errors).length > 0) {
      setIsLoading({
        submit: false,
        amend: false,
        isSubmitting: false,
      });
      return;
    }

    setIsLoading({
      submit: isLoading?.isSubmitting ? true : false,
      amend:
        status === 'IS_AMENDING' && !isLoading?.isSubmitting ? true : false,
      isSubmitting: false,
    });

    setTimeout(() => {
      dispatch(
        setUserApplications({
          entryId,
          active_tab: 'preview_submission',
          active_step: 'preview_submission',
          company_attachments: {
            articles_of_association: {
              name: data?.articles_of_association?.name,
              size: data?.articles_of_association?.size,
              type: data?.articles_of_association?.type,
            },
            resolution: {
              name: data?.resolution?.name,
              size: data?.resolution?.size,
              type: data?.resolution?.type,
            },
            shareholder_attachments:
              data?.shareholder_attachments &&
              JSON.parse(data?.shareholder_attachments)?.map(
                (file: File) => file
              ),
            others:
              data?.attachments &&
              JSON.parse(data?.attachments)?.map((file: File) => file),
          },
        })
      );
      dispatch(setBusinessCompletedStep('attachments'));
      dispatch(setBusinessActiveStep('preview_submission'));
      dispatch(setBusinessActiveTab('preview_submission'));
      setIsLoading({
        submit: false,
        amend: false,
      });
    }, 1000);
    return data;
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: 'File name',
      accessorKey: 'name',
    },
    {
      header: 'File size',
      accessorKey: 'size',
    },
    {
      header: 'File type',
      accessorKey: 'type',
    },
    {
      header: 'File source',
      accessorKey: 'source',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              icon={faEye}
              className="text-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.02] font-bold text-[16px]"
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
                  row_name: row?.original?.name,
                });
              }}
            />
            <Modal
              isOpen={
                confirmDeleteModal?.attachment &&
                confirmDeleteModal?.row_name === row?.original?.name
              }
              onClose={() => {
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  attachment: false,
                });
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium text-center uppercase">
                  Are you sure you want to delete {row?.original?.name}
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
                        Array.from(attachmentFiles as FileList)?.filter(
                          (
                            file:
                              | File
                              | {
                                  name: string;
                                  file: {
                                    name: string;
                                    size: number;
                                    type: string;
                                  };
                                  source: string;
                                }
                          ) =>
                            (file?.name || file?.file?.name) !==
                            row?.original?.name
                        )
                      );
                      if (row?.original?.source === 'Articles Of Association') {
                        setError('articles_of_association', {
                          type: 'manual',
                          message: 'Upload company articles of association',
                        });
                      }
                      if (row?.original?.source === 'Resolution') {
                        setError('resolution', {
                          type: 'manual',
                          message: 'Resolution is required',
                        });
                      }
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
    <main className="flex flex-col w-full gap-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <section
            className={`${
              company_details?.articles_of_association === 'yes'
                ? 'flex'
                : 'hidden'
            } w-full flex flex-col gap-3`}
          >
            <h1 className="text-lg font-medium uppercase">Company Details</h1>
            <Controller
              name="articles_of_association"
              rules={{
                required:
                  company_details?.articles_of_association === 'yes' &&
                  !watch('articles_of_association') &&
                  !company_attachments?.length
                    ? 'Upload company articles of association'
                    : false,
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-2">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="flex items-center w-full gap-1">
                        Article of association{' '}
                        <span className="text-red-600">*</span>
                      </p>
                      <Input
                        label="Articles of association"
                        type="file"
                        required
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          e.preventDefault();
                          setValue(
                            'articles_of_association',
                            e?.target?.files && {
                              name: e?.target?.files[0]?.name,
                              size: e?.target?.files[0]?.size,
                              type: e?.target?.files[0]?.type,
                            }
                          );
                          clearErrors('articles_of_association');
                          setAttachmentFiles([
                            {
                              file: e?.target?.files[0],
                              source: 'articles_of_association',
                            },
                            ...attachmentFiles,
                          ]);
                        }}
                      />
                    </ul>
                    {errors?.articles_of_association && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.articles_of_association?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </section>
          <section className="flex flex-col w-full gap-3">
            <h1 className="text-lg font-medium uppercase">
              Required attachments
            </h1>
            <Controller
              name="resolution"
              rules={{
                required: !company_attachments?.resolution
                  ? 'Resolution is required'
                  : false,
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="w-full">
                        Resolution attachment{' '}
                        <span className="text-red-600">*</span>
                      </p>
                      <Input
                        type="file"
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e);
                          setValue(
                            'resolution',
                            e?.target?.files && {
                              name: e?.target?.files[0]?.name,
                              size: e?.target?.files[0]?.size,
                              type: e?.target?.files[0]?.type,
                            }
                          );
                          clearErrors('resolution');
                          setAttachmentFiles([
                            {
                              file: e?.target?.files[0],
                              source: 'resolution',
                            },
                            ...attachmentFiles,
                          ]);
                        }}
                      />
                    </ul>
                    {errors?.resolution && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.resolution?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </section>
          <section className="flex flex-col w-full gap-3">
            <h1 className="text-lg font-medium uppercase">Others</h1>
            <Controller
              name="shareholder_attachments"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="w-full">Shareholder attachments</p>
                      <Input
                        type="file"
                        className="!w-fit"
                        multiple
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e?.target?.files?.length) return;
                          const files = Array.from(e.target.files)?.map(
                            (file: File) => {
                              return {
                                name: file?.name,
                                size: file?.size,
                                type: file?.type,
                                source: 'shareholder_attachments',
                              };
                            }
                          );
                          setValue(
                            'shareholder_attachments',
                            JSON.stringify(files)
                          );
                          setAttachmentFiles([
                            ...Array.from(e.target.files).map((file: File) => {
                              return {
                                file,
                                source: 'shareholder_attachments',
                              };
                            }),
                            ...attachmentFiles,
                          ]);
                        }}
                      />
                    </ul>
                  </label>
                );
              }}
            />
            <Controller
              name="attachments"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="w-full">Other attachments</p>
                      <Input
                        type="file"
                        multiple
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!e?.target?.files?.length) return;
                          const files = Array.from(e.target.files)?.map(
                            (file: File) => {
                              return {
                                name: file?.name,
                                size: file?.size,
                                type: file?.type,
                                source: 'others',
                              };
                            }
                          );
                          setValue('attachments', JSON.stringify(files));
                          setAttachmentFiles([
                            ...Array.from(e?.target?.files).map(
                              (file: File) => {
                                return {
                                  file,
                                  source: 'others',
                                };
                              }
                            ),
                            ...attachmentFiles,
                          ]);
                        }}
                      />
                    </ul>
                  </label>
                );
              }}
            />
          </section>
          <menu className="flex items-center w-full gap-6">
            {attachmentFiles?.length > 0 && (
              <Table
                data={
                  attachmentFiles?.length > 0
                    ? attachmentFiles?.map((file) => {
                        return {
                          name: file?.name || file?.file?.name,
                          type: file?.type || file?.file?.type,
                          size: file?.size || file?.file?.size,
                          source: capitalizeString(file?.source),
                        };
                      })
                    : company_attachments
                }
                columns={columns}
                showFilter={false}
                showPagination={false}
              />
            )}
          </menu>
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
                  dispatch(setBusinessActiveStep('beneficial_owners'));
                  dispatch(setBusinessActiveTab('beneficial_owners'));
                }}
              />
              {status === 'IS_AMENDING' && (
                <Button
                  disabled={disableForm || Object.keys(errors).length > 0}
                  value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                  submit
                />
              )}
              <Button
                value={isLoading?.submit ? <Loader /> : 'Save & Continue'}
                primary
                submit
                onClick={() => {
                  setIsLoading({
                    ...isLoading,
                    isSubmitting: true,
                  });
                }}
                disabled={disableForm || Object.keys(errors).length > 0}
              />
            </menu>
          )}
          {['IN_REVIEW', 'IS_APPROVED', 'PENDING_APPROVAL', 'PENDING_REJECTION'].includes(status) && (
            <menu className="flex items-center gap-3 justify-between">
              <Button
                value="Back"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('beneficial_owners'));
                  dispatch(setBusinessActiveTab('beneficial_owners'));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('preview_submission'));
                  dispatch(setBusinessActiveTab('preview_submission'));
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
    </main>
  );
};

export default CompanyAttachments;
