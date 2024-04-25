import { Controller, FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import Input from "../../../components/inputs/Input";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
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
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { useNavigate } from "react-router-dom";
import { RDBAdminEmailPattern } from "../../../constants/Users";

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

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [searchEnterprise, setSearchEnterprise] = useState({
    error: false,
    success: false,
    loading: false,
    name: "",
  });
  const [invalidForm, setInvalidForm] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    formState,
    clearErrors,
    setValue,
    setError,
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

  useEffect(() => {
    if (!company_details?.enterprise_name)
      setValue("enterprise_name", user?.name);
  }, [company_details?.enterprise_name, setValue, user?.name]);

  useEffect(() => {
    console.log(errors);
    if (Object.keys(errors).length) setInvalidForm(true);
    else setInvalidForm(false);
  }, [formState]);

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

      if (
        ["in_preview", "action_required"].includes(status) ||
        isLoading?.amend
      ) {
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
          <menu className="flex items-start gap-6 p-8 border">
            <Controller
              name="enterprise_name"
              control={control}
              defaultValue={
                company_details?.enterprise_name || watch("enterprise_name")
              }
              rules={{
                required: "Enterprise name is required",
              }}
              render={() => {
                return (
                  <label className="flex flex-col items-start w-1/2 gap-1">
                    <Input
                      label={" Enterprise Name"}
                      required
                      value={
                        company_details?.enterprise_name ||
                        watch("enterprise_name")
                      }
                      readOnly
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-1/2 gap-1">
                    <Input
                      label={`${
                        company_details?.name_reserved ? "" : "Search"
                      }  Business Name`}
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
                        if (e.target.value.length === 0) clearErrors("name");
                        else
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
                          } else {
                            setSearchEnterprise({
                              ...searchEnterprise,
                              loading: false,
                              success: false,
                              error: true,
                            });
                          }
                          clearErrors("name");
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
            {["in_preview", "action_required"].includes(status) && (
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
                    "Save & Complete Review"
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
              disabled={
                isFormDisabled ||
                invalidForm ||
                searchEnterprise?.error ||
                searchEnterprise?.loading
              }
              onClick={() => {
                if (invalidForm) {
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
