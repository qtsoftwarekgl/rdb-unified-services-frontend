/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Loader from "../../../../components/Loader";
import Input from "../../../../components/inputs/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { countriesList } from "../../../../constants/countries";
import Button from "../../../../components/inputs/Button";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../../../constants/Users";
import ViewDocument from "../../../user-company-details/ViewDocument";
import validateInputs from "../../../../helpers/validations";
import OTPVerificationCard from "@/components/cards/OTPVerificationCard";
import { businessId } from "@/types/models/business";
import {
  useCreateManagementOrBoardMemberMutation,
  useDeleteManagementOrBoardMemberMutation,
  useLazyFetchManagementOrBoardMembersQuery,
} from "@/states/api/foreignCompanyRegistrationApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addExecutiveManager,
  setExecutiveManagersList,
} from "@/states/features/executiveManagerSlice";
import BusinessPeopleTable from "../../domestic-business-registration/management/BusinessPeopleTable";
import { maskPhoneDigits } from "@/helpers/strings";
import { useLazyGetUserInformationQuery } from "@/states/api/externalServiceApiSlice";
import {
  addBusinessPersonAttachment,
  setBusinessPeopleAttachments,
  setUserInformation,
} from "@/states/features/businessPeopleSlice";
import { useUploadPersonAttachmentMutation } from "@/states/api/coreApiSlice";
import { genderOptions } from "@/constants/inputs.constants";
import BusinessPeopleAttachments from "../../domestic-business-registration/BusinessPeopleAttachments";
import ConfirmModal from "@/components/confirm-modal/ConfirmModal";
import { PersonDetail } from "@/types/models/personDetail";

interface ExecutiveManagementProps {
  businessId: businessId;
  applicationStatus: string;
}

const ExecutiveManagement = ({
  businessId,
  applicationStatus,
}: ExecutiveManagementProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    setValue,
    clearErrors,
    reset,
    trigger,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user.email);
  const [previewAttachment, setPreviewAttachment] = useState<string>("");
  const [showVerifyphoneNumber, setShowVerifyphoneNumber] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<PersonDetail>();
  const { userInformation } = useSelector(
    (state: RootState) => state.businessPeople
  );
  const { executiveManagersList } = useSelector(
    (state: RootState) => state.executiveManager
  );
  const { businessPeopleAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );

  // INITIALIZE GET USER INFORMATION QUERY
  const [
    getUserInformation,
    {
      data: userInformationData,
      error: userInformationError,
      isFetching: userInformationIsFetching,
      isSuccess: userInformationIsSuccess,
      isError: userInformationIsError,
    },
  ] = useLazyGetUserInformationQuery();

  // HANDLE GET USER INFORMATION RESPONSE
  useEffect(() => {
    if (userInformationIsError) {
      if ((userInformationError as ErrorResponse).status === 500) {
        toast.error("An error occured while fetching user information");
      } else {
        toast.error((userInformationError as ErrorResponse)?.data?.message);
      }
    } else if (userInformationIsSuccess) {
      dispatch(setUserInformation(userInformationData?.data));
    }
  }, [
    dispatch,
    reset,
    userInformationData,
    userInformationError,
    userInformationIsError,
    userInformationIsSuccess,
  ]);

  // HANDLE SET USER INFORMATION
  useEffect(() => {
    if (userInformation && Object.keys(userInformation).length) {
      reset({
        position: watch("position"),
        personIdentType: "nid",
        personDocNo: watch("personDocNo"),
        firstName: userInformation?.foreName,
        lastName: userInformation?.surnames,
        gender: userInformation?.gender,
        nationality: userInformation?.nationality,
        persDocIssuePlace: userInformation?.nationality,
        isFromNida: true,
      });
    }
  }, [reset, userInformation, watch]);

  // INITIALIZE CREATE MANAGEMENT PEOPLE
  const [
    createManagementMember,
    {
      data: createManagementMemberData,
      error: createManagementMemberError,
      isLoading: createManagementMemberIsLoading,
      isError: createManagementMemberIsError,
      isSuccess: createManagementMemberIsSuccess,
    },
  ] = useCreateManagementOrBoardMemberMutation();

  // INITIALIZE UPLOAD PERSON ATTACHMENT MUTATION
  const [
    uploadPersonAttachment,
    {
      data: uploadAttachmentData,
      error: uploadAttachmentError,
      isLoading: uploadAttachmentIsLoading,
      isSuccess: uploadAttachmentIsSuccess,
      isError: uploadAttachmentIsError,
    },
  ] = useUploadPersonAttachmentMutation();

  // HANDLE SUMBIT
  const onSubmit = (data: FieldValues) => {
    createManagementMember({ ...data, businessId });
  };

  // HANDLE CREATE MANAGEMENT MEMBER RESPONSE
  useEffect(() => {
    if (createManagementMemberIsError) {
      if ((createManagementMemberError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while creating member. Please try again later"
        );
      } else {
        toast.error(
          (createManagementMemberError as ErrorResponse).data?.message
        );
      }
    } else if (createManagementMemberIsSuccess) {
      if (watch("nationality") !== "RW") {
        const formData = new FormData();
        formData.append("file", attachmentFile as File);
        formData.append("personId", createManagementMemberData?.data?.id);
        formData.append("attachmentType", "passport");
        formData.append("businessId", String(businessId));
        formData.append("fileName", String(attachmentFile?.name));
        uploadPersonAttachment({ formData });
      } else {
        reset({
          position: "",
          personIdentType: "",
          documentNumber: "",
          personDocNo: "",
          persDocIssueDate: "",
          persDocExpiryDate: "",
          dateOfBirth: "",
          firstName: "",
          middleName: "",
          lastName: "",
        });
        dispatch(setUserInformation(undefined));
      }
      dispatch(addExecutiveManager(createManagementMemberData?.data));
    }
  }, [
    dispatch,
    createManagementMemberData,
    createManagementMemberError,
    createManagementMemberIsError,
    createManagementMemberIsSuccess,
    reset,
    businessId,
    uploadPersonAttachment,
  ]);

  // HANDLE UPLOAD PERSON ATTACHMENT RESPONSE
  useEffect(() => {
    if (uploadAttachmentIsError) {
      if ((uploadAttachmentError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occured while uploading attachment. Please try again"
        );
      } else {
        toast.error((uploadAttachmentError as ErrorResponse)?.data?.message);
      }
    } else if (uploadAttachmentIsSuccess) {
      toast.success("Person added successfully");
      reset({
        position: "",
        personIdentType: "",
        documentNumber: "",
        personDocNo: "",
        persDocIssueDate: "",
        persDocExpiryDate: "",
        dateOfBirth: "",
        firstName: "",
        middleName: "",
        lastName: "",
      });
      setAttachmentFile(null);
      dispatch(setBusinessPeopleAttachments([]));
    }
  }, [
    dispatch,
    reset,
    uploadAttachmentData,
    uploadAttachmentError,
    uploadAttachmentIsError,
    uploadAttachmentIsSuccess,
  ]);

  // INITIALIZE FETCH MANAGEMENT OR BOARD PEOPLE QUERY
  const [
    fetchManagementMember,
    {
      data: managementMemberData,
      error: managementMemberError,
      isLoading: managementMemberIsLoading,
      isError: managementMemberIsError,
      isSuccess: managementMemberIsSuccess,
    },
  ] = useLazyFetchManagementOrBoardMembersQuery();

  // INITIALIZE DELETE MANAGEMENT MEMBER
  const [
    deleteManagementMember,
    {
      error: deleteManagementMemberError,
      isLoading: deleteManagementMemberIsLoading,
      isError: deleteManagementMemberIsError,
      isSuccess: deleteManagementMemberIsSuccess,
    },
  ] = useDeleteManagementOrBoardMemberMutation();

  const handleDeleteManagementMember = () => {
    if (memberToDelete) deleteManagementMember({ id: memberToDelete.id });
  };
  // HANDLE DELETE MANAGEMENT RESPONSE

  useEffect(() => {
    if (deleteManagementMemberIsError) {
      if ((deleteManagementMemberError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while deleting member. Please try again later"
        );
      } else {
        toast.error(
          (deleteManagementMemberError as ErrorResponse).data?.message
        );
      }
    } else if (deleteManagementMemberIsSuccess) {
      toast.success("Member deleted successfully");
      fetchManagementMember({
        businessId,
        route: "management",
      });
      setMemberToDelete(undefined);
    }
  }, [
    businessId,
    deleteManagementMemberError,
    deleteManagementMemberIsError,
    deleteManagementMemberIsSuccess,
  ]);

  // FETCH MANAGEMENT PEOPLE
  useEffect(() => {
    if (!businessId) return;
    fetchManagementMember({
      businessId,
      route: "management",
    });
  }, [
    businessId,
    fetchManagementMember,
    managementMemberData,
    managementMemberError,
    managementMemberIsSuccess,
  ]);

  // HANDLE MANAGEMENT PEOPLE RESPONSE
  useEffect(() => {
    if (managementMemberIsError) {
      if ((managementMemberError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching people. Please try again later"
        );
      } else {
        toast.error((managementMemberError as ErrorResponse).data?.message);
      }
    } else if (managementMemberIsSuccess) {
      dispatch(setExecutiveManagersList(managementMemberData?.data));
    }
  }, [
    dispatch,
    managementMemberData?.data,
    managementMemberError,
    managementMemberIsSuccess,
    managementMemberIsError,
  ]);

  // CLEAR FORM
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    if (watch("personIdentType") === "passport") {
      setValue("nationality", "");
      setValue("phoneNumber", "");
      setValue("streetNumber", "");
      setValue("firstName", "");
      setValue("middleName", "");
      setValue("lastName", "");
      setValue("gender", "");
      setValue("email", "");
      setValue("attachment", "");
      setValue("personDocNo", "");
    }
  }, [setValue, watch("personIdentType"), watch]);

  return (
    <section className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
            <Controller
              name="position"
              rules={{ required: "Select member's position" }}
              control={control}
              render={({ field }) => {
                const options = [
                  {
                    value: "md/gm/ceo",
                    label: "MD/GM/CEO",
                  },
                  {
                    value: "secretary",
                    label: "Secretary",
                  },
                ];
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Select
                      label="Select position"
                      required
                      options={options}
                      {...field}
                      placeholder="Select position"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.position && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.position?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <ul
              className={`${
                watch("position") ? "flex" : "hidden"
              } items-start w-full gap-6`}
            >
              <Controller
                name="personIdentType"
                rules={{ required: "Select document type" }}
                control={control}
                render={({ field }) => {
                  const options = [
                    { value: "nid", label: "National ID" },
                    { label: "Passport", value: "passport" },
                  ];
                  return (
                    <label
                      className={`flex flex-col gap-1 w-full items-start ${
                        watch("personIdentType") !== "nid" && "!w-[49%]"
                      }`}
                    >
                      <Select
                        options={options}
                        label="Document Type"
                        required
                        placeholder="Select document type"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
              {watch("personIdentType") === "nid" && (
                <Controller
                  control={control}
                  name="personDocNo"
                  rules={{
                    required: watch("personIdentType")
                      ? "Document number is required"
                      : false,
                    validate: (value) => {
                      if (watch("personIdentType") !== "nid") return;
                      return (
                        validateInputs(value, "nid") ||
                        "National ID must be 16 characters long"
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-full gap-2">
                        <Input
                          required
                          suffixIcon={faSearch}
                          suffixIconHandler={async (e) => {
                            e.preventDefault();
                            if (!field.value) {
                              setError("personDocNo", {
                                type: "manual",
                                message: "Document number is required",
                              });
                              return;
                            }
                            getUserInformation({ documentNumber: field.value });
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger("personDocNo");
                          }}
                        />
                        {userInformationIsFetching && (
                          <ul className="flex items-center gap-2">
                            <Loader className="text-primary" />
                            <p className="text-[13px]">
                              Fetching user information...
                            </p>
                          </ul>
                        )}
                        {errors?.personDocNo && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.personDocNo?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
              {watch("personIdentType") === "passport" && (
                <Controller
                  name="personDocNo"
                  rules={{
                    required: "Passport number is required",
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label
                        className={`flex flex-col gap-1 w-full items-start ${
                          watch("personIdentType") !== "nid" && "!w-[49%]"
                        }`}
                      >
                        <Input
                          required
                          placeholder="Passport number"
                          label="Passport number"
                          {...field}
                        />
                        {errors?.personDocNo && (
                          <span className="text-sm text-red-500">
                            {String(errors?.personDocNo?.message)}
                          </span>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            </ul>
          </menu>
          <section
            className={`${
              watch("personIdentType") === "nid" ||
              watch("personIdentType") === "passport"
                ? "flex"
                : "hidden"
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      placeholder="First name"
                      label="First name"
                      {...field}
                    />
                    {errors?.firstName && (
                      <span className="text-sm text-red-500">
                        {String(errors?.firstName?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      placeholder="Middle name"
                      label="Middle name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      placeholder="Last name"
                      label="Last name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="gender"
              defaultValue={watch("gender")}
              rules={{
                required:
                  watch("personIdentType") === "passport"
                    ? "Select gender"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-2 items-start w-[49%]">
                    <Select
                      options={genderOptions}
                      label="Sex"
                      required
                      {...field}
                    />
                    {errors?.gender && (
                      <span className="text-red-500 text-[13px]">
                        {String(errors?.gender?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: "Phone number is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    {watch("personIdentType") === "passport" ? (
                      <Input
                        label="Phone number"
                        required
                        type="tel"
                        {...field}
                      />
                    ) : (
                      <Select
                        label="Phone number"
                        required
                        placeholder="Select phone number"
                        options={userInformation?.phones?.map((phone) => {
                          return {
                            label: maskPhoneDigits(phone?.msidn),
                            value: phone?.msidn,
                          };
                        })}
                        {...field}
                      />
                    )}
                    {errors?.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phoneNumber?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="email"
              rules={{
                required: "Email address is required",
                validate: (value) => {
                  return validateInputs(value, "email");
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Input
                      {...field}
                      placeholder="Enter email address"
                      label="Email"
                      required
                    />
                    {errors?.email && (
                      <p className="text-[13px] text-red-600">
                        {String(errors.email.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch("personIdentType") !== "nid" ? (
              <Controller
                name="nationality"
                control={control}
                rules={{ required: "Nationality is required" }}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1 items-start">
                      <Select
                        {...field}
                        placeholder="Select country"
                        label="Country"
                        options={countriesList?.map((country) => {
                          return {
                            ...country,
                            label: country.name,
                            value: country?.code,
                          };
                        })}
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger("nationality");
                        }}
                      />
                      {errors?.nationality && (
                        <p className="text-sm text-red-500">
                          {String(errors?.nationality?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            ) : (
              <Controller
                control={control}
                name="streetNumber"
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input
                        label="Street Name"
                        placeholder="Street name"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            )}
            {watch("personIdentType") === "passport" && (
              <menu className="flex flex-col items-start w-full gap-3 my-3 max-md:items-center">
                <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                  Passport copy <span className="text-red-600">*</span>
                </h3>
                <menu className="flex gap-4">
                  <Controller
                    name="attachment"
                    rules={{ required: "Passport is required" }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                          <Input
                            type="file"
                            accept="application/pdf"
                            className="!w-fit max-sm:!w-full"
                            onChange={(e) => {
                              field.onChange(e?.target?.files?.[0]);
                              setAttachmentFile(e?.target?.files?.[0]);
                              dispatch(
                                addBusinessPersonAttachment({
                                  attachmentType: e.target.files?.[0]?.type,
                                  fileName: e.target.files?.[0]?.name,
                                  fileSize: e.target.files?.[0]?.size,
                                })
                              );
                            }}
                          />
                          <ul className="flex flex-col items-center w-full gap-3">
                            {uploadAttachmentIsLoading && (
                              <ul className="flex items-center gap-2">
                                <Loader className="text-primary" />
                                Uploading attachment...
                              </ul>
                            )}
                          </ul>
                          {errors?.attachment && (
                            <p className="text-sm text-red-500">
                              {String(errors?.attachment?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
              </menu>
            )}
          </section>
          <section className="flex flex-col w-full gap-2">
            <BusinessPeopleAttachments
              attachments={businessPeopleAttachments}
            />
          </section>
          <section className="flex items-center justify-end w-full">
            <Button
              submit
              value={
                createManagementMemberIsLoading ? <Loader /> : "Add position"
              }
              primary
              disabled={isFormDisabled}
            />
          </section>
          <section className={`flex members-table flex-col w-full`}>
            <BusinessPeopleTable
              businessPeopleList={executiveManagersList}
              isLoading={managementMemberIsLoading}
              type="executiveManagement"
              setDeleteAction={setMemberToDelete}
            />
            {errors?.submit && (
              <p className="text-red-500 text-[15px] text-center">
                {String(errors?.submit?.message)}
              </p>
            )}
          </section>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setForeignBusinessActiveStep("business_activity_vat"));
                dispatch(setForeignBusinessActiveTab("general_information"));
              }}
            />
            {applicationStatus === "IS_AMENDING" && (
              <Button
                value={"Complete Amendment"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setForeignBusinessActiveTab("foreign_preview_submission")
                  );
                }}
              />
            )}
            {["IN_PREVIEW", "ACTION_REQUIRED"].includes(applicationStatus) && (
              <Button
                value="Save & Complete Review"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  if (!executiveManagersList?.length) {
                    setError("board_of_directors", {
                      type: "manual",
                      message: "Add at least one board member",
                    });
                    setTimeout(() => {
                      clearErrors("board_of_directors");
                    }, 4000);
                    return;
                  }
                  dispatch(
                    setForeignBusinessCompletedStep("executive_management")
                  );
                  dispatch(setForeignBusinessActiveTab("preview_submission"));
                }}
              />
            )}
            <Button
              value="Save & Continue"
              primary
              onClick={(e) => {
                e.preventDefault();
                if (!executiveManagersList?.length) {
                  setError("submit", {
                    type: "manual",
                    message: "Add at least one member",
                  });
                  setTimeout(() => {
                    clearErrors("submit");
                  }, 5000);
                  return;
                }
                dispatch(
                  setUserApplications({ businessId, status: "IN_PROGRESS" })
                );
                dispatch(
                  setForeignBusinessCompletedStep("executive_management")
                );
                dispatch(setForeignBusinessActiveStep("board_of_directors"));
              }}
            />
          </menu>
        </fieldset>
      </form>
      {previewAttachment && (
        <ViewDocument
          documentUrl={previewAttachment}
          setDocumentUrl={setPreviewAttachment}
        />
      )}
      {
        <ConfirmModal
          isOpen={!!memberToDelete}
          onConfirm={handleDeleteManagementMember}
          onClose={() => setMemberToDelete(undefined)}
          message="Are you sure you want to delete this member?"
          description="This action cannot be undone."
          isLoading={deleteManagementMemberIsLoading}
        />
      }
      <OTPVerificationCard
        phone={watch("phoneNumber")}
        isOpen={showVerifyphoneNumber}
        onClose={() => {
          setShowVerifyphoneNumber(false);
          handleSubmit(onSubmit)();
        }}
      />
    </section>
  );
};

export default ExecutiveManagement;
