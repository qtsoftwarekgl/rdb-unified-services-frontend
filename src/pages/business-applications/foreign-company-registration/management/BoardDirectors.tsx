import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import Loader from "../../../../components/Loader";
import Input from "../../../../components/inputs/Input";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { maskPhoneDigits } from "../../../../helpers/strings";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import {
  RDBAdminEmailPattern,
  validNationalID,
} from "../../../../constants/Users";
import ConfirmModal from "../../../../components/confirm-modal/ConfirmModal";
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
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({});
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
      reset({
        Position: "",
        personIdentType: "",
        personDocNo: "",
      });
      dispatch(addBoardMember(createBoardMemberData.data));
    }
  }, [
    createBoardMemberData,
    createBoardMemberError,
    createBoardMemberIsError,
    createBoardMemberIsSuccess,
    reset,
    dispatch,
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
                  status !== "IN_PREVIEW" ? "Select member's position" : false,
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
                          onChange={async (e) => {
                            field.onChange(e);
                            await trigger("personDocNo");
                          }}
                          suffixIconHandler={async (e) => {
                            e.preventDefault();
                            if (!field.value) {
                              setError("personDocNo", {
                                type: "manual",
                                message: "Document number is required",
                              });
                              return;
                            }
                            setSearchMember({
                              ...searchMember,
                              loading: true,
                              error: false,
                            });
                            setTimeout(() => {
                              const index =
                                field?.value.trim() === validNationalID
                                  ? Math.floor(Math.random() * 10)
                                  : Math.floor(Math.random() * 11) + 11;

                              const userDetails = userData[index];
                              if (!userDetails) {
                                setSearchMember({
                                  ...searchMember,
                                  data: null,
                                  loading: false,
                                  error: true,
                                });
                              } else {
                                setSearchMember({
                                  ...searchMember,
                                  data: userDetails,
                                  loading: false,
                                  error: false,
                                });
                                setValue("firstName", userDetails?.firstName);
                                setValue("middleName", userDetails?.middleName);
                                setValue("lastName", userDetails?.lastName);
                                setValue("gender", userDetails?.gender);
                              }
                            }, 700);
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                        />
                        {searchMember?.loading && (
                          <span className="flex items-center gap-[2px] text-[13px]">
                            <Loader size={4} /> Validating document
                          </span>
                        )}
                        {searchMember?.error && !searchMember?.loading && (
                          <span className="text-red-600 text-[13px]">
                            Invalid document number
                          </span>
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
              defaultValue={searchMember?.data?.firstName}
              rules={{ required: "First name is required" }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      defaultValue={searchMember?.data?.firstName}
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
              defaultValue={searchMember?.data?.middleName}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      defaultValue={searchMember?.data?.middleName}
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
              defaultValue={searchMember?.data?.lastName}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      defaultValue={searchMember?.lastName}
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
              defaultValue={watch("gender") || searchMember?.data?.gender}
              rules={{ required: "Gender is required" }}
              render={({ field }) => {
                return (
                  <label className="flex items-center w-full gap-2 py-4">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch("personIdentType") !== "passport" ? (
                      <p className="px-2 py-1 rounded-md bg-background">
                        {searchMember?.data?.gender || watch("gender")}
                      </p>
                    ) : (
                      <menu className="flex items-center gap-4 mt-2">
                        <Input
                          type="radio"
                          label="Male"
                          name={field?.name}
                          value={"Male"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        <Input
                          type="radio"
                          label="Female"
                          name={field?.name}
                          value={"Female"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </menu>
                    )}
                    {errors?.gender && (
                      <span className="text-sm text-red-500">
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
            {watch("personIdentType") !== "nid" && (
              <menu className="flex-col items-start w-full gap-3 my-3 max-md:items-center">
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
                          <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                            <Input
                              type="file"
                              accept="application/pdf"
                              className="!w-fit max-sm:!w-full"
                              onChange={(e) => {
                                field.onChange(e?.target?.files?.[0]);
                                setAttachmentFile(e?.target?.files?.[0]);
                              }}
                            />
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
                  {attachmentFile && (
                    <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                      <FontAwesomeIcon
                        className="cursor-pointer text-primary"
                        icon={faEye}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAttachment(
                            URL.createObjectURL(attachmentFile)
                          );
                        }}
                      />
                      {attachmentFile?.name}
                      <FontAwesomeIcon
                        icon={faX}
                        className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentFile(null);
                          setValue("attachment", null);
                        }}
                      />
                    </p>
                  )}
                </menu>
              </menu>
            )}
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
      <ConfirmModal
        isOpen={confirmModal}
        onClose={() => {
          setConfirmModal(false);
          setConfirmModalData({});
        }}
        onConfirm={(e) => {
          e.preventDefault();
          dispatch(
            setUserApplications({
              businessId,
              foreign_board_of_directors: boardMemberList?.filter(
                (_: unknown, index: number) => {
                  return index !== confirmModalData?.no - 1;
                }
              ),
            })
          );
        }}
        message="Are you sure you want to delete this member?"
        description="This action cannot be undone"
      />
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
