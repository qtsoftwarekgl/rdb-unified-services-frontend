import { Controller, FieldValues, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import Input from "../../../../components/inputs/Input";
import Loader from "../../../../components/Loader";
import Button from "../../../../components/inputs/Button";
import { ErrorResponse, Link, useNavigate } from "react-router-dom";
import { businessId } from "@/types/models/business";
import {
  useCreateBusinessDetailsMutation,
  useLazyGetBusinessDetailsQuery,
  useLazySearchBusinessNameAvailabilityQuery,
} from "@/states/api/businessRegApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  setBusinessDetails,
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
} from "@/states/features/businessSlice";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { convertDecimalToPercentage } from "@/helpers/strings";
import SimilarBusinessNames from "@/pages/business-applications/SimilarBusinessNames";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";

type EnterpriseDetailsProps = {
  businessId: businessId;
  applicationStatus?: string;
};

export const EnterpriseDetails = ({
  businessId,
  applicationStatus,
}: EnterpriseDetailsProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { nameAvailabilitiesList, businessDetails } = useSelector(
    (state: RootState) => state.business
  );
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      error: businessDetailsError,
      isFetching: businessDetailsIsFetching,
      isError: businessDetailsIsError,
      isSuccess: businessDetailsIsSuccess,
    },
  ] = useLazyGetBusinessDetailsQuery();

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    clearErrors,
    setError,
  } = useForm();

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId });
    }
  }, [getBusinessDetails, businessId]);

  // HANDLE GET BUSINESS DETAILS RESPONSE
  useEffect(() => {
    if (businessDetailsIsError) {
      if ((businessDetailsError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while fetching business data");
      } else {
        toast.error((businessDetailsError as ErrorResponse)?.data?.message);
      }
    } else if (businessDetailsIsSuccess) {
      dispatch(setBusinessDetails(businessDetailsData?.data));
    }
  }, [
    businessDetailsData,
    businessDetailsError,
    businessDetailsIsError,
    businessDetailsIsSuccess,
    dispatch,
  ]);

  // INITIALIZE SEARCH BUSINESS NAME AVAILABILITY QUERY
  const [
    searchBusinessNameAvailability,
    {
      data: searchBusinessNameData,
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
      if (
        searchBusinessNameData?.data?.find(
          (availability: { similarity: number; companyName: string }) =>
            availability?.similarity === 1.0
        ) !== undefined
      ) {
        setError("companyName", {
          type: "manual",
          message: "Company name already exists",
        });
      }
      dispatch(setNameAvailabilitiesList(searchBusinessNameData?.data));
    }
  }, [
    dispatch,
    searchBusinessNameData?.data,
    searchBusinessNameError,
    searchBusinessNameIsError,
    searchBusinessNameIsSuccess,
    setError,
  ]);

  // INITIALIZE CREATE COMPANY DETAILS MUTATION
  const [
    createBusinessDetails,
    {
      error: createBusinessDetailsError,
      isLoading: createBusinessDetailsIsLoading,
      isError: createBusinessDetailsIsError,
      isSuccess: createBusinessDetailsIsSuccess,
    },
  ] = useCreateBusinessDetailsMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createBusinessDetails({
      businessId,
      enterpriseName: data?.enterpriseName,
      enterpriseBusinessName: data?.enterpriseBusinessName,
    });
  };

  // HANDLE CREATE BUSINESS DETAILS RESPONSE
  useEffect(() => {
    if (createBusinessDetailsIsError) {
      if ((createBusinessDetailsError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred while creating business details");
      } else {
        toast.error(
          (createBusinessDetailsError as ErrorResponse)?.data?.message
        );
      }
    } else if (createBusinessDetailsIsSuccess) {
      toast.success("Business details created successfully");
      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Enterprise Details"
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
    createBusinessDetailsError,
    createBusinessDetailsIsError,
    createBusinessDetailsIsSuccess,
    dispatch,
    navigate,
  ]);

  return (
    <section className="flex flex-col w-full gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {businessDetailsIsFetching ? (
          <figure className="w-full flex items-center gap-2 justify-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <fieldset className="flex flex-col w-full gap-6">
            <menu className="flex items-start gap-6 p-8 border">
              <Controller
                name="enterpriseName"
                control={control}
                rules={{
                  required: "Enterprise name is required",
                }}
                defaultValue={
                  user?.username || `${user?.firstName} ${user?.lastName || ""}`
                }
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-1/2 gap-1">
                      <Input
                        label={" Enterprise Name"}
                        required
                        readOnly
                        {...field}
                      />
                    </label>
                  );
                }}
              />
              <Controller
                name="enterpriseBusinessName"
                control={control}
                defaultValue={businessDetails?.enterpriseBusinessName || ""}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-1/2 gap-1">
                      <Input
                        suffixIcon={faSearch}
                        suffixIconHandler={(e) => {
                          e.preventDefault();
                          if (!field?.value || field?.value?.length < 3) {
                            return;
                          }
                          clearErrors("enterpriseBusinessName");
                          searchBusinessNameAvailability({
                            companyName: field?.value,
                          });
                        }}
                        label={`Business Name`}
                        readOnly={false}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e?.target?.value?.length > 0) {
                            setError("enterpriseBusinessName", {
                              type: "manual",
                              message:
                                "Check if enterprise name is available before proceeding",
                            });
                          } else {
                            clearErrors("enterpriseBusinessName");
                          }
                        }}
                        suffixIconPrimary
                      />
                      {errors?.enterpriseBusinessName && (
                        <p className="text-xs text-red-500">
                          {String(errors.enterpriseBusinessName.message)}
                        </p>
                      )}
                      <menu className="flex flex-col w-full gap-2">
                        {searchBusinessNameIsFetching && (
                          <figure className="flex items-center gap-2">
                            <Loader />
                            <p className="text-[13px]">Searching...</p>
                          </figure>
                        )}
                        {searchBusinessNameIsSuccess &&
                          nameAvailabilitiesList?.length > 0 &&
                          !errors?.enterpriseBusinessName && (
                            <section className="flex flex-col gap-1">
                              <p className="text-[11px] text-red-600">
                                The given name has a similarity of up to{" "}
                                {convertDecimalToPercentage(
                                  nameAvailabilitiesList[0]?.similarity
                                )}
                                % with other business names. Consider changing
                                it to avoid conflicts.
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
                          !errors?.enterpriseBusinessName &&
                          field?.value?.length > 0 && (
                            <p className="text-[11px] text-green-600 px-2">
                              {field.value} is available for use
                            </p>
                          )}
                      </menu>
                    </label>
                  );
                }}
              />
            </menu>
            <menu
              className={`flex items-center mt-8 gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button value="Back" route="/services" />
              {["IN_PREVIEW", "ACTION_PREVIEW"].includes(
                String(applicationStatus)
              ) && <Button value={"Save & Complete Review"} primary submit />}
              <Button
                disabled={Object.keys(errors)?.length > 0}
                value={
                  createBusinessDetailsIsLoading ? (
                    <Loader />
                  ) : (
                    "Save & Continue"
                  )
                }
                submit
                primary
              />
            </menu>
          </fieldset>
        )}
      </form>
      <SimilarBusinessNames businessName={watch("enterpriseBusinessName")} />
    </section>
  );
};

export default EnterpriseDetails;
