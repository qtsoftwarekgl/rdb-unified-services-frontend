import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import Button from "../../../../components/inputs/Button";
import Loader from "../../../../components/Loader";
import { RDBAdminEmailPattern } from "../../../../constants/Users";
import { businessId } from "@/types/models/business";
import {
  useLazyFetchBusinessAttachmentsQuery,
  useUploadBusinessAttachmentMutation,
} from "@/states/api/coreApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addBusinessAttachment,
  setBusinessAttachments,
} from "@/states/features/businessPeopleSlice";
import { useLazyGetBusinessDetailsQuery } from "@/states/api/businessRegApiSlice";
import { setBusinessDetails } from "@/states/features/businessSlice";
import BusinessPeopleAttachments from "../../domestic-business-registration/BusinessPeopleAttachments";

interface CompanyAttachmentsProps {
  businessId: businessId;
}

const CompanyAttachments = ({ businessId }: CompanyAttachmentsProps) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  const { businessAttachments } = useSelector(
    (state: RootState) => state.businessPeople
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
      if ((uploadBusinessAttachmentError as ErrorResponse).status === 500)
        toast.error(
          "An error occurred while uploading attachments. Please try again later."
        );
      else {
        toast.error(
          (uploadBusinessAttachmentError as ErrorResponse)?.data?.message
        );
      }
    } else if (uploadBusinessAttachmentIsSuccess) {
      // TO DO
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

  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const { businessDetails } = useSelector((state: RootState) => state.business);

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      isLoading: businessIsLoading,
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
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while fetching business details. Please try again later."
        );
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
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

  // INITIALIZE FETC BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isLoading: businessAttachmentsIsLoading,
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
      if ((businessAttachmentsError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while fetching business attachments. Please try again later."
        );
      } else {
        toast.error((businessAttachmentsError as ErrorResponse)?.data?.message);
      }
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

  return (
    <main className="flex flex-col w-full gap-8">
      {businessAttachmentsIsLoading ||
        (businessIsLoading && (
          <figure className="flex items-center justify-center">
            <Loader />
          </figure>
        ))}
      <form onSubmit={handleSubmit(() => {})}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <section
            className={`${
              businessDetails?.hasArticlesOfAssociation ? "flex" : "hidden"
            } w-full flex flex-col gap-3`}
          >
            <h1 className="text-lg font-medium uppercase">Company Details</h1>
            <Controller
              name="articles_of_association"
              rules={{
                required: "Upload company articles of association",
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-2">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p className="flex items-center gap-1">
                        Article of association{" "}
                        <span className="text-red-600">*</span>
                      </p>
                      <Input
                        label="Articles of association"
                        type="file"
                        required
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
          <section className="flex flex-col w-full gap-3">
            <h1 className="text-lg font-medium uppercase">
              Required attachments
            </h1>
            <Controller
              name="certificationOfIncorporation"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p>
                        Certification of incorporation{" "}
                        <span className="text-red-600">*</span>
                      </p>
                      <Input
                        type="file"
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          if (e.target.files?.[0])
                            uploadHelper(
                              e.target.files?.[0] as File,
                              "Certification of Incorporation"
                            );
                        }}
                      />
                    </ul>
                    {errors?.certificationOfIncorporation && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.certificationOfIncorporation?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="resolution"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p>
                        Resolution attachment{" "}
                        <span className="text-red-600">*</span>
                      </p>
                      <Input
                        type="file"
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          if (e.target.files?.[0])
                            uploadHelper(
                              e.target.files?.[0] as File,
                              "Resolution Attachment"
                            );
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
            <Controller
              name="licensesOfBusinessActivities"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p>
                        Licenses of business activities{" "}
                        <span className="text-red-600">*</span>
                      </p>
                      <Input
                        type="file"
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          if (e.target.files?.[0])
                            uploadHelper(
                              e.target.files?.[0] as File,
                              "Licenses of Business Activities"
                            );
                        }}
                      />
                    </ul>
                    {errors?.licensesOfBusinessActivities && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.licensesOfBusinessActivities?.message)}
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
              name="attachments"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-3">
                    <ul className="flex items-center justify-between w-full gap-3">
                      <p>Other attachments</p>
                      <Input
                        type="file"
                        className="!w-fit"
                        name={field?.name}
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          if (e.target.files?.[0])
                            uploadHelper(
                              e.target.files?.[0] as File,
                              "Other Attachments"
                            );
                        }}
                      />
                    </ul>
                  </label>
                );
              }}
            />
          </section>
          {uploadBusinessAttachmentIsLoading && (
            <ul className="flex flex-col items-center gap-3">
              <ul className="flex items-center gap-2">
                <Loader className="text-primary" />
                Uploading attachment...
              </ul>
            </ul>
          )}
          {businessAttachments?.length > 0 && (
            <BusinessPeopleAttachments attachments={businessAttachments} />
          )}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setForeignBusinessActiveStep("executive_management"));
                dispatch(setForeignBusinessActiveTab("management"));
              }}
            />
            <Button
              value={"Save & Continue"}
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setForeignBusinessActiveStep("preview_submission"));
                dispatch(setForeignBusinessActiveTab("preview_submission"));
              }}
              disabled={isFormDisabled}
            />
          </menu>
        </fieldset>
      </form>
    </main>
  );
};

export default CompanyAttachments;
