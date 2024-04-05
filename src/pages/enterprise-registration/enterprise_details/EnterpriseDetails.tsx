import { Controller, FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import Input from "../../../components/inputs/Input";
import {
  faCheck,
  faEllipsis,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
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
import {
  documentTypes,
  dummyPhones,
} from "../../../constants/businessRegistration";
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
  });
  const [isNationalIdLoading, setIsNationalIdLoading] =
    useState<boolean>(false);
  const [nationalIdError, setNationalIdError] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [previewAttachment, setPreviewAttachment] = useState<string>("");

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
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
    trigger,
    watch,
  } = useForm();

  useEffect(() => {
    if (company_details) {
      setValue("name", company_details?.name);
      setSearchEnterprise({
        ...searchEnterprise,
        name: company_details?.name,
      });
    }
  }, []);

  useEffect(() => {
    if (watch("document_type") === "passport") {
      setValue("country", "");
      setValue("phone", "");
      setValue("street_name", "");
      setValue("first_name", "");
      setValue("middle_name", "");
      setValue("last_name", "");
      setValue("gender", "");
      setValue("date_of_birth", "");
      setValue("nationality", "");
      setValue("province", "");
      setValue("district", "");
      setValue("sector", "");
      setValue("cell", "");
      setValue("village", "");
      setValue("email", "");
      setValue("pob", "");
      setValue("passport_no", "");
      setValue("passport_expiry_date", "");
      setValue("id_no", "");
      setUserDetails({});
    }
  }, [setValue, watch("document_type")]);

  const onSubmitEnterpriseDetails = (data: FieldValues) => {
    setIsLoading({
      ...isLoading,
      submit: status === "in_preview" ? false : true,
      preview: status === "in_preview" ? true : false,
    });
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entry_id,
          company_details: {
            ...company_details,
            ...data,
            step: {
              ...enterprise_registration_active_step,
            },
          },
        })
      );
      dispatch(setUsedIds(data?.id_no));
      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
      });

      if (status === "in_preview") {
        dispatch(setEnterpriseActiveTab("enterprise_preview_submission"));
      } else {
        // SET ACTIVE STEP
        dispatch(setEnterpriseActiveStep("business_activity_vat"));
      }
      // SET CURRENT STEP AS COMPLETED
      dispatch(setEnterpriseCompletedStep("company_details"));
    }, 1000);
  };

  useEffect(() => {
    // SET USER DETAILS FROM ENterprise Details
    if (company_details) {
      setUserDetails(company_details);
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
              defaultValue={company_details?.name || watch("name")}
              rules={{
                required: "Enterprise name is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-1/2 gap-1">
                    <Input
                      label={`${
                        company_details?.name_reserved ? "" : "Search"
                      }  company name"`}
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

          <menu className="flex items-start gap-6 max-sm:flex-col">
            <Controller
              name="document_type"
              control={control}
              defaultValue={
                watch("document_type") || company_details?.document_type
              }
              rules={{ required: "Document type is required" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-1/2 gap-2">
                    <Select
                      label="Document Type"
                      required
                      options={documentTypes}
                      onChange={(e) => {
                        field.onChange(e);
                        if (userDetails) {
                          setUserDetails({
                            ...userDetails,
                            document_type: e?.value,
                          });
                        } else {
                          setUserDetails({
                            document_type: e?.value,
                          });
                        }
                      }}
                      defaultValue={
                        documentTypes.find(
                          (type) =>
                            type.value === company_details?.document_type
                        )?.value
                      }
                    />
                    {errors?.document_type && (
                      <p className="text-xs text-red-500">
                        {String(errors?.document_type?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch("document_type") === "nid" && (
              <Controller
                control={control}
                name="id_no"
                defaultValue={
                  watch("id_no") || company_details?.id_no || userDetails?.id_no
                }
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
                render={({ field }) => (
                  <label className="flex flex-col items-start w-1/2 gap-2">
                    <Input
                      required
                      label="ID Document No"
                      placeholder="1 XXXX X XXXXXXX X XX"
                      defaultValue={
                        watch("id_no") ||
                        company_details?.id_no ||
                        userDetails?.id_no
                      }
                      suffixIconPrimary
                      suffixIcon={isNationalIdLoading ? faEllipsis : faSearch}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger("id_no");
                      }}
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        if (watch("id_no").length !== 16) {
                          setError("id_no", {
                            type: "manual",
                            message: "ID number must be 16 numbers",
                          });
                        } else {
                          setIsNationalIdLoading(true);
                          setTimeout(() => {
                            setUserDetails(null);
                            const index =
                              field?.value.trim() === validNationalID
                                ? Math.floor(Math.random() * 10)
                                : Math.floor(Math.random() * 11) + 11;

                            const userDetails = userData[index];
                            if (!userDetails) {
                              setNationalIdError(true);
                            } else {
                              setNationalIdError(false);
                              setUserDetails({
                                ...userDetails,
                                document_type: watch("document_type"),
                              });
                              setError("id_no", {
                                type: "manual",
                                message: "",
                              });
                            }
                            setIsNationalIdLoading(false);
                          }, 1000);
                        }
                      }}
                    />
                    {errors?.id_no && (
                      <p className="text-xs text-red-500">
                        {String(errors?.id_no?.message)}
                      </p>
                    )}
                    {isNationalIdLoading && (
                      <span className="flex items-center gap-[2px] text-[13px]">
                        <Loader size={4} /> Validating document
                      </span>
                    )}
                    {nationalIdError && !isNationalIdLoading && (
                      <menu className="flex flex-col w-full gap-1 px-2 mx-auto">
                        <p className="text-red-600 text-[13px] text-center max-w-[80%] mx-auto">
                          A person with the provided document number is not
                          found. Double check the document number and try again.
                        </p>
                      </menu>
                    )}
                  </label>
                )}
              />
            )}
          </menu>

          {watch("document_type") === "nid" &&
            Object.keys(userDetails).length > 3 && (
              <section>
                <menu className="flex items-start gap-6 max-sm:flex-col">
                  <Controller
                    control={control}
                    name="first_name"
                    defaultValue={
                      watch("firstName") ||
                      userDetails?.first_name ||
                      company_details?.first_name
                    }
                    rules={{ required: "First name is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="First Name"
                            readOnly
                            required
                            defaultValue={
                              watch("first_name") ||
                              userDetails?.first_name ||
                              company_details?.first_name
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.first_name && (
                            <p className="text-xs text-red-500">
                              {String(errors.first_name.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="middle_name"
                    defaultValue={
                      watch("middle_name") ||
                      userDetails?.middle_name ||
                      company_details?.middle_name
                    }
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Middle Name"
                            readOnly
                            defaultValue={
                              watch("middle_name") ||
                              userDetails?.middle_name ||
                              company_details?.middle_name
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </label>
                      );
                    }}
                  />
                </menu>
                <menu className="flex items-start gap-6 max-sm:flex-col">
                  <Controller
                    control={control}
                    name="last_name"
                    defaultValue={
                      watch("last_name") ||
                      userDetails?.last_name ||
                      company_details?.last_name
                    }
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Last Name"
                            readOnly
                            defaultValue={
                              watch("last_name") ||
                              userDetails?.last_name ||
                              company_details?.last_name
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.last_name && (
                            <p className="text-xs text-red-500">
                              {String(errors.last_name.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="date_of_birth"
                    defaultValue={
                      watch("date_of_birth") ||
                      userDetails?.date_of_birth ||
                      company_details?.date_of_birth
                    }
                    rules={{ required: "Date of birth is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Date of Birth"
                            readOnly
                            required
                            defaultValue={
                              watch("date_of_birth") ||
                              userDetails?.date_of_birth ||
                              company_details?.date_of_birth
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.date_of_birth && (
                            <p className="text-xs text-red-500">
                              {String(errors.date_of_birth.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
                <Controller
                  control={control}
                  name="gender"
                  defaultValue={
                    watch("gender") ||
                    userDetails?.gender ||
                    company_details?.gender
                  }
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => {
                    const gender =
                      watch("gender") ||
                      userDetails?.gender ||
                      company_details?.gender;
                    return (
                      <label className="flex items-center w-full gap-2 py-4">
                        <p className="flex items-center gap-1 text-[15px]">
                          Gender<span className="text-red-500">*</span>
                        </p>
                        {watch("document_type") === "nid" && (
                          <menu className="flex items-center gap-4">
                            {gender === "Male" && (
                              <Input
                                type="radio"
                                label="Male"
                                readOnly
                                checked={gender === "Male"}
                                {...field}
                              />
                            )}
                            {gender === "Female" && (
                              <Input
                                type="radio"
                                label="Female"
                                readOnly
                                {...field}
                                checked={gender === "Female"}
                              />
                            )}
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
                <menu className="flex items-start gap-6 max-sm:flex-col ">
                  <Controller
                    control={control}
                    name="nationality"
                    defaultValue={
                      watch("nationality") ||
                      userDetails?.nationality ||
                      company_details?.national
                    }
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-1">
                          <Input
                            defaultValue={
                              watch("nationality") ||
                              userDetails?.nationality ||
                              company_details?.national
                            }
                            readOnly
                            label="Nationality"
                            {...field}
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
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue={
                      watch("phone") ||
                      company_details?.phone ||
                      userDetails?.phone
                    }
                    rules={{ required: "Phone is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Select
                            label="Phone"
                            required
                            options={dummyPhones}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                            defaultValue={dummyPhones.find(
                              (type) =>
                                type.value === company_details?.phone ||
                                userDetails?.phone
                            )}
                          />
                          {errors?.documentType && (
                            <p className="text-xs text-red-500">
                              {String(errors?.documentType?.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
                <menu className="flex items-start gap-6 max-sm:flex-col ">
                  <Controller
                    control={control}
                    name="country"
                    defaultValue={
                      watch("country") ||
                      company_details?.country ||
                      userDetails?.country
                    }
                    rules={{ required: "Country is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Country"
                            readOnly
                            required
                            defaultValue={
                              watch("country") ||
                              company_details?.country ||
                              userDetails?.country
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.country && (
                            <p className="text-xs text-red-500">
                              {String(errors.country.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="province"
                    defaultValue={
                      watch("province") ||
                      company_details?.province ||
                      userDetails?.province
                    }
                    rules={{ required: "Province is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Province"
                            readOnly
                            required
                            defaultValue={
                              watch("province") ||
                              company_details?.province ||
                              userDetails?.province
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.province && (
                            <p className="text-xs text-red-500">
                              {String(errors.province.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
                <menu className="flex items-start gap-6 max-sm:flex-col ">
                  <Controller
                    control={control}
                    name="district"
                    defaultValue={
                      watch("district") ||
                      company_details?.district ||
                      userDetails?.district
                    }
                    rules={{ required: "District is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="District"
                            readOnly
                            required
                            defaultValue={
                              watch("district") ||
                              company_details?.district ||
                              userDetails?.district
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.district && (
                            <p className="text-xs text-red-500">
                              {String(errors.district.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="sector"
                    defaultValue={
                      watch("sector") ||
                      company_details?.sector ||
                      userDetails?.sector
                    }
                    rules={{ required: "Sector is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Sector"
                            readOnly
                            required
                            defaultValue={
                              watch("sector") ||
                              company_details?.sector ||
                              userDetails?.sector
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.sector && (
                            <p className="text-xs text-red-500">
                              {String(errors.sector.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
                <menu className="flex items-start gap-6 max-sm:flex-col">
                  <Controller
                    control={control}
                    name="cell"
                    defaultValue={
                      watch("cell") ||
                      company_details?.cell ||
                      userDetails?.cell
                    }
                    rules={{ required: "Cell is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Cell"
                            readOnly
                            required
                            defaultValue={
                              watch("cell") ||
                              company_details?.cell ||
                              userDetails?.cell
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.cell && (
                            <p className="text-xs text-red-500">
                              {String(errors.cell.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="village"
                    defaultValue={
                      watch("village") ||
                      company_details?.village ||
                      userDetails?.village
                    }
                    rules={{ required: "Village is required" }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Village"
                            readOnly
                            required
                            defaultValue={
                              watch("village") ||
                              company_details?.village ||
                              userDetails?.village
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.village && (
                            <p className="text-xs text-red-500">
                              {String(errors.village.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
                <menu className="flex items-start gap-6 max-sm:flex-col">
                  <Controller
                    control={control}
                    name="email"
                    defaultValue={
                      watch("email") ||
                      company_details?.email ||
                      userDetails?.email
                    }
                    rules={{
                      required: "Email is required",
                      validate: (value) => {
                        return (
                          validateInputs(value, "email") || "email-invalid"
                        );
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="Email"
                            required
                            defaultValue={
                              watch("email") ||
                              company_details?.email ||
                              userDetails?.email
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500">
                              {String(errors.email.message)}
                            </p>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="pob"
                    defaultValue={
                      watch("pob") || company_details?.pob || userDetails?.pob
                    }
                    render={({ field }) => {
                      return (
                        <label className="flex flex-col items-start w-1/2 gap-2">
                          <Input
                            label="P O Box"
                            defaultValue={
                              watch("pob") ||
                              company_details?.pob ||
                              userDetails?.pob
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </label>
                      );
                    }}
                  />
                </menu>
              </section>
            )}

          {watch("document_type") === "passport" && (
            <section>
              <menu className="flex items-start gap-6 max-sm:flex-col">
                <Controller
                  name="passport_no"
                  control={control}
                  rules={{ required: "Passport No is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Input
                          label="Passport No"
                          required
                          {...field}
                          defaultValue={
                            watch("passport_no") ||
                            userDetails?.passport_no ||
                            company_details?.passport_no
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
                  rules={{
                    required: "Select Passport Expiry Date",
                    validate: (value) => {
                      if (
                        moment(value).format() < moment(new Date()).format()
                      ) {
                        return "Select a Passport Expiry Date";
                      }
                      return true;
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col w-full gap-1">
                        <Input
                          label="Passport Expiry Date"
                          type="date"
                          required
                          {...field}
                          defaultValue={
                            userDetails?.passport_expiry_date ||
                            company_details?.passport_expiry_date
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
              </menu>
              <menu className="flex items-start gap-6 max-sm:flex-col">
                <Controller
                  control={control}
                  name="first_name"
                  defaultValue={
                    watch("firstName") ||
                    userDetails?.first_name ||
                    company_details?.first_name
                  }
                  rules={{ required: "First name is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-2">
                        <Input
                          label="First Name"
                          required
                          defaultValue={
                            watch("first_name") ||
                            userDetails?.first_name ||
                            company_details?.first_name
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        {errors.first_name && (
                          <p className="text-xs text-red-500">
                            {String(errors.first_name.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="middle_name"
                  defaultValue={
                    watch("middle_name") ||
                    userDetails?.middle_name ||
                    company_details?.middle_name
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-2">
                        <Input
                          label="Middle Name"
                          defaultValue={
                            watch("middle_name") ||
                            userDetails?.middle_name ||
                            company_details?.middle_name
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </label>
                    );
                  }}
                />
              </menu>
              <menu className="flex items-start gap-6 max-sm:flex-col">
                <Controller
                  control={control}
                  name="last_name"
                  defaultValue={
                    watch("last_name") ||
                    userDetails?.last_name ||
                    company_details?.last_name
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-2">
                        <Input
                          label="Last Name"
                          defaultValue={
                            watch("last_name") ||
                            userDetails?.last_name ||
                            company_details?.last_name
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        {errors.last_name && (
                          <p className="text-xs text-red-500">
                            {String(errors.last_name.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="date_of_birth"
                  defaultValue={
                    watch("date_of_birth") ||
                    userDetails?.date_of_birth ||
                    company_details?.date_of_birth
                  }
                  rules={{
                    required: "Date of birth is required",
                    validate: (value) => {
                      if (
                        moment(value).format() < moment(new Date()).format()
                      ) {
                        return "Select a valid Date of Birth";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-2">
                        <Input
                          label="Date of Birth"
                          required
                          type="date"
                          defaultValue={
                            watch("date_of_birth") ||
                            userDetails?.date_of_birth ||
                            company_details?.date_of_birth
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        {errors.date_of_birth && (
                          <p className="text-xs text-red-500">
                            {String(errors.date_of_birth.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              </menu>
              <menu className="flex items-start gap-6 max-sm:flex-col ">
                <Controller
                  control={control}
                  name="nationality"
                  defaultValue={
                    watch("nationality") ||
                    userDetails?.nationality ||
                    company_details?.national
                  }
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-1">
                        <Input
                          defaultValue={
                            watch("nationality") ||
                            userDetails?.nationality ||
                            company_details?.national
                          }
                          label="Nationality"
                          {...field}
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
                <Controller
                  control={control}
                  name="country"
                  defaultValue={
                    watch("country") ||
                    company_details?.country ||
                    userDetails?.country
                  }
                  rules={{ required: "Country is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-2">
                        <Input
                          label="Country"
                          required
                          defaultValue={
                            watch("country") ||
                            company_details?.country ||
                            userDetails?.country
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        {errors.country && (
                          <p className="text-xs text-red-500">
                            {String(errors.country.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              </menu>
              <menu className="flex items-start gap-6 max-sm:flex-col ">
                <Controller
                  control={control}
                  name="gender"
                  defaultValue={
                    watch("gender") ||
                    userDetails?.gender ||
                    company_details?.gender
                  }
                  rules={{ required: "Gender is required" }}
                  render={() => {
                    return (
                      <label className="flex items-center w-full gap-2 py-4">
                        <p className="flex items-center gap-1 text-[15px]">
                          Gender<span className="text-red-500">*</span>
                        </p>
                        <menu className="flex items-center gap-4">
                          <Input
                            type="radio"
                            label="Male"
                            checked={
                              watch("gender") === "Male" ||
                              userDetails?.gender === "Male"
                            }
                            onChange={() => {
                              setValue("gender", "Male");
                            }}
                          />

                          <Input
                            type="radio"
                            label="Female"
                            onChange={() => {
                              setValue("gender", "Female");
                            }}
                            checked={
                              watch("gender") === "Female" ||
                              userDetails?.gender === "Female"
                            }
                          />
                        </menu>
                        {errors?.gender && (
                          <span className="text-sm text-red-500">
                            {String(errors?.gender?.message)}
                          </span>
                        )}
                      </label>
                    );
                  }}
                />
              </menu>
              <menu className="flex items-start gap-6 max-sm:flex-col">
                <Controller
                  control={control}
                  name="email"
                  defaultValue={
                    watch("email") ||
                    company_details?.email ||
                    userDetails?.email
                  }
                  rules={{ required: "Email is required" }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col items-start w-1/2 gap-2">
                        <Input
                          label="Email"
                          required
                          defaultValue={
                            watch("email") ||
                            company_details?.email ||
                            userDetails?.email
                          }
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">
                            {String(errors.email.message)}
                          </p>
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
                      <label className="flex flex-col w-1/2 gap-1">
                        <p className="flex items-center gap-1">
                          Phone number <span className="text-red-600">*</span>
                        </p>
                        <menu className="relative flex items-center gap-0">
                          <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                            <select
                              className="w-full !text-[12px]"
                              defaultValue={
                                userDetails?.phone || company_details?.phone
                              }
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            >
                              {countriesList?.map((country) => {
                                return (
                                  <option
                                    key={country?.dial_code}
                                    value={country?.dial_code}
                                  >
                                    {`${country?.code} ${country?.dial_code}`}
                                  </option>
                                );
                              })}
                            </select>
                          </span>
                          <input
                            onChange={field.onChange}
                            className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                            type="text"
                          />
                        </menu>
                        {errors?.phone && (
                          <p className="text-sm text-red-500">
                            {String(errors?.phone?.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              </menu>
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
            </section>
          )}

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
            {isAmending && (
              <Button
                value={"Complete Amendment"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setEnterpriseActiveTab("enterprise_preview_submission")
                  );
                }}
              />
            )}
            {status === "in_preview" && (
              <Button
                value={
                  isLoading?.preview ? <Loader /> : "Save & Complete Preview"
                }
                primary
                submit
                disabled={isFormDisabled}
              />
            )}
            <Button
              value={isLoading.submit ? <Loader /> : "Save & Continue"}
              primary={!company_details?.error}
              disabled={isFormDisabled}
              onClick={() => {
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
