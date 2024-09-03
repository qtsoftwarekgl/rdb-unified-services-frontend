import { FC, useEffect } from "react";
import { Controller, FieldValues, FormProvider, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import Loader from "../../../../components/Loader";
import Select from "../../../../components/inputs/Select";
import { companyPositions } from "../../../../constants/businessRegistration";
import Button from "../../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
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
  uploadAmendmentAttachmentThunk,
} from "@/states/features/businessSlice";
import { useCreateOrUpdateCompanyDetailsMutation } from "@/states/api/foreignCompanyRegistrationApiSlice";
import { convertDecimalToPercentage } from "@/helpers/strings";
import { businessId } from "@/types/models/business";
import SimilarBusinessNames from "../../SimilarBusinessNames";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import ResolutionAttachment from "@/components/resolution-attachment/ResolutionAttachment";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ApplicationStatus } from "@/Enums/ApplicationStatus";
import useReservedName from "../../domestic-business-registration/general-information/hooks/useReservedName";
import SelectReservedName from "../../domestic-business-registration/general-information/SelectReservedName";
import { setShowSelectReservedName } from "@/states/ui/businessRegistrationUISlice";

type CompanyDetailsProps = {
  businessId: businessId;
};

const CompanyDetails: FC<CompanyDetailsProps> = ({ businessId }) => {
  // REACT HOOK FORM
  const methods = useForm();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    watch,
  } = methods;


  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  const { businessDetails, nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // Resolution attachment
  const { file, fileName, attachmentType } = useSelector(
    (state: RootState) => state.resolutionAttachment
  );

  const {selectedReservedName} = useSelector((state: RootState) => state.businessRegistrationUI);
  const {reservedNames} = useSelector((state: RootState) => state.nameReservation);
  const {handleSetDefaultSelectedReservedName} = useReservedName();


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

  useEffect(() => {
    if(businessDetails && reservedNames && reservedNames.length > 0){
      handleSetDefaultSelectedReservedName(businessDetails, reservedNames);
    }
  },[businessDetails, reservedNames])

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
      data: createCompanyDetailsData,
    },
  ] = useCreateOrUpdateCompanyDetailsMutation();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createOrUpdateCompanyDetailsMutation({
      businessId: businessId,
      companyName: data.companyName,
      companyType: data.companyType,
      companyCategory: data.companyCategory,
      position: data.position,
      hasArticlesOfAssociation: data.hasArticlesOfAssociation === "yes",
      reservationId: data?.reservationId || null
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
      toast.success("Company details created or updated successfully");
      if (businessDetails?.applicationStatus === ApplicationStatus.IsAmending) {
        // upload resolution attachment
        if (file && businessId)
          dispatch(
            uploadAmendmentAttachmentThunk({
              file,
              fileName,
              attachmentType,
              businessId: businessId.toString(),
              amendmentId: createCompanyDetailsData?.data?.amendmentId,
            })
          );
      }

      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Company Details"
          )?.id,
        })
      );
      dispatch(
        createNavigationFlowThunk({
          businessId,
          massId: findNavigationFlowMassIdByStepName(
            navigationFlowMassList,
            "Company Address"
          ),
          isActive: true,
        })
      );
    }
  }, [
    createCompanyDetailsIsSuccess,
    createCompanyDetailsError,
    createCompanyDetailsIsError,
    dispatch,
    businessId,
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
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6">
          <menu className="flex items-start w-2/4 gap-6">
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
                      readOnly={selectedReservedName ? true : false}
                      label="Search company name"
                      required
                      suffixIconPrimary
                      // suffixIcon={faSearch}
                      showSearchSuffix={!selectedReservedName}
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
                    <p className="text-xs text-primary cursor-pointer hover:underline" onClick={() => dispatch(setShowSelectReservedName(true))}> {`${selectedReservedName ? "Change" : "Use"} reserved name`} </p>
                    {errors.companyName && (
                      <p className="text-xs text-red-500">
                        {String(errors.companyName.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-2/4 gap-6">
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
                      <RadioGroup
                        value={watch("hasArticlesOfAssociation")}
                        onValueChange={field.onChange}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <label htmlFor="yes">Yes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <label htmlFor="no">No</label>
                        </div>
                      </RadioGroup>
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
          {businessDetails?.applicationStatus ===
            ApplicationStatus.IsAmending && (
            // Resolution Attachment
            <ResolutionAttachment control={control} errors={errors} />
          )}
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button value="Back" route="/services" />
            <Button
              primary
              value={
                createCompanyDetailsIsLoading ? <Loader /> : "Save & Continue"
              }
              submit
            />
          </menu>
        </fieldset>
      </form>
      <SelectReservedName/>
      </FormProvider>
      <SimilarBusinessNames businessName={watch("companyName")} />
    </section>
  );
};

export default CompanyDetails;
