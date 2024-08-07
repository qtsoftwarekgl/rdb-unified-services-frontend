import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import Loader from "../../../../components/Loader";
import { businessId } from "@/types/models/business";
import {
  useLazyFetchBusinessAttachmentsQuery,
  useUploadBusinessAttachmentMutation,
} from "@/states/api/businessRegApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addBusinessAttachment,
  setBusinessAttachments,
} from "@/states/features/businessSlice";
import { useLazyGetBusinessDetailsQuery } from "@/states/api/businessRegApiSlice";
import { setBusinessDetails } from "@/states/features/businessSlice";
import BusinessPeopleAttachments from "../../domestic-business-registration/BusinessPeopleAttachments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { BusinessAttachment } from "@/types/models/attachment";
import { completeNavigationFlowThunk, createNavigationFlowThunk } from "@/states/features/navigationFlowSlice";
import { findNavigationFlowByStepName, findNavigationFlowMassIdByStepName } from "@/helpers/business.helpers";

interface CompanyAttachmentsProps {
  businessId: businessId;
  applicationStatus: string;
}

const attachmentFields = [
  {
    name: "certificationOfIncorporation",
    label: "Certification of incorporation",
    required: true,
    attachmentType: "Certification of Incorporation",
  },
  {
    name: "resolution",
    label: "Resolution attachment",
    required: true,
    attachmentType: "Resolution Attachment",
  },
  {
    name: "licensesOfBusinessActivities",
    label: "Licenses of business activities",
    required: true,
    attachmentType: "Licenses of Business Activities",
  },
  {
    name: "other_attachments",
    label: "Other attachments",
    required: false,
    attachmentType: "Other Attachments",
  },
];

const CompanyAttachments = ({ businessId, applicationStatus }: CompanyAttachmentsProps) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessAttachments } = useSelector(
    (state: RootState) => state.business
  );

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

  const isFormDisabled = ['IN_REVIEW', 'APPROVED'].includes(applicationStatus);
  const { businessDetails } = useSelector((state: RootState) => state.business);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      isFetching: businessIsFetching,
      error: businessError,
      isError: businessIsError,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessDetailsQuery();

  // GET BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId });
    }
  }, [businessId, getBusinessDetails]);

  // HANDLE BUSINESS DETAILS DATA RESPONSE
  useEffect(() => {
    if (businessIsError) {
      const errorMessage =
        (businessError as ErrorResponse)?.data?.message ||
        "An error occurred while fetching business details. Please try again later.";
      toast.error(errorMessage);
    } else if (businessIsSuccess) {
      dispatch(setBusinessDetails(businessDetailsData?.data));
    }
  }, [
    businessDetailsData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
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

  const uploadHelper = (file: File, attachmentType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("businessId", String(businessId));
    formData.append("attachmentType", attachmentType);
    formData.append("fileName", file.name);
    uploadBusinessAttachment({ formData });
  };

  const onSubmit = () => {
    dispatch(
      completeNavigationFlowThunk({
        isCompleted: true,
        navigationFlowId: findNavigationFlowByStepName(
          businessNavigationFlowsList,
          'Attachments'
        )?.id,
      })
    );
    dispatch(
      createNavigationFlowThunk({
        businessId,
        massId: findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Preview & Submission'
        ),
        isActive: true,
      })
    );
  };

  return (
    <main className="flex flex-col w-full gap-8">
      {(businessAttachmentsIsFetching || businessIsFetching) && (
        <figure className="flex items-center justify-center">
          <Loader />
        </figure>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          {businessDetails?.hasArticlesOfAssociation && (
            <section className="flex flex-col w-full gap-3 ">
              <h1 className="text-lg font-medium uppercase">Company Details</h1>
              <Controller
                name="articles_of_association"
                rules={{
                  required: businessAttachments.some(
                    (attachment: BusinessAttachment) =>
                      attachment.attachmentType === "Articles of Association"
                  )
                    ? false
                    : "Upload company articles of association",
                }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-2">
                      <ul className="flex items-center justify-between w-full gap-3">
                        <p className="flex items-center gap-1">
                          Articles of association{" "}
                          <span className="text-red-600">*</span>
                          {businessAttachments.some(
                            (attachment: BusinessAttachment) =>
                              attachment.attachmentType ===
                              "Articles of Association"
                          ) && (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-primary"
                            />
                          )}
                        </p>
                        <Input
                          label="Articles of association"
                          type="file"
                          accept="application/pdf"
                          className="!w-fit"
                          name={field?.name}
                          onChange={(e) => {
                            field.onChange(e.target.files?.[0]);
                            if (e.target.files?.[0])
                              uploadHelper(
                                e.target.files?.[0] as File,
                                "Articles of Association"
                              );
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
          )}
          {attachmentFields.map(({ name, label, required, attachmentType }) => (
            <section key={name} className={`flex flex-col w-full gap-3`}>
              <h1 className="text-lg font-medium uppercase">{label}</h1>
              <Controller
                name={name}
                control={control}
                rules={
                  required
                    ? {
                        required: businessAttachments.some(
                          (attachment: BusinessAttachment) =>
                            attachment.attachmentType === attachmentType
                        )
                          ? false
                          : `Upload ${label.toLowerCase()}`,
                      }
                    : {}
                }
                render={({ field }) => (
                  <label className="flex flex-col w-full gap-2">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="flex items-center gap-1">
                        {label}{" "}
                        {required && <span className="text-red-600">*</span>}
                        {businessAttachments.some(
                          (attachment: BusinessAttachment) =>
                            attachment.attachmentType === attachmentType
                        ) && (
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-primary"
                          />
                        )}
                      </p>
                      <Input
                        type="file"
                        required={required}
                        accept="application/pdf"
                        className="!w-fit"
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          if (e.target.files?.[0])
                            uploadHelper(e.target.files[0], attachmentType);
                        }}
                      />
                    </ul>
                    {errors[name] && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors[name]?.message)}
                      </p>
                    )}
                  </label>
                )}
              />
            </section>
          ))}
          {uploadBusinessAttachmentIsLoading && (
            <ul className="flex flex-col items-center gap-3">
              <ul className="flex items-center gap-2">
                <Loader className="text-primary" />
                Uploading attachment...
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
          <menu className="flex items-center justify-between w-full gap-3 mx-auto max-sm:flex-col-reverse">
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  createNavigationFlowThunk({
                    businessId,
                    massId: findNavigationFlowMassIdByStepName(
                      navigationFlowMassList,
                      'Employment Info'
                    ),
                    isActive: true,
                  })
                );
              }}
            />
            <Button
              value={"Save & Continue"}
              primary
              submit
              disabled={isFormDisabled}
            />
          </menu>
        </fieldset>
      </form>
    </main>
  );
};

export default CompanyAttachments;
