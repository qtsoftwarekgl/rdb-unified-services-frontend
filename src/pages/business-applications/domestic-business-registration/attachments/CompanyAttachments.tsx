import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import { Controller, useForm } from "react-hook-form";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setBusinessCompletedTab,
} from "../../../../states/features/businessRegistrationSlice";
import Button from "../../../../components/inputs/Button";
import { businessId } from "@/types/models/business";
import {
  useLazyFetchBusinessAttachmentsQuery,
  useUploadBusinessAttachmentMutation,
} from "@/states/api/businessRegApiSlice";
import { useSelector } from "react-redux";
import Input from "@/components/inputs/Input";
import { toast } from "react-toastify";
import {
  addBusinessAttachment,
  setBusinessAttachments,
} from "@/states/features/businessSlice";
import { ErrorResponse } from "react-router-dom";
import { useEffect, useState } from "react";
import BusinessPeopleAttachments from "../BusinessPeopleAttachments";
import Loader from "@/components/Loader";
import { BusinessAttachment } from "@/types/models/attachment";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CompanyAttachmentsProps = {
  businessId: businessId;
  status: string;
};

// DOMESTIC BUSINESS REGISTRATION - COMPANY ATTACHMENTS
const domesticBusinessRegistrationAttachments = [
  {
    label: "Resolution",
    name: "resolution",
    type: "file",
    required: true,
  },
  {
    label: "Shareholder attachments",
    name: "shareholderAttachments",
    type: "file",
    required: false,
  },
];

const CompanyAttachments = ({
  businessId,
  status,
}: CompanyAttachmentsProps) => {
  // REACT HOOK FORM
  const { control } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { business } = useSelector((state: RootState) => state.business);
  const { businessAttachments } = useSelector(
    (state: RootState) => state.business
  );
  const [selectedAttachment, setSelectedAttachment] = useState<string>("");

  // INITIALIZE UPLOAD BUSINESS ATTACHMENT
  const [
    uploadBusinessAttachment,
    {
      data: uploadBusinessAttachmentData,
      isLoading: uploadBusinessAttachmentIsLoading,
      error: uploadBusinessAttachmentError,
      isSuccess: uploadBusinessAttachmentIsSuccess,
      isError: uploadBusinessAttachmentIsError,
    },
  ] = useUploadBusinessAttachmentMutation();

  // UPLOAD HELDER
  const uploadHelper = (file: File, attachmentType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("businessId", String(businessId));
    formData.append("attachmentType", attachmentType);
    formData.append("fileName", file?.name);
    uploadBusinessAttachment({ formData });
  };

  // HANDLE UPLOAD BUSINESS ATTACHMENT RESPONSE
  useEffect(() => {
    if (uploadBusinessAttachmentIsError) {
      const errorMessage =
        (uploadBusinessAttachmentError as ErrorResponse)?.data?.message ||
        "An error occurred while uploading attachments. Please try again later.";
      toast.error(errorMessage);
    } else if (uploadBusinessAttachmentIsSuccess) {
      toast.success("Attachments uploaded successfully");
      dispatch(addBusinessAttachment(uploadBusinessAttachmentData?.data));
    }
  }, [
    businessId,
    dispatch,
    uploadBusinessAttachmentData,
    uploadBusinessAttachmentError,
    uploadBusinessAttachmentIsError,
    uploadBusinessAttachmentIsSuccess,
  ]);

  // INITIALIZE FETCH BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isFetching: businessAttachmentsIsFetching,
      error: businessAttachmentsError,
      isSuccess: businessAttachmentsIsSuccess,
      isError: businessAttachmentsIsError,
    },
  ] = useLazyFetchBusinessAttachmentsQuery();

  // FETCH BUSINESS ATTACHMENTS
  useEffect(() => {
    if (businessId) {
      fetchBusinessAttachments({ businessId });
    }
  }, [businessId, fetchBusinessAttachments]);

  // HANDLE FETCH BUSINESS ATTACHMENTS RESPONSE
  useEffect(() => {
    if (businessAttachmentsIsError) {
      const errorMessage =
        (businessAttachmentsError as ErrorResponse)?.data?.message ||
        "An error occurred while fetching business attachments. Please try again later.";
      toast.error(errorMessage);
    } else if (businessAttachmentsIsSuccess) {
      dispatch(setBusinessAttachments(businessAttachmentsData?.data));
    }
  }, [
    businessAttachmentsData,
    businessAttachmentsError,
    businessAttachmentsIsError,
    businessAttachmentsIsSuccess,
    dispatch,
  ]);

  return (
    <main className="flex flex-col w-full gap-8">
      <form className="flex flex-col w-full gap-6">
        <fieldset className="flex flex-col w-full gap-6">
          {business?.hasArticlesOfAssociation && (
            <section className="flex items-center justify-between w-full gap-3">
              <h1 className="w-full">
                Articles of association{" "}
                {businessAttachments.some(
                  (attachment: BusinessAttachment) =>
                    attachment.attachmentType === "Articles of association"
                ) && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="cursor-pointer text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info(
                        `Articles of association uploaded successfully!`
                      );
                    }}
                  />
                )}{" "}
                <span className="text-red-600">*</span>
              </h1>
              <Controller
                name="articlesOfAssociation"
                control={control}
                rules={{
                  required: "Attach the business' articles of association",
                }}
                render={({ field }) => {
                  return (
                    <label className="flex items-center justify-end w-full gap-3">
                      <Input
                        type="file"
                        accept="application/pdf"
                        required
                        {...field}
                        onChange={(e) => {
                          if (e?.target?.files?.[0]) {
                            setSelectedAttachment("Articles of association");
                            uploadHelper(
                              e?.target?.files?.[0],
                              "Articles of association"
                            );
                          }
                        }}
                      />
                    </label>
                  );
                }}
              />
            </section>
          )}
          {domesticBusinessRegistrationAttachments?.map(
            ({ label, name, required }, index: number) => {
              return (
                <section
                  key={index}
                  className="flex items-center justify-between w-full gap-3"
                >
                  <h1 className="w-full">
                    {`${label} ${!required ? "(optional)" : ""}`}{" "}
                    {required && <span className="text-red-600">*</span>}
                    {businessAttachments.some(
                      (attachment: BusinessAttachment) =>
                        attachment.attachmentType === label
                    ) && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="cursor-pointer text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info(`${label} uploaded successfully!`);
                        }}
                      />
                    )}
                  </h1>
                  <Controller
                    name={name}
                    control={control}
                    rules={{
                      required: required
                        ? `Attach the business' ${label}`
                        : false,
                    }}
                    render={({ field }) => {
                      return (
                        <label className="flex items-center justify-end w-full gap-3">
                          <Input
                            type="file"
                            accept="application/pdf"
                            required={required}
                            {...field}
                            onChange={(e) => {
                              if (e?.target?.files?.[0]) {
                                setSelectedAttachment(label);
                                uploadHelper(e?.target?.files?.[0], label);
                              } else {
                                toast.error("No file selected");
                              }
                            }}
                          />
                        </label>
                      );
                    }}
                  />
                </section>
              );
            }
          )}
        </fieldset>
        {uploadBusinessAttachmentIsLoading && (
          <ul className="flex flex-col items-center gap-3">
            <ul className="flex items-center gap-2">
              <Loader className="text-primary" />
              Uploading {selectedAttachment}
            </ul>
          </ul>
        )}
        {businessAttachmentsIsFetching ? (
          <figure className="flex items-center gap-3 w-full min-h-[20vh]">
            <Loader className="text-primary" />
            Fetching business attachments...
          </figure>
        ) : (
          businessAttachments?.length > 0 && (
            <BusinessPeopleAttachments attachments={businessAttachments} />
          )
        )}
        {[
          "IN_PROGRESS",
          "IS_AMENDING",
          "IN_PREVIEW",
          "ACTION_REQUIRED",
        ].includes(status) && (
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep("beneficial_owners"));
                dispatch(setBusinessActiveTab("beneficial_owners"));
              }}
            />
            <Button
              value={"Save & Continue"}
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessCompletedStep("attachments"));
                dispatch(setBusinessCompletedTab("attachments"));
                dispatch(setBusinessActiveStep("preview_submission"));
                dispatch(setBusinessActiveTab("preview_submission"));
              }}
            />
          </menu>
        )}
        {[
          "IN_REVIEW",
          "IS_APPROVED",
          "PENDING_APPROVAL",
          "PENDING_REJECTION",
        ].includes(status) && (
          <menu className="flex items-center justify-between gap-3">
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep("beneficial_owners"));
                dispatch(setBusinessActiveTab("beneficial_owners"));
              }}
            />
            <Button
              value="Next"
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessCompletedStep("attachments"));
                dispatch(setBusinessCompletedTab("attachments"));
                dispatch(setBusinessActiveStep("preview_submission"));
                dispatch(setBusinessActiveTab("preview_submission"));
              }}
            />
          </menu>
        )}
      </form>
    </main>
  );
};

export default CompanyAttachments;
