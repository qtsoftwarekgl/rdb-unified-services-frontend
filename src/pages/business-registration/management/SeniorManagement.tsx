import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import Loader from "../../../components/Loader";
import Input from "../../../components/inputs/Input";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { previewUrl, userData } from "../../../constants/authentication";
import { countriesList } from "../../../constants/countries";
import Button from "../../../components/inputs/Button";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from "../../../states/features/businessRegistrationSlice";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { capitalizeString } from "../../../helpers/strings";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import {
  RDBAdminEmailPattern,
  validNationalID,
} from "../../../constants/Users";
import Modal from "../../../components/Modal";
import validateInputs from "../../../helpers/validations";
import { attachmentFileColumns } from "../../../constants/businessRegistration";
import ViewDocument from "../../user-company-details/ViewDocument";

export interface business_senior_management {
  first_name: string;
  middle_name: string;
  last_name: string;
  attachment: File | null;
}

interface SeniorManagementProps {
  isOpen: boolean;
  senior_management: business_senior_management[];
  entry_id: string | null;
  status: string;
}

const SeniorManagement: FC<SeniorManagementProps> = ({
  isOpen,
  senior_management = [],
  entry_id,
  status,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    watch,
    trigger,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    manager: boolean;
    attachment: boolean;
    first_name?: string;
    last_name?: string;
  }>({
    manager: false,
    attachment: false,
  });
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>("");

  // HANDLE DOCUMENT CHANGE
  useEffect(() => {
    setValue("country", "");
    setValue("phone", "");
    setValue("street_name", "");
    setValue("first_name", "");
    setValue("middle_name", "");
    setValue("last_name", "");
    setSearchMember({
      ...searchMember,
      data: null,
      loading: false,
      error: false,
    });
  }, [setValue, watch("document_type")]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      clearErrors("submit");
      dispatch(
        setUserApplications({
          entry_id,
          active_tab: "management",
          active_step: "employment_info",
          senior_management: [
            {
              ...data,
              attachment: {
                name: attachmentFile?.name,
                size: attachmentFile?.size,
                type: attachmentFile?.type,
              },
            },
            ...senior_management,
          ],
        })
      );
      setSearchMember({
        ...searchMember,
        data: null,
        loading: false,
        error: false,
      });
      setValue("attachment", null);
      setAttachmentFile(null);
      reset();
    }, 1000);
    return data;
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            <FontAwesomeIcon
              className={`${
                disableForm
                  ? "text-secondary cursor-default"
                  : "text-red-600 cursor-pointer"
              } font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                if (disableForm) return;
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  manager: true,
                  first_name: row?.original?.first_name,
                  last_name: row?.original?.last_name,
                });
              }}
            />
            <Modal
              isOpen={confirmDeleteModal?.manager}
              onClose={() => {
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  manager: false,
                });
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium text-center uppercase">
                  Are you sure you want to delete{" "}
                  {confirmDeleteModal?.first_name}{" "}
                  {confirmDeleteModal?.last_name || ""}
                </h1>
                <menu className="flex items-center justify-between gap-3">
                  <Button
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        manager: false,
                      });
                    }}
                  />
                  <Button
                    value="Delete"
                    danger
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setUserApplications({
                          entry_id,
                          senior_management: senior_management?.filter(
                            (manager: business_senior_management) => {
                              return manager?.id !== row?.original?.id;
                            }
                          ),
                        })
                      );
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        manager: false,
                        first_name: "",
                        last_name: "",
                      });
                    }}
                  />
                </menu>
              </section>
            </Modal>
          </menu>
        );
      },
    },
  ];

  // ATTACHMENT COLUMNS
  const attachmentColumns = [
    ...attachmentFileColumns,
    {
      header: "action",
      accesorKey: "action",
      cell: () => {
        return (
          <menu className="flex items-center gap-4">
            <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[20px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
                setAttachmentPreview(previewUrl);
              }}
            />
            <FontAwesomeIcon
              className="cursor-pointer text-white bg-red-600 p-2 w-[13px] h-[13px] text-[16px] rounded-full font-bold ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  attachment: true,
                });
              }}
            />
            <Modal
              isOpen={confirmDeleteModal?.attachment}
              onClose={() => {
                setConfirmDeleteModal({
                  ...confirmDeleteModal,
                  attachment: false,
                });
              }}
            >
              <section className="flex flex-col gap-6">
                <h1 className="font-medium text-center uppercase">
                  Are you sure you want to delete {attachmentFile?.name}
                </h1>
                <menu className="flex items-center justify-between gap-3">
                  <Button
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        attachment: false,
                      });
                    }}
                  />
                  <Button
                    value="Delete"
                    danger
                    onClick={(e) => {
                      e.preventDefault();
                      setAttachmentFile(null);
                      setValue("attachment", null);
                      setError("attachment", {
                        type: "manual",
                        message: "Passport is required",
                      });
                      setConfirmDeleteModal({
                        ...confirmDeleteModal,
                        attachment: false,
                      });
                    }}
                  />
                </menu>
              </section>
            </Modal>
          </menu>
        );
      },
    },
  ];

  if (!isOpen) return null;

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
                    value: "md/gm",
                    label: "MD / GM",
                  },
                  {
                    value: "secretary",
                    label: "Secretary",
                  },
                  {
                    value: "accountant",
                    label: "Accountant",
                  },
                  {
                    value: "auditor",
                    label: "Auditor",
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
                      onChange={async (e) => {
                        await trigger("position");
                        setValue("document_type", "");
                        field.onChange(e);
                        clearErrors("position");
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
                name="document_type"
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
                        watch("document_type") !== "nid" && "!w-[49%]"
                      }`}
                    >
                      <Select
                        options={options}
                        label="Document Type"
                        placeholder="Select document type"
                        required
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          reset({
                            position: watch("position"),
                            document_type: e,
                          })
                        }}
                      />
                    </label>
                  );
                }}
              />
              {watch("document_type") === "nid" && (
                <Controller
                  control={control}
                  name="document_no"
                  rules={{
                    required: watch("document_type")
                      ? "Document number is required"
                      : false,
                    validate: (value) => {
                      if (watch("document_type") !== "nid") {
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
                              setError("document_no", {
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
                              const randomNumber = Math.floor(
                                Math.random() * 10
                              );
                              const userDetails = userData[randomNumber];

                              if (
                                String(field?.value) !== String(validNationalID)
                              ) {
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
                                setValue("first_name", userDetails?.first_name);
                                setValue(
                                  "middle_name",
                                  userDetails?.middle_name
                                );
                                setValue("last_name", userDetails?.last_name);
                                setValue("gender", userDetails?.data?.gender);
                                setValue("phone", userDetails?.data?.phone);
                              }
                            }, 700);
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          onChange={async (e) => {
                            field.onChange(e);
                            clearErrors("document_no");
                            await trigger("document_no");
                          }}
                        />
                        {searchMember?.loading &&
                          !errors?.document_no &&
                          !searchMember?.error && (
                            <span className="flex items-center gap-[2px] text-[13px]">
                              <Loader size={4} /> Validating document
                            </span>
                          )}
                        {searchMember?.error && !searchMember?.loading && (
                          <span className="text-red-600 text-[13px]">
                            Invalid document number
                          </span>
                        )}
                        {errors?.document_no && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.document_no?.message)}
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
              (watch("document_type") === "nid" && searchMember?.data) ||
              watch("document_type") === "passport"
                ? "flex"
                : "hidden"
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="passport_no"
              control={control}
              rules={{
                required:
                  watch("document_type") === "passport"
                    ? "Passport number is required"
                    : false,
                validate: (value) => {
                  if (watch("document_type") !== "passport") {
                    return true;
                  }
                  return (
                    validateInputs(value, "passport") ||
                    "Invalid passport number"
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label
                    className={`${
                      watch("document_type") === "passport" ? "flex" : "hidden"
                    } w-[49%] flex flex-col gap-1 items-start`}
                  >
                    <Input
                      required
                      placeholder="Passport number"
                      label="Passport number"
                      {...field}
                    />
                    {errors?.passport_no && (
                      <span className="text-sm text-red-500">
                        {String(errors?.passport_no?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="first_name"
              control={control}
              defaultValue={searchMember?.data?.first_name}
              rules={{ required: "First name is required" }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      readOnly={watch("document_type") === "nid"}
                      defaultValue={searchMember?.data?.first_name}
                      placeholder="First name"
                      label="First name"
                      {...field}
                    />
                    {errors?.first_name && (
                      <span className="text-sm text-red-500">
                        {String(errors?.first_name?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="middle_name"
              control={control}
              defaultValue={searchMember?.data?.middle_name}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch("document_type") === "nid"}
                      defaultValue={searchMember?.data?.middle_name}
                      placeholder="Middle name"
                      label="Middle name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="last_name"
              control={control}
              defaultValue={searchMember?.data?.last_name}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch("document_type") === "nid"}
                      defaultValue={searchMember?.last_name}
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
              defaultValue={searchMember?.data?.gender}
              rules={{
                required:
                  watch("document_type") === "passport"
                    ? "Select gender"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-2 items-start w-[49%]">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch("document_type") === "nid" ? (
                      <p className="px-2 py-1 rounded-md bg-background">
                        {searchMember?.data?.gender || watch("gender")}
                      </p>
                    ) : (
                      <menu className="flex items-center gap-4 mt-2">
                        <Input
                          type="radio"
                          label="Male"
                          {...field}
                          value={"Male"}
                        />
                        <Input
                          type="radio"
                          label="Female"
                          {...field}
                          value={"Female"}
                        />
                      </menu>
                    )}

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
              name="phone"
              control={control}
              rules={{
                required: "Phone number is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    {watch("document_type") === "passport" ? (
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
                            label: `(+250) ${user?.phone}`,
                            value: user?.phone,
                          };
                        })}
                        {...field}
                      />
                    )}
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch("document_type") !== "nid" ? (
              <Controller
                name="country"
                control={control}
                rules={{ required: "Nationality is required" }}
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
                      />
                      {errors?.country && (
                        <p className="text-sm text-red-500">
                          {String(errors?.country?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            ) : (
              <Controller
                control={control}
                name="street_name"
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
            <menu
              className={`${
                watch("document_type") === "passport" ? "flex" : "hidden"
              } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
            >
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Passport <span className="text-red-600">*</span>
              </h3>
              <Controller
                name="attachment"
                rules={{
                  required:
                    watch("document_type") === "passport"
                      ? "Passport is required"
                      : false,
                }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full items-start gap-2 max-sm:!w-full">
                      <Input
                        type="file"
                        accept="application/pdf,image/*"
                        className="!w-fit max-sm:!w-full self-start"
                        onChange={(e) => {
                          field.onChange(e?.target?.files?.[0]);
                          setAttachmentFile(e?.target?.files?.[0]);
                          clearErrors("attachment");
                          setValue("attachment", e?.target?.files?.[0]);
                        }}
                      />
                      <ul className="flex flex-col items-center w-full gap-3">
                        {attachmentFile && (
                          <Table
                            columns={attachmentColumns}
                            data={[attachmentFile]}
                            showPagination={false}
                            showFilter={false}
                          />
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
          <section className="flex items-center justify-end w-full">
            <Button
              value={isLoading ? <Loader /> : "Add position"}
              submit
              primary
              disabled={disableForm}
            />
          </section>
          <section className={`flex members-table flex-col w-full`}>
            <h2 className="text-lg font-semibold uppercase text-primary">
              Managemenet Members
            </h2>
            <Table
              data={
                senior_management?.length > 0
                  ? senior_management?.map((member, index) => {
                      return {
                        ...member,
                        no: index + 1,
                        name: `${member?.first_name || ""} ${
                          member?.middle_name || ""
                        } ${member?.last_name || ""}`,
                        position:
                          member?.position &&
                          capitalizeString(member?.position),
                      };
                    })
                  : []
              }
              columns={columns}
              showFilter={false}
              showPagination={false}
              rowClickHandler={undefined}
            />
            {errors?.submit && (
              <p className="text-red-500 text-[13px] text-center my-2">
                {String(errors?.submit?.message)}
              </p>
            )}
          </section>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              disabled={disableForm}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setBusinessActiveStep("board_of_directors"));
              }}
            />
            {status === "is_Amending" && (
              <Button
                value={"Complete Amendment"}
                disabled={Object.keys(errors).length > 0 || disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  if (!senior_management?.length) {
                    setError("submit", {
                      type: "manual",
                      message: "Add at least one member",
                    });
                    setTimeout(() => {
                      clearErrors("submit");
                    }, 5000);
                    return;
                  }
                  dispatch(setBusinessCompletedStep("senior_management"));
                  dispatch(setBusinessActiveTab("preview_submission"));
                  dispatch(setBusinessActiveStep("preview_submission"));
                }}
              />
            )}
            {status === "in_preview" && (
              <Button
                value="Save & Complete Preview"
                primary
                disabled={disableForm || Object.keys(errors).length > 0}
                onClick={(e) => {
                  e.preventDefault();
                  if (!senior_management?.length) {
                    setError("submit", {
                      type: "manual",
                      message: "Add at least one member",
                    });
                    setTimeout(() => {
                      clearErrors("submit");
                    }, 5000);
                    return;
                  }
                  dispatch(setBusinessCompletedStep("senior_management"));
                  dispatch(setBusinessActiveTab("preview_submission"));
                  dispatch(setBusinessActiveStep("preview_submission"));
                }}
              />
            )}
            <Button
              value="Save & Continue"
              primary
              disabled={disableForm || Object.keys(errors).length > 0}
              onClick={(e) => {
                e.preventDefault();
                if (!senior_management?.length) {
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
                  setUserApplications({ entry_id, status: "in_progress" })
                );
                dispatch(setBusinessCompletedStep("senior_management"));
                dispatch(setBusinessActiveStep("employment_info"));
              }}
            />
          </menu>
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

export default SeniorManagement;
