import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../../components/Loader";
import Select from "../../../../components/inputs/Select";
import {
  companyCategories,
  companyPositions,
  companyTypes,
  privateCompanyTypes,
} from "../../../../constants/businessRegistration";
import Button from "../../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessCompletedStep,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import { RDBAdminEmailPattern } from "../../../../constants/Users";
import {
  useLazyGetBusinessDetailsQuery,
  useLazySearchBusinessNameAvailabilityQuery,
} from "@/states/api/businessRegApiSlice";
import { ErrorResponse, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setNameAvailabilitiesList,
  setBusinessDetails,
  setSimilarBusinessNamesModal,
} from "@/states/features/businessSlice";
import { useCreateOrUpdateCompanyDetailsMutation } from "@/states/api/foreignCompanyRegistrationApiSlice";
import { convertDecimalToPercentage } from "@/helpers/strings";
import { businessId } from "@/types/models/business";
import SimilarBusinessNames from "../../SimilarBusinessNames";

type CompanyDetailsProps = {
  businessId: businessId;
};

const CompanyDetails: FC<CompanyDetailsProps> = ({ businessId }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    setError,
    clearErrors,
    reset,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);
  const [companyTypesOptions, setBusinessTypesOptions] = useState(companyTypes);
  const { businessDetails, nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      isLoading: businessIsLoading,
      error: businessError,
      isError: businessIsError,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessDetailsQuery();

  // INITIALIZE SEARCH BUSINESS NAME AVAILABILITY QUERY
  const [
    searchBusinessNameAvailability,
    {
      data: searchBusinessNameData,
      isLoading: searchBusinessNameIsLoading,
      error: searchBusinessNameError,
      isError: searchBusinessNameIsError,
      isSuccess: searchBusinessNameIsSuccess,
      isFetching: searchBusinessNameIsFetching,
    },
  ] = useLazySearchBusinessNameAvailabilityQuery();

  // HANDLE SEARCH BUSINESS NAME AVAILABILITY RESPONSE
  useEffect(() => {
    if (searchBusinessNameIsError) {
      if ((searchBusinessNameError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while searching for business name availability"
        );
      } else {
        toast.error((searchBusinessNameError as ErrorResponse)?.data?.message);
      }
    } else if (searchBusinessNameIsSuccess) {
      if (searchBusinessNameIsSuccess) {
        dispatch(setNameAvailabilitiesList(searchBusinessNameData?.data));
      }
    }
  }, [
    dispatch,
    searchBusinessNameData?.data,
    searchBusinessNameError,
    searchBusinessNameIsError,
    searchBusinessNameIsSuccess,
  ]);

  // GET BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId });
    }
  }, [businessId, getBusinessDetails]);

  // HANDLE BUSINESS DETAILS DATA RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while fetching business details. Please try again later."
        );
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess) {
      dispatch(setBusinessDetails(businessDetailsData?.data));
    }
  }, [
    businessDetailsData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
  ]);

  // INITIALIZE CREATE COMPANY DETAILS MUTATION
  const [
    createOrUpdateCompanyDetailsMutation,
    {
      error: createCompanyDetailsError,
      isLoading: createCompanyDetailsIsLoading,
      isError: createCompanyDetailsIsError,
      isSuccess: createCompanyDetailsIsSuccess,
    },
  ] = useCreateOrUpdateCompanyDetailsMutation();

  // SET BUSINESS CATEGORY OPTIONS
  useEffect(() => {
    if (watch("companyCategory") === "PUBLIC") {
      setBusinessTypesOptions(companyTypes);
    } else if (watch("companyCategory") === "PRIVATE") {
      setBusinessTypesOptions(privateCompanyTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("companyCategory"), businessDetails?.companyCategory]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createOrUpdateCompanyDetailsMutation({
      businessId: businessId,
      companyName: data.companyName,
      companyType: data.companyType,
      companyCategory: data.companyCategory,
      position: data.position,
      hasArticlesOfAssociation: data.hasArticlesOfAssociation === "yes",
    });
  };

  // HANDLE CREATE COMPANY DETAILS RESPONSE
  useEffect(() => {
    if (createCompanyDetailsIsError) {
      if ((createCompanyDetailsError as ErrorResponse)?.status === 500) {
        toast.error("Internal server error");
      } else {
        toast.error(
          (createCompanyDetailsError as ErrorResponse)?.data?.message
        );
      }
    } else if (createCompanyDetailsIsSuccess) {
      dispatch(setForeignBusinessActiveStep("company_address"));
      dispatch(setForeignBusinessCompletedStep("company_details"));
    }
  }, [
    createCompanyDetailsIsSuccess,
    createCompanyDetailsError,
    createCompanyDetailsIsError,
    dispatch,
  ]);

  useEffect(() => {
    if (businessDetails && Object.keys(businessDetails).length > 0) {
      reset({
        companyName: businessDetails?.companyName,
        companyCategory: businessDetails?.companyCategory,
        companyType: businessDetails?.companyType,
        position: businessDetails?.position,
        hasArticlesOfAssociation: businessDetails?.hasArticlesOfAssociation
          ? "yes"
          : "no",
      });
    }
  }, [businessDetails, reset]);

  return (
    <section className="flex flex-col w-full gap-4">
      {businessIsLoading && (
        <figure className="h-[40vh] flex items-center justify-center">
          <Loader />
        </figure>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="companyName"
              control={control}
              defaultValue={
                watch("companyName") || businessDetails?.companyName
              }
              rules={{
                required: "Company name is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      label="Search company name"
                      required
                      suffixIconPrimary
                      suffixIcon={faSearch}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError("companyName", {
                          type: "manual",
                          message:
                            "Check if company name is available before proceeding",
                        });
                      }}
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        if (!field?.value || field?.value.length < 3) {
                          setError("companyName", {
                            type: "manual",
                            message:
                              "Company name must be at least 3 characters",
                          });
                          return;
                        }
                        clearErrors("companyName");
                        searchBusinessNameAvailability({
                          companyName: field?.value,
                        });
                      }}
                    />
                    <menu className={`flex w-full flex-col gap-2`}>
                      {searchBusinessNameIsLoading ||
                        (searchBusinessNameIsFetching && (
                          <figure className="flex items-center gap-2">
                            <Loader />
                            <p className="text-[13px]">Searching...</p>
                          </figure>
                        ))}
                      {searchBusinessNameIsSuccess &&
                        nameAvailabilitiesList?.length > 0 &&
                        !errors?.companyName && (
                          <section className="flex flex-col gap-1">
                            <p className="text-[11px] text-red-600">
                              The given name has a similarity of up to{" "}
                              {convertDecimalToPercentage(
                                nameAvailabilitiesList[0]?.similarity
                              )}
                              % with other business names. Consider changing it
                              to avoid conflicts.
                            </p>
                            <Link
                              to={"#"}
                              className="text-[11px] underline text-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(setSimilarBusinessNamesModal(true));
                              }}
                            >
                              Click to find conflicting business names
                            </Link>
                          </section>
                        )}
                      {searchBusinessNameIsSuccess &&
                        nameAvailabilitiesList?.length === 0 &&
                        !errors?.companyName && (
                          <p className="text-[11px] text-green-600 px-2">
                            {field.value} is available for use
                          </p>
                        )}
                    </menu>
                    {errors.companyName && (
                      <p className="text-xs text-red-500">
                        {String(errors.companyName.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="companyCategory"
              defaultValue={businessDetails?.companyCategory}
              rules={{ required: "Select company category" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      label="Company category"
                      required
                      placeholder="Select company category"
                      options={companyCategories?.map((category) => {
                        return {
                          ...category,
                          value: category?.value,
                          label: category?.label,
                        };
                      })}
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger(field?.name);
                      }}
                    />
                    {errors?.companyCategory && (
                      <p className="text-xs text-red-500">
                        {String(errors?.companyCategory?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              control={control}
              name="companyType"
              rules={{ required: "Select company type" }}
              defaultValue={businessDetails?.companyType}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      label="Company type"
                      required
                      placeholder="Select company type"
                      options={companyTypesOptions?.map((type) => {
                        return {
                          ...type,
                          value: type?.value,
                          label: type?.label,
                        };
                      })}
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger(field?.name);
                      }}
                    />
                    {errors?.companyType && (
                      <p className="text-xs text-red-500">
                        {String(errors?.companyType?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="position"
              rules={{ required: "Select your position" }}
              defaultValue={businessDetails?.position}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      label="Your position"
                      required
                      placeholder="Select your position"
                      options={companyPositions?.map((position) => {
                        return {
                          ...position,
                          value: position?.value,
                          label: position?.label,
                        };
                      })}
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger(field?.name);
                      }}
                    />
                    {errors?.position && (
                      <p className="text-xs text-red-500">
                        {String(errors?.position?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex flex-col w-full gap-2 my-2">
            <Controller
              control={control}
              name="hasArticlesOfAssociation"
              rules={{ required: "Select one of the choices provided" }}
              defaultValue={businessDetailsData?.data?.hasArticlesOfAssociation}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-2">
                    <p className="flex items-center gap-2 text-[15px]">
                      <h4>Does the company have Articles of Association?</h4>
                      <span className="text-red-600">*</span>
                    </p>
                    <menu className="flex items-center w-full gap-6">
                      <Input
                        type="radio"
                        label="Yes"
                        defaultChecked={
                          businessDetailsData?.data?.hasArticlesOfAssociation
                        }
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e.target.value);
                          clearErrors("hasArticlesOfAssociation");
                        }}
                        value={"yes"}
                      />
                      <Input
                        type="radio"
                        label="No"
                        defaultChecked={
                          !businessDetailsData?.data?.hasArticlesOfAssociation
                        }
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e.target.value);
                          clearErrors("hasArticlesOfAssociation");
                        }}
                        value={"no"}
                      />
                      {errors?.hasArticlesOfAssociation && (
                        <p className="text-xs text-red-500">
                          {String(errors?.hasArticlesOfAssociation?.message)}
                        </p>
                      )}
                    </menu>
                  </label>
                );
              }}
            />
          </menu>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              disabled={isFormDisabled}
              value="Back"
              route="/business-registration/new"
            />
            <Button
              primary
              value={
                createCompanyDetailsIsLoading ? <Loader /> : "Save & Continue"
              }
              submit
            />
            {["IN_PREVIEW", "ACTION_REQUIRED"].includes(
              businessDetails?.applicationStatus || ""
            ) && (
              <menu className="flex items-center justify-between w-full gap-3">
                <Button
                  value="Back"
                  route="/business-registration/new"
                  disabled
                />
                <Button
                  value={"Next"}
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setForeignBusinessActiveStep("company_address"));
                  }}
                />
              </menu>
            )}
          </menu>
        </fieldset>
      </form>
      <SimilarBusinessNames companyName={watch("companyName")} />
    </section>
  );
};

export default CompanyDetails;
