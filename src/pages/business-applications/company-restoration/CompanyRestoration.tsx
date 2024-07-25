import { Controller, FieldValues, useForm } from "react-hook-form";
import UserLayout from "../../../containers/UserLayout";
import Select from "../../../components/inputs/Select";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import Table from "../../../components/table/Table";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import { ErrorResponse, useNavigate } from "react-router-dom";
import { attachmentColumns } from "@/constants/business.constants";
import { BusinessAttachment } from "@/types/models/attachment";
import { useDispatch } from "react-redux";
import {
  fetchBusinessesThunk,
  setUploadAmendmentAttachmentIsLoading,
  setUploadAmendmentAttachmentIsSuccess,
  uploadAmendmentAttachmentThunk,
} from "@/states/features/businessSlice";
import CustomTooltip from "@/components/inputs/CustomTooltip";
import { ColumnDef } from "@tanstack/react-table";
import ViewDocument from "@/pages/user-company-details/ViewDocument";
import { useRestoreBusinessMutation } from "@/states/api/businessRegApiSlice";
import { toast } from "react-toastify";

const CompanyRestoration = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  // NAVIGATION
  const navigate = useNavigate();

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
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState<string>("");
  const {
    businessesList,
    businessesIsFetching,
    uploadAmendmentAttachmentIsLoading,
    uploadAmendmentAttachmentIsSuccess,
  } = useSelector((state: RootState) => state.business);

  // FETCH BUSINESSES
  useEffect(() => {
    dispatch(
      fetchBusinessesThunk({
        page: 1,
        size: 100,
        applicationStatus: "APPROVED",
      })
    );
  }, [dispatch]);

  // INITIALIZE RESTORE BUSINESS MUTATION
  const [
    restoreBusiness,
    {
      isLoading: restoreBusinessIsLoading,
      isSuccess: restoreBusinessIsSuccess,
      isError: restoreBusinessIsError,
      error: restoreBusinessError,
      reset: restoreBusinessReset,
      data: restoreBusinessData,
    },
  ] = useRestoreBusinessMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    restoreBusiness({
      businessId: data?.businessId,
    });
  };

  // HANDLE RESTORE BUSINESS RESPONSE
  useEffect(() => {
    if (restoreBusinessIsSuccess) {
      attachmentFiles?.forEach((attachmentFile) => {
        dispatch(
          uploadAmendmentAttachmentThunk({
            businessId: watch("businessId"),
            attachmentType: attachmentFile?.attachmentType,
            file: attachmentFile?.file,
            fileName: attachmentFile?.fileName,
            amendmentId: restoreBusinessData?.data?.id,
          })
        );
      });
    } else if (restoreBusinessIsError) {
      toast.error(
        (restoreBusinessError as ErrorResponse)?.data?.message ||
          "An error occurred while restoring business. Refresh and try again"
      );
    }
  }, [
    attachmentFiles,
    dispatch,
    restoreBusinessData,
    restoreBusinessError,
    restoreBusinessIsError,
    restoreBusinessIsSuccess,
    watch,
  ]);

  // HANDLE UPLOAD AMENDMENT ATTACHMENT RESPONSE
  useEffect(() => {
    if (
      uploadAmendmentAttachmentIsSuccess &&
      restoreBusinessIsSuccess &&
      attachmentFiles?.length > 0
    ) {
      toast.success("Business restoration request submitted successfully");
      restoreBusinessReset();
      dispatch(setUploadAmendmentAttachmentIsSuccess(false));
      dispatch(setUploadAmendmentAttachmentIsLoading(false));
      setAttachmentFiles([]);
      navigate("/services");
    }
  }, [
    attachmentFiles?.length,
    dispatch,
    navigate,
    restoreBusinessIsSuccess,
    restoreBusinessReset,
    uploadAmendmentAttachmentIsSuccess,
  ]);

  // TABLE COLUMNS
  const attachmentExtendedColumns = [
    ...attachmentColumns,
    {
      header: "Action",
      accessorKey: "action",
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

  // BUSINESS RESTORATION ATTACHMENTS
  const businessRestorationAttachments = [
    {
      label: "Restoration resolution",
      name: "restorationResolution",
      required: true,
    },
    {
      label: "Proof of publication",
      name: "proofOfPublication",
      required: true,
    },
    {
      label: "Court Order",
      name: "courtOrder",
      required: false,
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 p-6 bg-white rounded-md">
        <h1 className="text-lg font-semibold text-center uppercase text-primary">
          Company restoration
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-[90%] mx-auto"
        >
          <Controller
            control={control}
            name="businessId"
            rules={{ required: "Select business to open new branch" }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Select
                    label="Select business"
                    required
                    options={businessesList?.map((business) => {
                      return {
                        label: businessesIsFetching
                          ? "...."
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
          {watch("businessId") && (
            <section className={`w-full flex flex-col gap-2 mt-2`}>
              <h1 className="flex items-center gap-2 font-medium uppercase text-md">
                Attachments <span className="text-red-600">*</span>
              </h1>
              <menu className="grid w-full grid-cols-2 gap-5">
                {businessRestorationAttachments.map((attachment, index) => {
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
                          <label className="flex flex-col w-full gap-1">
                            <p className="flex items-center gap-2">
                              {attachment?.label}{" "}
                              {!attachment?.required ? (
                                "(optional)"
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
                                    className="cursor-pointer text-primary"
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
            <menu className="flex flex-col w-full gap-4">
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
                <figure className="flex items-center justify-center w-full gap-2">
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
                navigate("/services");
              }}
            />
            <Button
              disabled={
                restoreBusinessIsLoading || uploadAmendmentAttachmentIsLoading
              }
              value={
                restoreBusinessIsLoading ||
                uploadAmendmentAttachmentIsLoading ? (
                  <Loader />
                ) : (
                  "Submit"
                )
              }
              primary
              submit
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

export default CompanyRestoration;
