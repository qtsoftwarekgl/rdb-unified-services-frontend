import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import {
  ownerRelationships,
  personnelTypes,
} from "../../../constants/businessRegistration";
import Input from "../../../components/inputs/Input";
import { faSearch, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { userData } from "../../../constants/authentication";
import Loader from "../../../components/Loader";
import validateInputs from "../../../helpers/validations";
import { countriesList } from "../../../constants/countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/inputs/Button";
import Table from "../../../components/table/Table";
import { capitalizeString } from "../../../helpers/strings";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../states/features/foreignBranchRegistrationSlice";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import {
  RDBAdminEmailPattern,
  validNationalID,
} from "../../../constants/Users";
import ViewDocument from "../../user-company-details/ViewDocument";
import ConfirmModal from "../../../components/confirm-modal/ConfirmModal";
import { faEye } from "@fortawesome/free-regular-svg-icons";

interface BeneficialOwnersProps {
  entry_id: string | null;
  foreign_beneficial_owners: any;
  status?: string;
}

const BeneficialOwners = ({
  entry_id,
  foreign_beneficial_owners,
  status,
}: BeneficialOwnersProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
    setValue,
    setError,
    reset,
    clearErrors,
    trigger,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [residential_attachment, setResidentialAttachment] = useState<
    File | null | undefined
  >(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({});
  const [previewAttachment, setPreviewAttachment] = useState<string>("");
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });

  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);

  useEffect(() => {
    setValue("rwandan_company", "");
    setValue("document_type", "");
    setValue("company_code", "");
    setValue("company_name", "");
    setValue("email", "");
    setValue("gender", "");
    setValue("phone", "");
    setValue("residential_country", "");
    setValue("residential_street_name", "");
    setValue("residential_phone", "");
    setValue("document_no", "");
    setValue("first_name", "");
    setValue("postal_code", "");
    setValue("middle_name", "");
    setValue("last_name", "");
    clearErrors();
  }, [watch("beneficial_type")]);

  // CLEAR FORM
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setAttachmentFile(null);
      setValue("company_name", "");
      setSearchMember({
        loading: false,
        error: false,
        data: null,
      });
    }
  }, [isSubmitSuccessful, reset]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          foreign_beneficial_owners: [
            {
              ...data,
              attachment: {
                name: attachmentFile?.name,
                size: attachmentFile?.size,
                type: attachmentFile?.type,
              },
              step: "foreign_beneficial_owners",
            },
            ...foreign_beneficial_owners,
          ],
        })
      );
      setValue("attachment", null);
      setValue("beneficial_type", "");
      reset();
      clearErrors();
    }, 1000);
  };

  // TABLE COLUMNS
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Nature of ownership",
      accessorKey: "ownership_type",
    },
    {
      header: "Control type",
      accessorKey: "control_type",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-6">
            {/* <FontAwesomeIcon
              className="cursor-pointer text-primary font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]"
              icon={faEye}
              onClick={(e) => {
                e.preventDefault();
              }}
            /> */}
            <FontAwesomeIcon
              className="text-red-600 font-bold text-[16px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                if (isFormDisabled) return;
                setConfirmModalData(row?.original);
                setConfirmModal(true);
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <menu className="flex flex-col gap-3">
            <h3 className="text-lg font-medium uppercase">
              Add beneficial owner
            </h3>
            <Controller
              name="beneficial_type"
              rules={{ required: "Select beneficial owner type" }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Select
                      label="Beneficial owner type"
                      required
                      options={personnelTypes}
                      {...field}
                    />
                    {errors?.beneficial_type && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.beneficial_type?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          {watch("beneficial_type") &&
            watch("beneficial_type") !== "person" && (
              <Controller
                control={control}
                name="rwandan_company"
                rules={{ required: "Select Rwandan company status" }}
                render={({ field }) => {
                  return (
                    <menu className="flex flex-col gap-2">
                      <p className="flex items-center gap-2 text-[15px]">
                        Is the beneficial owner based in Rwanda?
                        <span className="text-red-600">*</span>
                      </p>
                      <menu className="flex items-center w-full gap-6">
                        <Input
                          type="radio"
                          label="Yes"
                          value="yes"
                          checked={watch("rwandan_company") === "yes"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          name={field?.name}
                        />
                        <Input
                          type="radio"
                          label="No"
                          value={"no"}
                          checked={watch("rwandan_company") === "no"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          name={field?.name}
                        />
                        {errors?.rwandan_company && (
                          <p className="text-[13px] text-red-500">
                            {String(errors?.rwandan_company.message)}
                          </p>
                        )}
                      </menu>
                    </menu>
                  );
                }}
              />
            )}
          <ul className={`w-full flex items-start gap-6`}>
            {watch("beneficial_type") === "person" && (
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
                        required
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </label>
                  );
                }}
              />
            )}
            {watch("beneficial_type") &&
              watch("beneficial_type") !== "person" &&
              watch("rwandan_company") == "yes" && (
                <Controller
                  name="company_code"
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-[49%]">
                        <Input
                          label="Company/Entreprise Code"
                          placeholder="Company code"
                          suffixIcon={faSearch}
                          suffixIconPrimary
                          suffixIconHandler={async (e) => {
                            e.preventDefault();
                            if (!field.value) {
                              setError("company_code", {
                                type: "manual",
                                message: "Company code is required to search",
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
                                Math.random() * 16
                              );
                              const userDetails = userData[randomNumber];

                              if (!userDetails) {
                                setSearchMember({
                                  ...searchMember,
                                  data: null,
                                  loading: false,
                                  error: true,
                                });
                              }

                              if (userDetails) {
                                clearErrors();
                                setSearchMember({
                                  ...searchMember,
                                  data: userDetails,
                                  loading: false,
                                  error: false,
                                });
                                setValue("email", userDetails?.email);
                                setValue("gender", userDetails?.data?.gender);
                                setValue("phone", userDetails?.data?.phone);
                              }
                            }, 700);
                          }}
                          {...field}
                        />
                        {searchMember?.loading && !errors?.company_code && (
                          <p className="flex items-center gap-[2px] text-[13px]">
                            <Loader size={4} /> Validating company code
                          </p>
                        )}
                        {searchMember?.error && !searchMember?.loading && (
                          <p className="text-red-600 text-[13px]">
                            Invalid company code
                          </p>
                        )}
                        {errors?.company_code && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.company_code?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            {watch("document_type") === "nid" &&
              watch("beneficial_type") === "person" && (
                <Controller
                  control={control}
                  name="document_no"
                  rules={{
                    required: watch("document_type")
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
                            await trigger("document_no");
                          }}
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
                              setSearchMember({
                                ...searchMember,
                                loading: false,
                                error: false,
                              });
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
          <section
            className={`${
              (watch("document_type") === "nid" && searchMember?.data) ||
              watch("document_type") === "passport"
                ? "flex"
                : "hidden"
            } ${
              watch("beneficial_type") !== "person" && "hidden"
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="first_name"
              control={control}
              defaultValue={searchMember?.data?.first_name}
              rules={{
                required:
                  watch("beneficial_type") === "person" &&
                  "First name is required",
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
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
              control={control}
              name="gender"
              defaultValue={watch("gender") || searchMember?.data?.gender}
              rules={{
                required:
                  watch("document_type") === "passport"
                    ? "Select gender"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex items-center w-full gap-2 py-4">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch("document_type") !== "passport" ? (
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
              name="country"
              control={control}
              rules={{
                required:
                  watch("beneficial_type") === "person" &&
                  watch("document_type") === "passport" &&
                  "Nationality is required",
              }}
              render={({ field }) => {
                if (watch("document_type") === "nid") return undefined;
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Select
                      isSearchable
                      label="Country"
                      options={countriesList?.map((country) => {
                        return {
                          ...country,
                          label: country.name,
                          value: country?.code,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
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
            <Controller
              name="phone"
              control={control}
              rules={{
                required:
                  watch("beneficial_type") === "person" &&
                  "Phone number is  required",
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
                        defaultValue={{
                          label: `(+250) ${userData?.[0]?.phone}`,
                          value: userData?.[0]?.phone,
                        }}
                        options={userData?.slice(0, 3)?.map((user) => {
                          return {
                            ...user,
                            label: `(+250) ${user?.phone}`,
                            value: user?.phone,
                          };
                        })}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
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
            <menu
              className={`${
                watch("document_type") === "passport" ? "flex" : "hidden"
              } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
            >
              <menu className="flex gap-4">
                <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                  Passport copy <span className="text-red-600">*</span>
                </h3>
                <Controller
                  name="attachment"
                  rules={{
                    required:
                      watch("document_type") === "passport" &&
                      watch("beneficial_type") === "person"
                        ? "Document attachment is required"
                        : false,
                  }}
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
                              setValue(
                                "attachment",
                                e?.target?.files?.[0]?.name
                              );
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
          </section>
          {watch("beneficial_type") === "person" &&
            (watch("document_type") === "passport" ||
              (watch("document_type") === "nid" && !!searchMember?.data)) && (
              <article className="flex flex-col gap-3">
                <h1>
                  Is the professional address same as the residential address?{" "}
                  <span className="text-red-600">*</span>
                </h1>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Select an option" }}
                  render={({ field }) => {
                    return (
                      <ul className="flex items-center gap-6">
                        <Input
                          type="radio"
                          label="Yes"
                          name={field?.name}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange(e.target.value);
                              setValue("address", "yes");
                              clearErrors("address");
                            }
                          }}
                        />
                        <Input
                          type="radio"
                          label="No"
                          name={field?.name}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange(e.target.value);
                              setValue("address", "no");
                              clearErrors("address");
                            }
                          }}
                        />
                        {errors?.address && (
                          <p className="text-red-500 text-[13px]">
                            {String(errors?.address?.message)}
                          </p>
                        )}
                      </ul>
                    );
                  }}
                />
              </article>
            )}
          <section
            className={`${
              watch("address") === "no" ? "flex" : "hidden"
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="residential_country"
              control={control}
              rules={{
                required:
                  watch("address") === "no" &&
                  watch("beneficial_type") === "person" &&
                  watch("document_type") === "passport" &&
                  "Nationality is required",
              }}
              render={({ field }) => {
                if (watch("document_type") === "nid") return undefined;
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Select
                      isSearchable
                      label="Country"
                      options={countriesList?.map((country) => {
                        return {
                          ...country,
                          label: country.name,
                          value: country?.code,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.residential_country && (
                      <p className="text-sm text-red-500">
                        {String(errors?.residential_country?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />

            <Controller
              control={control}
              name="residential_street_name"
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
            <Controller
              name="residential_phone"
              control={control}
              defaultValue={searchMember?.data?.phone}
              rules={{
                required:
                  watch("address") === "no" &&
                  watch("beneficial_type") === "person"
                    ? "Phone number is required"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Input
                      label="Phone number"
                      placeholder="07XX XXX XXX"
                      required
                      type={
                        watch("document_type") === "passport" ? "tel" : "text"
                      }
                      defaultValue={searchMember?.data?.phone}
                      {...field}
                    />
                    {errors?.residential_phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.residential_phone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <menu
              className={`${
                watch("document_type") === "passport" ? "flex" : "hidden"
              } w-full flex-col items-start gap-3 my-3 max-md:items-center`}
            >
              <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
                Residential Passport copy{" "}
                <span className="text-red-600">*</span>
              </h3>
              <menu className="flex gap-4">
                <Controller
                  name="residential_attachment"
                  rules={{
                    required:
                      watch("address") === "no" &&
                      watch("document_type") === "passport" &&
                      watch("beneficial_type") === "person"
                        ? "Document attachment is required"
                        : false,
                  }}
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
                              setResidentialAttachment(e?.target?.files?.[0]);
                              setValue(
                                "residential_attachment",
                                e?.target?.files?.[0]?.name
                              );
                            }}
                          />
                        </ul>
                        {errors?.residential_attachment && (
                          <p className="text-sm text-red-500">
                            {String(errors?.residential_attachment?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                {residential_attachment && (
                  <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                    <FontAwesomeIcon
                      className="cursor-pointer text-primary"
                      icon={faEye}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewAttachment(
                          URL.createObjectURL(residential_attachment)
                        );
                      }}
                    />
                    {residential_attachment?.name}
                    <FontAwesomeIcon
                      icon={faX}
                      className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                      onClick={(e) => {
                        e.preventDefault();
                        setResidentialAttachment(null);
                        setValue("residential_attachment", null);
                      }}
                    />
                  </p>
                )}
              </menu>
            </menu>
          </section>
          <section
            className={`${
              watch("beneficial_type") && watch("beneficial_type") !== "person"
                ? "flex"
                : "hidden"
            } flex-wrap gap-4 items-start justify-between w-full`}
          >
            <Controller
              name="company_name"
              control={control}
              rules={{
                required:
                  watch("beneficial_type") !== "person"
                    ? "Company name is required"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      label="Company Name"
                      placeholder="Company name"
                      required
                      {...field}
                    />
                    {errors?.company_name && (
                      <p className="text-sm text-red-500">
                        {String(errors?.company_name?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="company_code"
              defaultValue={searchMember?.data?.company_code}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      label="Company code"
                      placeholder="Company code"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="incorporation_country"
              control={control}
              rules={{
                required:
                  watch("beneficial_type") !== "person" &&
                  "Select country of incorporation",
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Select
                      required
                      label="Country of Incorporation"
                      options={countriesList?.map((country) => {
                        return {
                          ...country,
                          label: country.name,
                          value: country.code,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.incorporation_country && (
                      <p className="text-sm text-red-500">
                        {String(errors?.incorporation_country?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="registration_date"
              control={control}
              rules={{
                required:
                  watch("beneficial_type") !== "person"
                    ? "Registration date is required"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      label="Registration Date"
                      required
                      type="date"
                      {...field}
                    />
                    {errors?.registration_date && (
                      <p className="text-sm text-red-500">
                        {String(errors?.registration_date?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              defaultValue={searchMember?.data?.email}
              rules={{
                required:
                  watch("beneficial_type") !== "person" &&
                  "Email address is required",
                validate: (value) => {
                  if (watch("beneficial_type") !== "person") {
                    return (
                      validateInputs(String(value), "email") ||
                      "Invalid email address"
                    );
                  } else return true;
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      defaultValue={searchMember?.data?.email}
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
              name="company_phone"
              control={control}
              rules={{
                required:
                  watch("beneficial_type") !== "person" &&
                  "Company phone number is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-[49%]">
                    <Input
                      label="Phone number"
                      required
                      type="tel"
                      {...field}
                    />
                    {errors?.company_phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.company_phone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
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
            <Controller
              control={control}
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
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
          <menu
            className={`${
              watch("beneficial_type") ? "flex" : "hidden"
            } flex flex-col gap-4 w-full`}
          >
            <h1 className="text-lg font-medium uppercase">Ownership details</h1>
            <section
              className={`flex flex-wrap gap-4 items-start justify-between w-full`}
            >
              <Controller
                name="beneficial_relationship"
                control={control}
                rules={{
                  required: "Select a relationship with the beneficial owner",
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-[49%]">
                      <Select
                        label="Beneficial owner relationship"
                        required
                        options={ownerRelationships?.map((relationship) => {
                          return {
                            label: relationship?.label,
                            value: relationship?.label,
                          };
                        })}
                        {...field}
                      />
                      {errors?.beneficial_relationship && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.beneficial_relationship?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                rules={{ required: "Select control type" }}
                name="control_type"
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Select
                        required
                        label="Control type"
                        options={[
                          { value: "direct", label: "Direct" },
                          { value: "indirect", label: "Indirect" },
                        ]}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.control_type && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.control_type?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="date_bo"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input
                        type="date"
                        label="Date of becoming B.O"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                name="ownership_type"
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Select
                        label="Nature and extent of ownership"
                        options={[{ value: "shares", label: "Shares" }]}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </label>
                  );
                }}
              />
              <Controller
                name="voting_right"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input
                        label="Extent of voting right"
                        placeholder="Voting rights"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            </section>
          </menu>
          <menu className="flex items-center justify-end w-full">
            <Button
              value={isLoading ? <Loader /> : "Add beneficial owner"}
              primary
              submit
            />
          </menu>
        </fieldset>
      </form>
      <section className={`flex members-table flex-col w-full`}>
        <Table
          data={foreign_beneficial_owners?.map(
            (beneficial_owner: unknown, index: number) => {
              return {
                ...beneficial_owner,
                no: index,
                name: beneficial_owner?.first_name
                  ? `${beneficial_owner?.first_name} ${
                      beneficial_owner?.last_name || ""
                    }`
                  : beneficial_owner?.company_name,
                type: capitalizeString(beneficial_owner?.beneficial_type),
                control_type: capitalizeString(beneficial_owner?.control_type),
                ownership_type: capitalizeString(
                  beneficial_owner?.ownership_type
                ),
              };
            }
          )}
          columns={columns}
          showFilter={false}
          showPagination={false}
          tableTitle="Beneficial owners"
        />
      </section>
      <menu
        className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setForeignBusinessActiveStep("foreign_employment_info"));
            dispatch(setForeignBusinessActiveTab("foreign_management"));
          }}
        />
        {isAmending && (
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
        {status === "in_preview" && (
          <Button
            value={"Save & Complete Preview"}
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setForeignBusinessCompletedStep("foreign_beneficial_owners")
              );
              dispatch(
                setForeignBusinessActiveTab("foreign_preview_submission")
              );
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
            dispatch(
              setForeignBusinessCompletedStep("foreign_beneficial_owners")
            );
            dispatch(setUserApplications({ entry_id, status: "in_progress" }));
            dispatch(setForeignBusinessActiveStep("foreign_attachments"));
            dispatch(setForeignBusinessActiveTab("foreign_attachments"));
          }}
        />
      </menu>
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
          const newBeneficialOwners = foreign_beneficial_owners?.filter(
            (_: unknown, index: number) => {
              return index !== confirmModalData?.no;
            }
          );
          dispatch(
            setUserApplications({
              entry_id,
              foreign_beneficial_owners: newBeneficialOwners,
            })
          );
        }}
        message="Are you sure you want to delete this benefical owner?"
        description="This action cannot be undone"
      />
    </section>
  );
};

export default BeneficialOwners;
