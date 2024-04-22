import { Controller, FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import Input from "../../../components/inputs/Input";
import { faCheck, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
  setUsedIds,
} from "../../../states/features/enterpriseRegistrationSlice";
import Button from "../../../components/inputs/Button";
import Select from "../../../components/inputs/Select";
import { userData } from "../../../constants/authentication";
import { countriesList } from "../../../constants/countries";
import moment from "moment";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { useNavigate } from "react-router-dom";
import {
  RDBAdminEmailPattern,
  validNationalID,
} from "../../../constants/Users";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import ViewDocument from "../../user-company-details/ViewDocument";
import validateInputs from "../../../helpers/validations";

type EnterpriseDetailsProps = {
  entry_id: string | null;
  company_details: any;
  status?: string;
};

export const EnterpriseDetails = ({
  entry_id,
  company_details,
  status,
}: EnterpriseDetailsProps) => {
  const { enterprise_registration_active_step } = useSelector(
    (state: RootState) => state.enterpriseRegistration
  );

  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [previewAttachment, setPreviewAttachment] = useState<string>("");

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [searchEnterprise, setSearchEnterprise] = useState({
    error: false,
    success: false,
    loading: false,
    name: "",
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    reset,
    trigger,
    watch,
  } = useForm();

  useEffect(() => {
    if (company_details?.owner_details) {
      setValue("document_type", company_details?.owner_details?.document_type);
      setValue("document_no", company_details?.owner_details?.document_no);
      setValue("first_name", company_details?.owner_details?.first_name);
      setValue("middle_name", company_details?.owner_details?.middle_name);
      setValue("last_name", company_details?.owner_details?.last_name);
      setValue("gender", company_details?.owner_details?.gender);
      setValue("country", company_details?.owner_details?.country);
      setValue("date_of_birth", company_details?.owner_details?.date_of_birth);
      setValue("phone", company_details?.owner_details?.phone);
      setValue("passport_no", company_details?.owner_details?.passport_no);
      setValue("name", company_details?.name);
      setSearchEnterprise({
        ...searchEnterprise,
        name: company_details?.name,
      });
      setValue(
        "passport_expiry_date",
        company_details?.owner_details?.passport_expiry_date
      );
      if (company_details?.owner_details?.document_type === "nid") {
        setValue("street_name", company_details?.owner_details?.street_name);
        setSearchMember({
          ...searchMember,
          data: {
            ...company_details?.owner_details,
            gender: company_details?.owner_details?.gender,
          },
        });
      }
    }
  }, [company_details?.owner_details, setValue]);

  const onSubmitEnterpriseDetails = (data: FieldValues) => {
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entry_id,
          company_details: {
            ...company_details,
            name: data?.name,
            owner_details: {
              ...data,
              gender: data?.gender || searchMember?.data?.gender,
            },
            step: {
              ...enterprise_registration_active_step,
            },
          },
        })
      );
      dispatch(setUsedIds(data?.id_no));

      if (status === "in_preview" || isLoading?.amend) {
        dispatch(setEnterpriseActiveTab("enterprise_preview_submission"));
      } else {
        // SET ACTIVE STEP
        dispatch(setEnterpriseActiveStep("business_activity_vat"));
      }
      // SET CURRENT STEP AS COMPLETED
      dispatch(setEnterpriseCompletedStep("company_details"));

      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  useEffect(() => {
    // SET USER DETAILS FROM ENterprise Details
    if (company_details) {
      setSearchMember({
        ...searchMember,
        data: company_details?.owner_details,
      });
    }
  }, [company_details]);

  return (
    <section className="flex flex-col w-full gap-4">
      <form onSubmit={handleSubmit(onSubmitEnterpriseDetails)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <menu className="p-8 border">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Enterprise name is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-1/2 gap-1">
                    <Input
                      label={`${
                        company_details?.name_reserved ? "" : "Search"
                      }  Enterprise Name"`}
                      required
                      defaultValue={watch("name") || company_details?.name}
                      suffixIcon={
                        company_details?.name_reserved || isFormDisabled
                          ? undefined
                          : faSearch
                      }
                      readOnly={company_details?.name_reserved ? true : false}
                      suffixIconPrimary
                      onChange={(e) => {
                        field.onChange(e);
                        setSearchEnterprise({
                          ...searchEnterprise,
                          name: e.target.value,
                          error: false,
                          success: false,
                          loading: false,
                        });
                        setError("name", {
                          type: "manual",
                          message:
                            "Check if company name is available before proceeding",
                        });
                      }}
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        if (
                          !searchEnterprise?.name ||
                          searchEnterprise?.name.length < 3
                        ) {
                          setError("name", {
                            type: "manual",
                            message:
                              "Company name must be at least 3 characters",
                          });
                          return;
                        }
                        setSearchEnterprise({
                          ...searchEnterprise,
                          loading: true,
                          error: false,
                          success: false,
                        });
                        setTimeout(() => {
                          if (
                            searchEnterprise.name.trim().toLowerCase() === "xyz"
                          ) {
                            setValue("name", searchEnterprise.name);
                            setSearchEnterprise({
                              ...searchEnterprise,
                              loading: false,
                              success: true,
                              error: false,
                            });
                            setError("name", {
                              type: "manual",
                              message: "",
                            });
                          } else {
                            setSearchEnterprise({
                              ...searchEnterprise,
                              loading: false,
                              success: false,
                              error: true,
                            });
                          }
                        }, 1000);
                      }}
                    />
                    <menu
                      className={`flex flex-col gap-1 w-full my-1 ${
                        !Object.values(searchEnterprise)?.includes(true) &&
                        "hidden"
                      }`}
                    >
                      <article
                        className={`${
                          searchEnterprise.loading ? "flex" : "hidden"
                        } text-[12px] items-center`}
                      >
                        <Loader size={4} /> Checking if "{searchEnterprise.name}
                        " exists
                      </article>
                      <p
                        className={`${
                          searchEnterprise.error && searchEnterprise?.name
                            ? "flex"
                            : "hidden"
                        } text-[12px] items-center text-red-500 gap-2`}
                      >
                        {searchEnterprise.name} is already taken. Please try
                        another name
                      </p>
                      <p
                        className={`${
                          searchEnterprise.success ? "flex" : "hidden"
                        } text-[12px] items-center gap-2 text-secondary`}
                      >
                        {searchEnterprise.name} is available{" "}
                        <span className="w-fit">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-green-600"
                          />
                        </span>
                      </p>
                    </menu>
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>

          <p>
            Provide owner details <span className="text-red-600">*</span>
          </p>

          {/* <menu className="flex items-start gap-6 max-sm:flex-col"> */}
          <section className={`flex-col gap-4 w-full`}>
            <menu className="flex items-start w-full gap-5">
              <Controller
                name="document_type"
                rules={{ required: "Select document type" }}
                defaultValue={company_details?.owner_details?.document_type}
                control={control}
                render={({ field }) => {
                  const options = [
                    { value: "nid", label: "National ID" },
                    { label: "Passport", value: "passport" },
                  ];
                  return (
                    <label
                      className={`flex flex-col gap-1 w-[48%] items-start`}
                    >
                      <Select
                        options={options}
                        label="Document Type"
                        defaultValue={
                          company_details?.owner_details?.document_type
                        }
                        required
                        onChange={(e) => {
                          reset({
                            document_type: e,
                            document_no: "",
                            first_name: "",
                            middle_name: "",
                            last_name: "",
                            phone: "",
                            gender: "",
                            name: watch("name"),
                          });
                          field.onChange(e);
                          setSearchMember({
                            ...searchMember,
                            data: null,
                          });
                        }}
                      />
                    </label>
                  );
                }}
              />
              {watch("document_type") === "nid" && (
                <Controller
                  control={control}
                  defaultValue={company_details?.owner_details?.document_no}
                  name="document_no"
                  rules={{
                    required:
                      watch("document_type") === "nid"
                        ? "Document number is required"
                        : false,
                    validate: (value) => {
                      return (
                        validateInputs(value, "nid") ||
                        "Document number must be 16 characters"
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-2 items-start w-[48%]">
                        <Input
                          required
                          suffixIcon={faSearch}
                          defaultValue={
                            company_details?.owner_details?.document_no
                          }
                          suffixIconHandler={async (e) => {
                            e.preventDefault();
                            setSearchMember({
                              ...searchMember,
                              data: null,
                              loading: true,
                              error: false,
                            });
                            setTimeout(() => {
                              const randomNumber = Math.floor(
                                Math.random() * 10
                              );
                              const userDetails = userData[randomNumber];

                              if (field?.value !== String(validNationalID)) {
                                setSearchMember({
                                  ...searchMember,
                                  data: null,
                                  loading: false,
                                  error: true,
                                });
                                setError("document_no", {
                                  type: "manual",
                                  message: "Document number not found",
                                });
                              } else {
                                clearErrors("document_no");
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
                              }
                            }, 700);
                          }}
                          label="ID Document No"
                          suffixIconPrimary
                          placeholder="1 XXXX X XXXXXXX X XX"
                          {...field}
                          onChange={async (e) => {
                            field.onChange(e);
                            setSearchMember({
                              ...searchMember,
                              data: null,
                            });
                            await trigger("document_no");
                          }}
                        />
                        {searchMember?.loading && (
                          <p className="text-[13px] flex items-center gap-1">
                            <Loader size={4} /> Searching...
                          </p>
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
            </menu>
            <section
              className={`${
                (watch("document_type") === "nid" && searchMember?.data) ||
                watch("document_type") === "passport"
                  ? "flex"
                  : "hidden"
              } flex w-full gap-5 flex-wrap items-start mt-4`}
            >
              {watch("document_type") === "passport" && (
                <>
                  {" "}
                  <Controller
                    name="passport_no"
                    defaultValue={company_details?.owner_details?.passport_no}
                    control={control}
                    rules={{ required: "Passport No is required" }}
                    render={({ field }) => {
                      return (
                        <label className="w-[48%] flex flex-col gap-1 items-start">
                          <Input
                            label="Passport No"
                            required
                            {...field}
                            defaultValue={
                              company_details?.owner_details?.passport_no
                            }
                          />
                          {errors?.passport_no && (
                            <p className="text-[13px] text-red-500">
                              {String(errors?.passport_no?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="passport_expiry_date"
                    defaultValue={
                      company_details?.owner_details?.passport_expiry_date
                    }
                    rules={{
                      required: "Select Passport Expiry Date",
                      validate: (value) => {
                        if (
                          moment(value).format() < moment(new Date()).format()
                        ) {
                          return "Select a Valid Passport Expiry Date";
                        }
                        return true;
                      },
                    }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="w-[48%] flex flex-col gap-1 items-start">
                          <Input
                            label="Passport Expiry Date"
                            type="date"
                            required
                            {...field}
                            defaultValue={
                              company_details?.owner_details
                                ?.passport_expiry_date
                            }
                          />
                          {errors?.passport_expiry_date && (
                            <p className="text-[13px] text-red-500">
                              {String(errors?.passport_expiry_date?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </>
              )}
              <Controller
                name="first_name"
                control={control}
                defaultValue={
                  company_details?.owner_details?.first_name ||
                  searchMember?.data?.first_name
                }
                rules={{
                  required: "First name is required",
                }}
                render={({ field }) => {
                  return (
                    <label className="w-[48%] flex flex-col gap-1 items-start">
                      <Input
                        required
                        readOnly={watch("document_type") === "nid"}
                        defaultValue={
                          company_details?.owner_details?.first_name ||
                          searchMember?.data?.first_name
                        }
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
                defaultValue={
                  company_details?.owner_details?.middle_name ||
                  searchMember?.data?.middle_name
                }
                render={({ field }) => {
                  return (
                    <label className="w-[48%] flex flex-col gap-1 items-start">
                      <Input
                        readOnly={watch("document_type") === "nid"}
                        defaultValue={
                          company_details?.owner_details?.middle_name ||
                          searchMember?.data?.middle_name
                        }
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
                defaultValue={
                  company_details?.owner_details?.last_name ||
                  searchMember?.data?.last_name
                }
                render={({ field }) => {
                  return (
                    <label className="w-[48%] flex flex-col gap-1 items-start">
                      <Input
                        readOnly={watch("document_type") === "nid"}
                        defaultValue={
                          company_details?.owner_details?.last_name ||
                          searchMember?.last_name
                        }
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
                defaultValue={
                  company_details?.owner_details?.gender ||
                  searchMember?.data?.gender
                }
                rules={{
                  required:
                    watch("document_type") === "passport"
                      ? "Select gender"
                      : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-2 items-start w-[48%]">
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
                            checked={
                              searchMember?.data?.gender === "Female" ||
                              watch("gender") === "Male"
                            }
                            label="Male"
                            value="Male"
                            name={field?.name}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              if (e.target.checked) {
                                setValue("gender", "Male");
                              }
                            }}
                          />
                          <Input
                            type="radio"
                            value={"Female"}
                            checked={
                              searchMember?.data?.gender === "Female" ||
                              watch("gender") === "Female"
                            }
                            label="Female"
                            name={field?.name}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              if (e.target.checked) {
                                setValue("gender", "Female");
                              }
                            }}
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
              {watch("document_type") === "passport" && (
                <Controller
                  name="country"
                  control={control}
                  rules={{
                    required:
                      watch("document_type") === "passport"
                        ? "Country is required"
                        : false,
                  }}
                  render={({ field }) => {
                    return (
                      <label className="w-[48%] flex flex-col gap-1 items-start">
                        <Select
                          isSearchable
                          required
                          label="Country"
                          options={countriesList
                            ?.filter((country) => country?.code != "RW")
                            ?.map((country) => {
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
              )}
              {watch("document_type") === "passport" && (
                <Controller
                  name="date_of_birth"
                  control={control}
                  defaultValue={company_details?.owner_details?.date_of_birth}
                  rules={{
                    required:
                      watch("document_type") === "passport"
                        ? "Select date of birth"
                        : false,
                    validate: (value) => {
                      if (
                        moment(value).format() > moment(new Date()).format()
                      ) {
                        return "Select a valid date of birth";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-[48%] gap-1">
                        <Input
                          required
                          defaultValue={
                            company_details?.owner_details?.date_of_birth
                          }
                          type="date"
                          label="Date of birth"
                          {...field}
                        />
                        {errors?.date_of_birth && (
                          <p className="text-sm text-red-500">
                            {String(errors?.date_of_birth?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
              <Controller
                name="phone"
                control={control}
                defaultValue={`(+250) ${company_details?.owner_details?.phone}`}
                rules={{
                  required: "Phone number is required",
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-[48%] gap-1">
                      {watch("document_type") === "passport" ? (
                        <Input
                          label="Phone number"
                          required
                          defaultValue={company_details?.owner_details?.phone}
                          type="tel"
                          {...field}
                        />
                      ) : (
                        <Select
                          label="Phone number"
                          required
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
              {watch("document_type") === "nid" && (
                <Controller
                  control={control}
                  name="street_name"
                  render={({ field }) => {
                    return (
                      <label className="w-[48%] flex flex-col gap-1">
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
              <Controller
                control={control}
                name="po_box"
                render={({ field }) => {
                  return (
                    <label className="w-[48%] flex flex-col gap-1">
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
            {watch("document_type") && watch("document_type") !== "nid" && (
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
          {/* )} */}

          {previewAttachment && (
            <ViewDocument
              documentUrl={previewAttachment}
              setDocumentUrl={setPreviewAttachment}
            />
          )}
          <menu
            className={`flex items-center mt-8 gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                navigate("/enterprise-registration/new");
              }}
            />
            {status === "is_Amending" && (
              <Button
                submit
                value={isLoading?.amend ? <Loader /> : "Complete Amendment"}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors)?.length) {
                    return;
                  }
                  setIsLoading({
                    ...isLoading,
                    amend: true,
                    preview: false,
                    submit: false,
                  });
                }}
                disabled={Object.keys(errors)?.length > 0}
              />
            )}
            {status === "in_preview" && (
              <Button
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors)?.length) {
                    return;
                  }
                  setIsLoading({
                    ...isLoading,
                    preview: true,
                    submit: false,
                    amend: false,
                  });
                }}
                value={
                  isLoading?.preview && !Object.keys(errors)?.length ? (
                    <Loader />
                  ) : (
                    "Save & Complete Preview"
                  )
                }
                primary
                submit
                disabled={isFormDisabled || Object.keys(errors)?.length > 0}
              />
            )}
            <Button
              value={isLoading.submit ? <Loader /> : "Save & Continue"}
              primary={!company_details?.error}
              disabled={isFormDisabled}
              onClick={async () => {
                await trigger();
                if (Object.keys(errors)?.length) {
                  return;
                }
                setIsLoading({
                  ...isLoading,
                  submit: true,
                  preview: false,
                  amend: false,
                });
                dispatch(
                  setUserApplications({ entry_id, status: "in_progress" })
                );
              }}
              submit
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default EnterpriseDetails;
