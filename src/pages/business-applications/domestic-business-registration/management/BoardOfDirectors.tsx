import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Loader from "../../../../components/Loader";
import Input from "../../../../components/inputs/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { countriesList } from "../../../../constants/countries";
import Button from "../../../../components/inputs/Button";
import {
  setBusinessActiveStep,
  setBusinessCompletedStep,
} from "../../../../states/features/businessRegistrationSlice";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { maskPhoneDigits } from "../../../../helpers/strings";
import validateInputs from "../../../../helpers/validations";
import BusinessPeople from "./BusinessPeople";
import { businessId } from "@/types/models/business";
import moment from "moment";
import {
  useCreateManagementOrBoardPersonMutation,
  useLazyFetchBusinessPeopleQuery,
} from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'react-router-dom';
import { useUploadPersonAttachmentMutation } from '@/states/api/businessRegApiSlice';
import { useLazyGetUserInformationQuery } from '@/states/api/businessExternalServiceApiSlice';
import {
  addBoardMember,
  setBoardOfDirectorsList,
} from "@/states/features/boardOfDirectorSlice";
import {
  addBusinessPersonAttachment,
  setBusinessPersonAttachments,
  setUserInformation,
} from "@/states/features/businessPeopleSlice";
import BusinessPeopleAttachments from "../BusinessPeopleAttachments";
import { genderOptions } from "@/constants/inputs.constants";

type BoardOfDirectorsProps = {
  businessId: businessId;
  applicationStatus?: string;
};

const BoardOfDirectors = ({
  businessId,
  applicationStatus,
}: BoardOfDirectorsProps) => {
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
  const { userInformation, businessPersonAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );
  const { business } = useSelector((state: RootState) => state.business);
  const { boardMemberList } = useSelector(
    (state: RootState) => state.boardOfDirector
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );

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
      data: boardPersonData,
      error: boardPersonError,
      isLoading: boardPersonIsLoading,
      isSuccess: boardPersonIsSuccess,
      isError: boardPersonIsError,
    },
  ] = useCreateManagementOrBoardPersonMutation();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createManagementPerson({
      ...data,
      personDocNo: data?.personDocNo || data?.documentNumber,
      businessId,
      nationality: data?.nationality || data?.persDocIssuePlace,
      route: "board-member",
    });
  };

  // HANDLE CREATE MANAGEMENT PERSON RESPONSE
  useEffect(() => {
    if (boardPersonIsError) {
      if ((boardPersonError as ErrorResponse).status === 500) {
        toast.error("An error occured while adding person. Please try again");
      } else {
        toast.error((boardPersonError as ErrorResponse)?.data?.message);
      }
    } else if (boardPersonIsSuccess) {
      if (watch("nationality") !== "RW") {
        const formData = new FormData();
        formData.append("file", attachmentFile as File);
        formData.append("personId", boardPersonData?.data?.id);
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
        dispatch(addBoardMember(boardPersonData?.data));
        dispatch(setUserInformation(undefined));
      }
    }
  }, [
    attachmentFile,
    businessId,
    dispatch,
    boardPersonData,
    boardPersonError,
    boardPersonIsError,
    boardPersonIsSuccess,
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
      dispatch(addBoardMember(boardPersonData?.data));
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
    boardPersonData?.data,
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
    fetchBoardMembers,
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
    fetchBoardMembers({
      businessId,
      route: "board-member",
    });
  }, [businessId, fetchBoardMembers]);

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
      dispatch(setBoardOfDirectorsList(managementMemberData?.data));
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
        <fieldset className="flex flex-col w-full gap-5">
          <menu className="flex flex-col w-full gap-4">
            <h3 className="font-medium uppercase text-md">Add members</h3>
            <Controller
              name="position"
              rules={{ required: "Select member's position" }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Select
                      label="Select position"
                      required
                      placeholder="Select position"
                      options={[
                        {
                          value: "chairman",
                          label: "Chairman",
                        },
                        {
                          value: "member",
                          label: "Member",
                        },
                      ]}
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
                          required
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
                          required
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
                          required
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
          <section className="flex items-center justify-end w-full">
            <Button
              submit
              value={boardPersonIsLoading ? <Loader /> : "Add position"}
              primary
            />
          </section>
          {managementMemberIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[20vh]">
              <Loader />
            </figure>
          ) : (
            <BusinessPeople
              businessPeopleList={boardMemberList}
              businessId={businessId}
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
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("board_of_directors"));
                }}
              />
              <Button
                value="Save & Continue"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    !boardMemberList?.length &&
                    business?.companyCategory !== "PRIVATE"
                  ) {
                    toast.info("Please add at least one board member");
                    return;
                  }
                  dispatch(setBusinessCompletedStep("board_of_directors"));
                  dispatch(setBusinessActiveStep("employment_info"));
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
    </section>
  );
};

export default BoardOfDirectors;
