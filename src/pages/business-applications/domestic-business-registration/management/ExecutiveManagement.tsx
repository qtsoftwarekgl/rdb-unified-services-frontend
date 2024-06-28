import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Input from "../../../../components/inputs/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { countriesList } from "../../../../constants/countries";
import Button from "../../../../components/inputs/Button";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from "../../../../states/features/businessRegistrationSlice";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { maskPhoneDigits } from "../../../../helpers/strings";
import { RDBAdminEmailPattern } from "../../../../constants/Users";
import validateInputs from "../../../../helpers/validations";
import ViewDocument from "../../../user-company-details/ViewDocument";
import moment from "moment";
import { businessId } from "@/types/models/business";
import { useCreateManagementOrBoardPersonMutation } from "@/states/api/businessRegApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import {
  setBusinessPeopleAttachments,
  setUserInformation,
} from '@/states/features/businessPeopleSlice';
import BusinessPeopleAttachments from '../BusinessPeopleAttachments';
import { useLazyGetUserInformationQuery } from '@/states/api/externalServiceApiSlice';
import { useUploadPersonAttachmentMutation } from '@/states/api/coreApiSlice';
import { genderOptions } from '@/constants/inputs.constants';
import {
  addExecutiveManager,
  setExecutiveManagersList,
} from '@/states/features/executiveManagerSlice';
import { useLazyFetchBusinessPeopleQuery } from '@/states/api/businessRegApiSlice';
import BusinessPeople from './BusinessPeople';

type ExecutiveManagementProps = {
  businessId: businessId;
  applicationStatus?: string;
};

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
    trigger,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { userInformation, businessPeopleAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );
  const { business } = useSelector((state: RootState) => state.business);
  const { executiveManagersList } = useSelector(
    (state: RootState) => state.executiveManager
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>("");

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

  // INITIALIZE CREATE MANAGAMENT PERSON MUTATION
  const [
    createManagementPerson,
    {
      data: managementPersonData,
      error: managementPersonError,
      isLoading: managementPersonIsLoading,
      isSuccess: managementPersonIsSuccess,
      isError: managementPersonIsError,
    },
  ] = useCreateManagementOrBoardPersonMutation();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createManagementPerson({
      ...data,
      personDocNo: data?.personDocNo || data?.documentNumber,
      businessId,
      nationality: data?.nationality || data?.persDocIssuePlace,
    });
  };

  // HANDLE CREATE MANAGEMENT PERSON RESPONSE
  useEffect(() => {
    if (managementPersonIsError) {
      if ((managementPersonError as ErrorResponse).status === 500) {
        toast.error("An error occured while adding person. Please try again");
      } else {
        toast.error((managementPersonError as ErrorResponse)?.data?.message);
      }
    } else if (managementPersonIsSuccess) {
      if (watch("nationality") !== "RW") {
        const formData = new FormData();
        formData.append("file", attachmentFile as File);
        formData.append("personId", managementPersonData?.data?.id);
        formData.append("attachmentType", String(attachmentFile?.type));
        formData.append("businessId", String(businessId));
        formData.append("fileName", String(attachmentFile?.name));
        uploadPersonAttachment({ formData });
      } else {
        dispatch(addExecutiveManager(managementPersonData?.data));
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
    }
  }, [
    attachmentFile,
    businessId,
    dispatch,
    managementPersonData,
    managementPersonError,
    managementPersonIsError,
    managementPersonIsSuccess,
    reset,
    uploadPersonAttachment,
    watch,
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
      dispatch(addExecutiveManager(managementPersonData?.data));
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
    managementPersonData?.data,
    reset,
    uploadAttachmentData,
    uploadAttachmentError,
    uploadAttachmentIsError,
    uploadAttachmentIsSuccess,
  ]);

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
      reset({
        position: watch("position"),
        personIdentType: "nid",
        documentNumber: watch("documentNumber"),
        firstName: userInformation?.foreName,
        lastName: userInformation?.surnames,
        gender: userInformation?.gender,
        nationality: userInformation?.nationality,
        persDocIssuePlace: userInformation?.nationality,
        isFromNida: true,
      });
    }
  }, [
    dispatch,
    reset,
    userInformation,
    userInformationData,
    userInformationError,
    userInformationIsError,
    userInformationIsSuccess,
    watch,
  ]);

  // INITIALIZE FETCH MANAGEMENT OR BOARD PEOPLE QUERY
  const [
    fetchManagementMember,
    {
      data: managementMemberData,
      error: managementMemberError,
      isFetching: managementMemberIsFetching,
      isError: managementMemberIsError,
      isSuccess: managementMemberIsSuccess,
    },
  ] = useLazyFetchBusinessPeopleQuery();

  // FETCH MANAGEMENT PEOPLE
  useEffect(() => {
    if (!businessId) return;
    fetchManagementMember({
      businessId,
      route: 'management',
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
          'An error occured while fetching people. Please try again later'
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

  return (
    <section className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-5" disabled={disableForm}>
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
            <Controller
              name="position"
              rules={{ required: "Select member's position" }}
              control={control}
              render={({ field }) => {
                const options = [
                  {
                    value: 'md/gm/ceo',
                    label: 'MD/GM/CEO',
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
                      placeholder="Select position"
                      options={options}
                      {...field}
                      onChange={(e) => {
                        clearErrors(["personIdentType", "personDocNo"]);
                        reset({
                          position: e,
                        });
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
                        placeholder="Select document type"
                        required
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          reset({
                            position: watch("position"),
                            personIdentType: e,
                          });
                        }}
                      />
                    </label>
                  );
                }}
              />
              {watch("personIdentType") === "nid" && (
                <Controller
                  control={control}
                  name="documentNumber"
                  rules={{
                    required: watch("personIdentType")
                      ? "Document number is required"
                      : false,
                    validate: (value) => {
                      if (watch("personIdentType") !== "nid") {
                        return true;
                      }
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
                              setError("documentNumber", {
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
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger("documentNumber");
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
                        {errors?.documentNumber && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.documentNumber?.message)}
                          </p>
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
              !(
                watch("personIdentType") === "passport" ||
                (watch("personIdentType") === "nid" && userInformation)
              ) && "hidden"
            } flex flex-wrap gap-4 items-start justify-between w-full`}
          >
            {watch("personIdentType") === "passport" && (
              <>
                <Controller
                  name="personDocNo"
                  control={control}
                  rules={{
                    required: "Passport number is required",
                  }}
                  render={({ field }) => {
                    return (
                      <label
                        className={`w-[49%] flex flex-col gap-1 items-start`}
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
                <Controller
                  name="persDocIssueDate"
                  rules={{
                    required: "Issue date is required",
                    validate: (value) => {
                      if (
                        moment(value).format() >
                        moment(watch("persDocExpiryDate")).format()
                      ) {
                        return "Issue date must be before expiry date";
                      }
                      return true;
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-[49%]">
                        <Input
                          {...field}
                          label="Passport Issue Date"
                          type="date"
                          onChange={(e) => {
                            field.onChange(
                              moment(String(e)).format("YYYY-MM-DD")
                            );
                            trigger("persDocIssueDate");
                            trigger("persDocExpiryDate");
                          }}
                        />
                        {errors?.persDocIssueDate && (
                          <p className="text-[13px] text-red-600">
                            {String(errors.persDocIssueDate.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="persDocExpiryDate"
                  rules={{
                    required: "Expiry date is required",
                    validate: (value) => {
                      if (
                        moment(value).format() <
                        moment(watch("persDocIssueDate")).format()
                      ) {
                        return "Expiry date must be after issue date";
                      }
                      return true;
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-[49%]">
                        <Input
                          {...field}
                          label="Passport Expiry Date"
                          type="date"
                          onChange={(e) => {
                            field.onChange(
                              moment(String(e)).format("YYYY-MM-DD")
                            );
                            trigger("persDocExpiryDate");
                            trigger("persDocIssueDate");
                          }}
                        />
                        {errors?.persDocExpiryDate && (
                          <p className="text-[13px] text-red-600">
                            {String(errors.persDocExpiryDate.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="dateOfBirth"
                  rules={{ required: "Date of birth is required" }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-[49%]">
                        <Input
                          {...field}
                          type="date"
                          label="Date of birth"
                          placeholder="Select DOB"
                          onChange={(e) => {
                            field.onChange(
                              moment(String(e)).format("YYYY-MM-DD")
                            );
                          }}
                        />
                        {errors?.dateOfBirth && (
                          <p className="text-[13px] text-red-600">
                            {String(errors.dateOfBirth.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              </>
            )}
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      readOnly={watch("personIdentType") === "nid"}
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
              name="lastName"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch("personIdentType") === "nid"}
                      placeholder="Last name"
                      label="Last name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="gender"
              control={control}
              rules={{
                required:
                  watch("personIdentType") === "passport"
                    ? "Select gender"
                    : false,
              }}
              defaultValue={watch("gender")}
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
              <>
                <Controller
                  name="persDocIssuePlace"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => {
                    return (
                      <label className="w-[49%] flex flex-col gap-1 items-start">
                        <Select
                          label="Country"
                          placeholder="Select country"
                          options={countriesList
                            ?.filter((country) => country?.code !== "RW")
                            ?.map((country) => {
                              return {
                                ...country,
                                label: country.name,
                                value: country?.code,
                              };
                            })}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        {errors?.persDocIssuePlace && (
                          <p className="text-sm text-red-500">
                            {String(errors?.persDocIssuePlace?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              </>
            ) : (
              <Controller
                control={control}
                name="poBox"
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input label="PO Box" placeholder="PO Box" {...field} />
                    </label>
                  );
                }}
              />
            )}
            <menu
              className={`${
                watch("personIdentType") === "passport" ? "flex" : "hidden"
              } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
            >
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Passport <span className="text-red-600">*</span>
              </h3>
              <Controller
                name="attachment"
                rules={{
                  required:
                    watch("personIdentType") === "passport"
                      ? "Passport is required"
                      : false,
                }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full items-start gap-2 max-sm:!w-full">
                      <Input
                        type="file"
                        accept="application/pdf"
                        className="!w-fit max-sm:!w-full self-start"
                        onChange={(e) => {
                          if (e?.target?.files?.[0]) {
                            field.onChange(e?.target?.files?.[0]);
                            setAttachmentFile(e.target.files?.[0]);
                            dispatch(
                              setBusinessPeopleAttachments([
                                {
                                  attachmentType: 'Passport',
                                  fileName: e.target.files?.[0]?.name,
                                  fileSize: e.target.files?.[0]?.size,
                                  attachmentUrl: URL.createObjectURL(
                                    e.target.files?.[0]
                                  ),
                                },
                              ])
                            );
                          } else toast.error('No file selected');
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
          </section>
          <section className="flex flex-col w-full gap-2">
            <BusinessPeopleAttachments
              attachments={businessPeopleAttachments}
            />
          </section>
          <section className="flex items-center justify-end w-full">
            <Button
              submit
              value={managementPersonIsLoading ? <Loader /> : "Add position"}
              primary
              disabled={disableForm}
            />
          </section>
          {managementMemberIsFetching ? (
            <figure className="flex items-center justify-center w-full min-h-[20vh]">
              <Loader />
            </figure>
          ) : (
            <BusinessPeople
              businessPeopleList={executiveManagersList}
            />
          )}
          {[
            "IN_PREVIEW",
            "IN_PROGRESS",
            "IS_AMENDING",
            "ACTION_REQUIRED",
          ].includes(String(applicationStatus)) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("share_details"));
                  dispatch(setBusinessActiveTab("capital_information"));
                }}
              />
              {["IN_PREVIEW", "ACTION_REQUIRED"].includes(
                String(applicationStatus)
              ) && (
                <Button
                  value="Save & Complete Review"
                  primary
                  disabled={disableForm || Object.keys(errors).length > 0}
                />
              )}
              <Button
                value="Save & Continue"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    !executiveManagersList?.length &&
                    business?.companyCategory !== "PRIVATE"
                  ) {
                    toast.info("Please add at least one executive manager");
                    return;
                  }
                  dispatch(setBusinessCompletedStep("executive_management"));
                  dispatch(setBusinessActiveStep("board_of_directors"));
                }}
              />
            </menu>
          )}
          {[
            "IN_REVIEW",
            "IS_APPROVED",
            "PENDING_APPROVAL",
            "PENDING_REJECTION",
          ].includes(String(applicationStatus)) && (
            <menu className="flex items-center justify-between gap-3">
              <Button
                value="Back"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("business_activity_vat"));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("board_of_directors"));
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
    </section>
  );
};

export default ExecutiveManagement;
