import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import {
  legalArrangementTypes,
  legalPersonTypes,
  personnelTypes,
} from "../../../../constants/businessRegistration";
import Input from "../../../../components/inputs/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../../components/Loader";
import validateInputs from "../../../../helpers/validations";
import { countriesList } from "../../../../constants/countries";
import Button from "../../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from "../../../../states/features/businessRegistrationSlice";
import { maskPhoneDigits } from "../../../../helpers/strings";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import moment from "moment";
import { businessId } from "@/types/models/business";
import { useCreateShareholderMutation } from "@/states/api/businessRegApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import FoundersDetails from "./FoundersDetailsList";
import { genderOptions } from "@/constants/inputs.constants";
import {
  addBusinessPersonAttachment,
  setBusinessPersonAttachments,
  setUserInformation,
} from "@/states/features/businessPeopleSlice";
import { useUploadPersonAttachmentMutation } from "@/states/api/coreApiSlice";
import { useLazyGetUserInformationQuery } from "@/states/api/externalServiceApiSlice";
import BusinessPeopleAttachments from "../BusinessPeopleAttachments";
import { addFounderDetail } from "@/states/features/founderDetailSlice";

type ShareHoldersProps = {
  businessId: businessId;
  applicationStatus?: string;
};

const ShareHolders = ({ businessId, applicationStatus }: ShareHoldersProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    clearErrors,
    trigger,
    reset,
    formState: { errors },
  } = useForm();

  // INITIALIZE CREATE SHAREHOLDER MUTATION
  const [
    createShareholder,
    {
      isLoading: createShareholderIsLoading,
      error: createShareholderError,
      isSuccess: createShareholderIsSuccess,
      isError: createShareholderIsError,
      data: createShareholderData,
    },
  ] = useCreateShareholderMutation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const { userInformation, businessPersonAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );
  const [legalShareholderTypes, setLegalShareholderTypes] =
    useState(legalPersonTypes);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createShareholder({
      ...data,
      personDocNo: data?.personDocNo || data?.documentNumber,
      businessId,
      nationality: data?.persDocIssuePlace,
      isBasedInRwanda: data?.isBasedInRwanda === "yes",
      countryOfIncorporation: data?.isBasedInRwanda
        ? "RW"
        : data?.countryOfIncorporation,
      phoneNumber: data?.phoneNumber || data?.companyPhone,
      shareHolderType: data?.legalShareType || data?.shareHolderType,
    });
  };

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

  // HANDLE CREATE SHAREHOLDER RESPONSE
  useEffect(() => {
    if (createShareholderIsError) {
      if ((createShareholderError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred, please try again later");
      } else {
        toast.error((createShareholderError as ErrorResponse)?.data?.message);
      }
    } else if (createShareholderIsSuccess) {
      if (
        watch("nationality") !== "RW" &&
        watch("shareHolderType") === "individual"
      ) {
        const formData = new FormData();
        formData.append("file", attachmentFile as File);
        formData.append(
          "personId",
          createShareholderData?.data?.personDetail?.id
        );
        formData.append("attachmentType", String(attachmentFile?.type));
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
        dispatch(addFounderDetail(createShareholderData?.data));
      }
    }
  }, [
    attachmentFile,
    businessId,
    createShareholderData?.data,
    createShareholderData?.data?.id,
    createShareholderError,
    createShareholderIsError,
    createShareholderIsSuccess,
    dispatch,
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
      dispatch(addFounderDetail(createShareholderData?.data));
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
      dispatch(setBusinessPersonAttachments([]));
    }
  }, [
    dispatch,
    createShareholderData?.data,
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
        shareHolderType: watch("shareHolderType"),
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

  useEffect(() => {
    if (watch("shareHolderType") && watch("shareHolderType") !== "individual") {
      if (watch("shareHolderType") === "legal_person")
        setLegalShareholderTypes(legalPersonTypes);
      else if (watch("shareHolderType") === "legal_arrangement")
        setLegalShareholderTypes(legalArrangementTypes);
    }
  }, [watch("shareHolderType")]);

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-4">
          <Controller
            name="shareHolderType"
            control={control}
            defaultValue={watch("shareHolderType")}
            rules={{ required: "Select shareholder type" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-[49%]">
                  <Select
                    label="Shareholder type"
                    placeholder="Select shareholder type"
                    options={personnelTypes}
                    {...field}
                    required
                    onChange={(e) => {
                      field.onChange(e);
                      setAttachmentFile(null);
                      clearErrors(["personIdentType", "personDocNo"]);
                      reset({
                        shareHolderType: e,
                      });
                    }}
                  />
                  {errors?.shareHolderType && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.shareHolderType?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          {watch("shareHolderType") &&
            watch("shareHolderType") !== "individual" && (
              <Controller
                name="legalShareType"
                control={control}
                defaultValue={watch("legalShareType")}
                rules={{ required: "Select legal shareholder type" }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-[49%]">
                      <Select
                        label="Legal shareholder type"
                        placeholder="Select legal shareholder type"
                        options={legalShareholderTypes}
                        {...field}
                        required
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.legalShareType && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.legalShareType?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
          <ul className={`w-full flex items-start gap-6`}>
            {watch("shareHolderType") === "individual" && (
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
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.personIdentType && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.personIdentType?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch("personIdentType") === "nid" &&
              watch("shareHolderType") === "individual" && (
                <Controller
                  control={control}
                  name="documentNumber"
                  rules={{
                    required: watch("personIdentType")
                      ? "Document number is required"
                      : false,
                    validate: (value) => {
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
          <menu
            className={`${
              watch("shareHolderType") &&
              watch("shareHolderType") !== "individual"
                ? "flex"
                : "hidden"
            } flex flex-col gap-2 w-full`}
          >
            <Controller
              name="isBasedInRwanda"
              defaultValue={"yes"}
              rules={{ required: "Select if business is based in Rwanda" }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-2">
                    <p className="text-[15px]">
                      Is the business based in Rwanda?
                    </p>
                    <menu className="flex items-center gap-4">
                      <Input
                        type="radio"
                        label="Yes"
                        {...field}
                        defaultChecked
                        value="yes"
                      />
                      <Input type="radio" label="No" {...field} value="no" />
                    </menu>
                    {errors?.isBasedInRwanda && (
                      <span className="text-red-500 text-[13px]">
                        {String(errors?.isBasedInRwanda?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          {((watch("personIdentType") === "nid" && userInformation) ||
            watch("personIdentType") === "passport") && (
            <section
              className={`flex flex-wrap gap-4 items-start justify-between w-full`}
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
                            field.onChange(e?.target?.files?.[0]);
                            setAttachmentFile(e.target.files?.[0]);
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
            </section>
          )}
          <section
            className={`${
              watch("shareHolderType") &&
              watch("shareHolderType") !== "individual"
                ? "grid"
                : "hidden"
            } grid-cols-2 gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="companyName"
              control={control}
              rules={{
                required:
                  watch("shareHolderType") !== "individual"
                    ? "Company name is required"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      label="Company Name"
                      placeholder="Company name"
                      required
                      {...field}
                    />
                    {errors?.companyName && (
                      <p className="text-sm text-red-500">
                        {String(errors?.companyName?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="companyCode"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      label="Company code"
                      placeholder="Company code"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            {watch("isBasedInRwanda") === "no" && (
              <Controller
                name="countryOfIncorporation"
                control={control}
                rules={{
                  required:
                    watch("shareHolderType") !== "individual"
                      ? "Select country of incorporation"
                      : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Select
                        required
                        label="Country of Incorporation"
                        placeholder="Select country of incorporation"
                        options={countriesList
                          ?.filter((country) => country?.code !== "RW")
                          ?.map((country) => {
                            return {
                              ...country,
                              label: country.name,
                              value: country.code,
                            };
                          })}
                        {...field}
                      />
                      {errors?.countryOfIncorporation && (
                        <p className="text-sm text-red-500">
                          {String(errors?.countryOfIncorporation?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            <Controller
              name="incorporationDate"
              control={control}
              rules={{
                required:
                  watch("shareHolderType") !== "individual"
                    ? "Registration date is required"
                    : false,
                validate: (value) => {
                  if (value) {
                    return (
                      moment(value).format() < moment().format() ||
                      "Invalid date selected"
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      label="Incorporation Date"
                      required
                      defaultValue={watch("incorporationDate")}
                      readOnly={watch("rwandan_company") === "yes"}
                      type="date"
                      {...field}
                    />
                    {errors?.incorporationDate && (
                      <p className="text-sm text-red-500">
                        {String(errors?.incorporationDate?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required:
                  watch("shareHolderType") !== "individual" &&
                  "Email address is required",
                validate: (value) => {
                  if (watch("shareHolderType") !== "individual") {
                    return (
                      validateInputs(String(value), "email") ||
                      "Invalid email address"
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      label="Email"
                      placeholder="name@domain.com"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {String(errors?.email?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="companyPhone"
              control={control}
              rules={{
                required:
                  watch("shareHolderType") !== "individual"
                    ? "Company phone number is required"
                    : false,
                validate: (value) => {
                  if (watch("rwandan_company") === "yes") {
                    return (
                      validateInputs(value, "tel") || "Invalid phone number"
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="Phone number"
                      required
                      prefixText={watch("rwandan_company") === "yes" && "+250"}
                      type={watch("rwandan_company") === "yes" ? "text" : "tel"}
                      {...field}
                    />
                    {errors?.companyPhone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.companyPhone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="streetNumber"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="Street Name"
                      placeholder="Street name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="poBox"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="PO Box"
                      placeholder="Postal code"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </section>
          {uploadAttachmentIsLoading ? (
            <figure className="w-full flex items-center justify-center min-h-[20vh]">
              <Loader />
            </figure>
          ) : (
            <section className="flex flex-col w-full gap-2">
              <BusinessPeopleAttachments
                attachments={businessPersonAttachments}
              />
            </section>
          )}
          <FoundersDetails businessId={businessId} />
          <article
            className={`${
              watch("shareHolderType") ? "flex" : "hidden"
            } w-full items-center justify-end`}
          >
            <Button
              submit
              value={
                createShareholderIsLoading ? <Loader /> : "Add shareholder"
              }
              primary
            />
          </article>
          {[
            "IN_PROGRESS",
            "IS_AMENDING",
            "IN_PREVIEW",
            "ACTION_REQUIRED",
          ].includes(String(applicationStatus)) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
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
                  onClick={(e) => {
                    e.preventDefault();

                    // SET ACTIVE TAB AND STEP
                    const active_tab = "preview_submission";
                    const active_step = "preview_submission";

                    dispatch(setBusinessCompletedStep("shareholders"));
                    dispatch(setBusinessActiveStep(active_step));
                    dispatch(setBusinessActiveTab(active_tab));
                    dispatch(
                      setUserApplications({
                        businessId,
                        active_tab,
                        active_step,
                      })
                    );
                  }}
                />
              )}
              <Button
                value="Save & Continue"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessCompletedStep("shareholders"));
                  dispatch(setBusinessActiveStep("capital_details"));
                  dispatch(setBusinessActiveTab("capital_information"));
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
                  dispatch(setBusinessActiveStep("share_details"));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("capital_details"));
                }}
              />
            </menu>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default ShareHolders;
