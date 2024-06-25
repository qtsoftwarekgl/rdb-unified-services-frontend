import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Loader from "../../../../components/Loader";
import Input from "../../../../components/inputs/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { userData } from "../../../../constants/authentication";
import { countriesList } from "../../../../constants/countries";
import validateInputs from "../../../../helpers/validations";
import Button from "../../../../components/inputs/Button";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { maskPhoneDigits } from "../../../../helpers/strings";
import { RDBAdminEmailPattern } from "../../../../constants/Users";
import ViewDocument from "../../../user-company-details/ViewDocument";
import OTPVerificationCard from "@/components/cards/OTPVerificationCard";
import { businessId } from "@/types/models/business";
import {
  useCreateManagementOrBoardMemberMutation,
  useLazyFetchManagementOrBoardMembersQuery,
} from "@/states/api/foreignCompanyRegistrationApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addBoardMember,
  setBoardOfDirectorsList,
} from "@/states/features/boardOfDirectorSlice";
import BusinessPeopleTable from "../../domestic-business-registration/management/BusinessPeopleTable";
import { PersonDetail } from "@/types/models/personDetail";
import { useLazyGetUserInformationQuery } from "@/states/api/externalServiceApiSlice";
import {
  useLazySearchVillageQuery,
  useUploadPersonAttachmentMutation,
} from "@/states/api/coreApiSlice";
import {
  addBusinessPersonAttachment,
  setBusinessPeopleAttachments,
  setUserInformation,
} from "@/states/features/businessPeopleSlice";
import { genderOptions } from "@/constants/inputs.constants";
import BusinessPeopleAttachments from "../../domestic-business-registration/BusinessPeopleAttachments";

interface BoardDirectorsProps {
  businessId: businessId;
  applicationStatus: string;
}

const BoardDirectors = ({
  businessId,
  applicationStatus,
}: BoardDirectorsProps) => {
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
    formState: { isSubmitSuccessful, errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [previewAttachment, setPreviewAttachment] = useState<string>("");

  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const { boardMemberList } = useSelector(
    (state: RootState) => state.boardOfDirector
  );
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);
  const { userInformation } = useSelector(
    (state: RootState) => state.businessPeople
  );
  const { businessPeopleAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );

  // INITIALIZE CREATE BOARD MEMBER
  const [
    createBoardMember,
    {
      data: createBoardMemberData,
      error: createBoardMemberError,
      isLoading: createBoardMemberIsLoading,
      isError: createBoardMemberIsError,
      isSuccess: createBoardMemberIsSuccess,
    },
  ] = useCreateManagementOrBoardMemberMutation();

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

  // INITIALIZE SEARCH VILLAGE QUERY
  const [
    searchVillage,
    {
      data: searchVillageData,
      isFetching: searchVillageIsFetching,
      isSuccess: searchVillageIsSuccess,
      isError: searchVillageIsError,
      error: searchVillageError,
    },
  ] = useLazySearchVillageQuery();

  // HANDLE GET USER INFORMATION RESPONSE
  useEffect(() => {
    if (userInformationIsError) {
      if ((userInformationError as ErrorResponse).status === 500) {
        toast.error("An error occured while fetching user information");
      } else {
        toast.error((userInformationError as ErrorResponse)?.data?.message);
      }
    } else if (userInformationIsSuccess) {
      searchVillage({
        villageName: userInformationData?.data?.village,
        cellName: userInformationData?.data?.cell,
        sectorName: userInformationData?.data?.sector,
        districtName: userInformationData?.data?.district,
        provinceName: userInformationData?.data?.province,
      });
      dispatch(setUserInformation(userInformationData?.data));
    }
  }, [
    dispatch,
    reset,
    searchVillage,
    userInformationData,
    userInformationError,
    userInformationIsError,
    userInformationIsSuccess,
  ]);

  // HANDLE SEARCH VILLAGE RESPONSE
  useEffect(() => {
    if (userInformation && searchVillageIsSuccess) {
      reset({
        position: watch("position"),
        personIdentType: "nid",
        personDocNo: watch("personDocNo"),
        firstName: userInformation?.foreName,
        lastName: userInformation?.surnames,
        gender: userInformation?.gender,
        nationality: userInformation?.nationality,
        village: searchVillageData?.data?.id,
        persDocIssuePlace: userInformation?.nationality,
        isFromNida: true,
      });
    } else if (searchVillageIsError) {
      if ((searchVillageError as ErrorResponse)?.status === 500) {
        toast.error("An error occured while fetching village information");
      } else {
        toast.error((searchVillageError as ErrorResponse)?.data?.message);
      }
    }
  }, [
    reset,
    searchVillageData,
    userInformation,
    searchVillageIsError,
    searchVillageError,
    searchVillageIsSuccess,
    watch,
  ]);

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

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    createBoardMember({ ...data, businessId, route: "board-member" });
  };

  // HANDLE CREATE BOARD MEMBER RESPONSE
  useEffect(() => {
    if (createBoardMemberIsError) {
      if ((createBoardMemberError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while adding board member");
      } else {
        toast.error((createBoardMemberError as ErrorResponse)?.data?.message);
      }
    } else if (createBoardMemberIsSuccess) {
      if (watch("nationality") !== "RW") {
        const formData = new FormData();
        formData.append("file", attachmentFile as File);
        formData.append("personId", createBoardMemberData?.data?.id);
        formData.append("attachmentType", String(attachmentFile?.type));
        formData.append("businessId", String(businessId));
        formData.append("fileName", String(attachmentFile?.name));
        uploadPersonAttachment({ formData });
      } else {
        reset({
          position: "",
          personIdentType: "",
          document_no: "",
          persDocNo: "",
          persDocIssueDate: "",
          persDocExpiryDate: "",
          dateOfBirth: "",
          firstName: "",
          middleName: "",
          lastName: "",
        });
        dispatch(setUserInformation(undefined));
      }
      dispatch(addBoardMember(createBoardMemberData?.data));
    }
  }, [
    createBoardMemberData,
    createBoardMemberError,
    createBoardMemberIsError,
    createBoardMemberIsSuccess,
    reset,
    dispatch,
    watch,
    attachmentFile,
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
        document_no: "",
        persDocNo: "",
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

  // INITIALIZE FETCH BOARD MEMEBER QUERY
  const [
    fetchBoardMembers,
    {
      data: boardMemberData,
      error: boardMemberError,
      isLoading: boardMemberIsLoading,
      isError: boardMemberIsError,
      isSuccess: boardMemberIsSuccess,
    },
  ] = useLazyFetchManagementOrBoardMembersQuery();

  // FETCH BOARD MEMBERS
  useEffect(() => {
    if (!businessId) return;
    fetchBoardMembers({ businessId, route: "board-member" });
  }, [fetchBoardMembers, businessId]);

  // HANDLE FETCH BOARD MEMBERS RESPONSE
  useEffect(() => {
    if (boardMemberIsError) {
      if ((boardMemberError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching board members");
      } else {
        toast.error((boardMemberError as ErrorResponse)?.data?.message);
      }
    } else if (boardMemberIsSuccess) {
      dispatch(setBoardOfDirectorsList(boardMemberData.data));
    }
  }, [
    boardMemberData,
    boardMemberError,
    boardMemberIsError,
    boardMemberIsSuccess,
    dispatch,
  ]);

  // CLEAR FORM
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setAttachmentFile(null);
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
    }
  }, [isSubmitSuccessful, reset]);

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    setValue("nationality", "");
    setValue("phoneNumber", "");
    setValue("streetName", "");
    setValue("firstName", "");
    setValue("middleName", "");
    setValue("lastName", "");
    setSearchMember({
      ...searchMember,
      data: null,
    });
  }, [setValue, watch("personIdentType")]);

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
              rules={{
                required:
                  applicationStatus !== "IN_PREVIEW"
                    ? "Select member's position"
                    : false,
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Select
                      {...field}
                      label="Select position"
                      placeholder="Select position"
                      required
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
                        placeholder="Select document type"
                        options={options}
                        label="Document Type"
                        required
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
                        {(userInformationIsFetching ||
                          searchVillageIsFetching) && (
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
                    validate: (value) => {
                      return (
                        validateInputs(value, "passsport") ||
                        "Invalid passport number"
                      );
                    },
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
              (watch("personIdentType") === "nid" && searchMember?.data) ||
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
                required: watch("phoneNumber")
                  ? "Phone number is required"
                  : false,
                pattern: {
                  value: /^(?:[0-9] ?){6,14}[0-9]$/,
                  message: "Invalid phone number",
                },
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
                        options={userData?.slice(0, 3)?.map((user) => {
                          return {
                            ...user,
                            label: `(+250) ${maskPhoneDigits(user?.phone)}`,
                            value: user?.phone,
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
            {watch("personIdentType") !== "nid" ? (
              <Controller
                name="nationality"
                control={control}
                rules={{ required: "Nationality is required" }}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1 items-start">
                      <Select
                        placeholder="Select country"
                        {...field}
                        label="Country"
                        options={countriesList
                          ?.filter((country) => country?.code !== "RW")
                          ?.map((country) => {
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
                                  size: e.target.files?.[0]?.size,
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
                createBoardMemberIsLoading ? <Loader /> : "Add board member"
              }
              primary
              disabled={isFormDisabled}
            />
          </section>
          <section className={`flex members-table flex-col w-full`}>
            <BusinessPeopleTable
              businessPeopleList={boardMemberList}
              isLoading={boardMemberIsLoading}
              type="Board of Directors"
            />
            {errors?.submit && (
              <p className="text-red-500 text-[15px] text-center">
                {String(errors?.submit?.message)}
              </p>
            )}
          </section>
          {errors?.board_of_directors && (
            <p className="text-red-600 text-[13px] text-center">
              {String(errors?.board_of_directors?.message)}
            </p>
          )}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setForeignBusinessActiveStep("executive_management"));
              }}
            />
            {applicationStatus === "IS_AMENDING" && (
              <Button
                value={"Complete Amendment"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setForeignBusinessActiveTab("preview_submission"));
                }}
              />
            )}
            {["IN_PREVIEW", "ACTION_REQUIRED"].includes(applicationStatus) && (
              <Button
                value={"Save & Complete Review"}
                primary
                onClick={(e) => {
                  e.preventDefault();
                  if (boardMemberList?.length <= 0) {
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
                    setForeignBusinessCompletedStep("board_of_directors")
                  );

                  dispatch(setForeignBusinessActiveTab("employment_info"));
                }}
                disabled={isFormDisabled}
              />
            )}
            <Button
              value="Save & Continue"
              primary
              disabled={isFormDisabled}
              onClick={(e) => {
                e.preventDefault();
                if (boardMemberList?.length <= 0) {
                  setError("board_of_directors", {
                    type: "manual",
                    message: "Add at least one board member",
                  });
                  setTimeout(() => {
                    clearErrors("board_of_directors");
                  }, 4000);
                  return;
                }
                if (
                  boardMemberList?.find(
                    (director: PersonDetail) =>
                      director?.personIdentType === "nid"
                  ) === undefined
                ) {
                  setError("board_of_directors", {
                    type: "manual",
                    message:
                      "Board requires at least one Rwandan local resident in its members",
                  });
                  setTimeout(() => {
                    clearErrors("board_of_directors");
                  }, 4000);
                  return;
                }
                dispatch(setForeignBusinessCompletedStep("board_of_directors"));
                dispatch(setForeignBusinessActiveStep("employment_info"));
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
      <OTPVerificationCard
        isOpen={showVerifyPhone}
        onClose={() => {
          setShowVerifyPhone(false);
          handleSubmit(onSubmit)();
        }}
        phone={watch("phone")}
      />
    </section>
  );
};

export default BoardDirectors;
