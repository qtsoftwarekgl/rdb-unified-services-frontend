import { FC, useEffect } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import Loader from "../../../../components/Loader";
import validateInputs from "../../../../helpers/validations";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import { setForeignBusinessActiveStep } from "../../../../states/features/foreignCompanyRegistrationSlice";
import Select from "../../../../components/inputs/Select";
import { countriesList } from "../../../../constants/countries";
import { businessId } from "@/types/models/business";
import { useLazyGetBusinessAddressQuery } from "@/states/api/businessRegApiSlice";
import { ErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";
import { setBusinessAddress } from "@/states/features/businessSlice";
import { useCreateOrUpdateCompanyAddressMutation } from "@/states/api/foreignCompanyRegistrationApiSlice";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";

interface CompanyAddressProps {
  businessId: businessId;
  applicationStatus: string;
}

const CompanyAddress: FC<CompanyAddressProps> = ({
  businessId,
  applicationStatus,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessAddress } = useSelector((state: RootState) => state.business);
  const isFormDisabled = [
    "IN_REVIEW",
    "APPROVED",
    "PENDING_APPROVAL",
    "PENDING_REJECTION",
  ].includes(applicationStatus);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessAddress,
    {
      data: businessAddressData,
      error: businessAddressError,
      isLoading: businessAddressIsLoading,
      isError: businessAddressIsError,
      isSuccess: businessAddressIsSuccess,
    },
  ] = useLazyGetBusinessAddressQuery();

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusinessAddress({ businessId });
    }
  }, [getBusinessAddress, businessId]);

  // HANDLE GET BUSINESS RESPONSE
  useEffect(() => {
    if (businessAddressIsError) {
      if ((businessAddressError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching business data");
      } else {
        toast.error((businessAddressError as ErrorResponse)?.data?.message);
      }
    } else if (businessAddressIsSuccess) {
      dispatch(setBusinessAddress(businessAddressData?.data));
    }
  }, [
    businessAddressData,
    businessAddressError,
    businessAddressIsError,
    businessAddressIsSuccess,
    dispatch,
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (businessAddress && Object.keys(businessAddress).length > 0) {
      setValue(
        "countryOfIncorporation",
        businessAddress?.countryOfIncorporation
      );
    }
  }, [businessAddress, dispatch, setValue]);

  // INITIALIZE CREATE OR UPDATE COMPANY ADDRESS MUTATION
  const [
    createCompanyAddress,
    {
      error: createCompanyAddressError,
      isLoading: createCompanyAddressIsLoading,
      isError: createCompanyAddressIsError,
      isSuccess: createCompanyAddressIsSuccess,
    },
  ] = useCreateOrUpdateCompanyAddressMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createCompanyAddress({
      businessId: businessId,
      countryOfIncorporation: data?.countryOfIncorporation,
      city: data?.city,
      zipCode: data.zipCode,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      streetName: data?.streetName,
    });
  };

  // HANDLE CREATE OR UPDATE COMPANY ADDRESS RESPONSE
  useEffect(() => {
    if (createCompanyAddressIsError) {
      if ((createCompanyAddressError as ErrorResponse)?.status === 500) {
        toast.error(
          "An error occurred while creating or updating company address"
        );
      } else {
        toast.error(
          (createCompanyAddressError as ErrorResponse)?.data?.message
        );
      }
    } else if (createCompanyAddressIsSuccess) {
      toast.success("Company address created or updated successfully");
      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Company Address"
          )?.id,
        })
      );
      dispatch(
        createNavigationFlowThunk({
          businessId,
          massId: findNavigationFlowMassIdByStepName(
            navigationFlowMassList,
            "Business Activity & VAT"
          ),
          isActive: true,
        })
      );
    }
  }, [
    businessId,
    createCompanyAddressError,
    createCompanyAddressIsError,
    createCompanyAddressIsSuccess,
    dispatch,
  ]);

  // SET DEFAULT VALUES FROM BUSINESS ADDRESS
  useEffect(() => {
    if (businessAddress && Object.keys(businessAddress).length > 0) {
      setValue(
        "countryOfIncorporation",
        businessAddress?.countryOfIncorporation
      );
      setValue("city", businessAddress?.city);
      setValue("zipCode", businessAddress?.zipCode);
      setValue("email", businessAddress?.email);
      setValue("phoneNumber", businessAddress?.phoneNumber);
      setValue("streetName", businessAddress?.streetName);
    }
  }, [businessAddress, setValue]);

  return (
    <section className="flex flex-col w-full gap-6">
      {businessAddressIsLoading && (
        <figure className="min-h-[40vh] flex items-center justify-center w-full">
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
              name="countryOfIncorporation"
              control={control}
              defaultValue={watch("countryOfIncorporation")}
              rules={{ required: "Country is required" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      placeholder="Select country of incorporation"
                      {...field}
                      required
                      defaultValue={watch("countryOfIncorporation")}
                      label="Country of Incorporation"
                      options={countriesList
                        ?.filter((country) => country.code !== "RW")
                        .map((country) => {
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
                    {errors?.countryOfIncorporation && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.countryOfIncorporation.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="city"
              control={control}
              defaultValue={watch("city") || businessAddress?.city}
              rules={{ required: "city is required" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="City"
                      defaultValue={watch("city") || businessAddress?.city}
                      placeholder="City"
                      {...field}
                    />
                    {errors?.city && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.city.message)}
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
              name="streetName"
              defaultValue={watch("streetName") || businessAddress?.streetName}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      defaultValue={
                        watch("streetName") || businessAddress?.streetName
                      }
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
              defaultValue={watch("zipCode") || businessAddress?.zipCode}
              name="zipCode"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="ZIP Code"
                      placeholder="ZIP code"
                      defaultValue={
                        watch("zipCode") || businessAddress?.zipCode
                      }
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="email"
              control={control}
              defaultValue={watch("email") || businessAddress?.email}
              rules={{
                required: watch("email") ? "Email address is required" : false,
                validate: (value) => {
                  return (
                    validateInputs(String(value), "email") ||
                    "Invalid email address"
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      label="Email"
                      defaultValue={watch("email") || businessAddress?.email}
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
              name="phoneNumber"
              control={control}
              defaultValue={
                watch("phoneNumber") || businessAddress?.phoneNumber
              }
              rules={{
                required: "Phone number is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <p className="flex items-center gap-1">
                      Phone number <span className="text-red-600">*</span>
                    </p>
                    <menu className="relative flex items-center gap-0">
                      <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                        <select
                          className="w-full !text-[12px]"
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
                        defaultValue={
                          watch("phoneNumber") || businessAddress?.phoneNumber
                        }
                        className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                        type="text"
                      />
                    </menu>
                    {errors?.phoneNumber && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phoneNumber?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          {/* TO DO status should be passed from the parent component by fetch the business */}
          {[
            "IN_PROGRESS",
            "ACTION_REQUIRED",
            "IS_AMENDING",
            "IN_PREVIEW",
          ].includes(applicationStatus) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={isFormDisabled}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    createNavigationFlowThunk({
                      businessId,
                      massId: findNavigationFlowMassIdByStepName(
                        navigationFlowMassList,
                        "Company Details"
                      ),
                      isActive: true,
                    })
                  );
                }}
              />
              {["IS_AMENDING"].includes(applicationStatus) && (
                <Button submit value={"Complete Amendment"} />
              )}
              {["IN_PREVIEW", "ACTION_REQUIRED"].includes(
                applicationStatus
              ) && (
                <Button
                  value={"Save & Complete Preview"}
                  primary
                  submit
                  disabled={isFormDisabled}
                />
              )}
              <Button
                value={
                  createCompanyAddressIsLoading ? <Loader /> : "Save & Continue"
                }
                primary
                submit
                disabled={isFormDisabled}
              />
            </menu>
          )}
          {[
            "IN_REVIEW",
            "APPROVED",
            "PENDING_APPROVAL",
            "PENDING_REJECTION",
          ].includes(applicationStatus) && (
            <menu className="flex items-center justify-between gap-3">
              <Button
                value={"Back"}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setForeignBusinessActiveStep("company_details"));
                }}
              />
              <Button
                value={"Next"}
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    setForeignBusinessActiveStep("business_activity_vat")
                  );
                }}
              />
            </menu>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default CompanyAddress;
