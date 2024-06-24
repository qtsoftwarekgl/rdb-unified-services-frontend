import { useEffect } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Select from "../../../../components/inputs/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../states/store";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { ErrorResponse, Link } from "react-router-dom";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import Loader from "../../../../components/Loader";
import { RDBAdminEmailPattern } from "../../../../constants/Users";
import { BusinessActivity, businessId } from "@/types/models/business";
import {
  useLazyFetchBusinessActivitiesSectorsQuery,
  useLazyFetchBusinessLinesQuery,
} from "@/states/api/coreApiSlice";
import {
  addSelectedBusinessLine,
  removeSelectedBusinessLine,
  setBusinessActivitiesList,
  setBusinessLinesList,
  setSelectedBusinessActivity,
  setSelectedBusinessLinesList,
  setSelectedMainBusinessLine,
} from "@/states/features/businessActivitySlice";
import { toast } from "react-toastify";
import {
  useCreateBusinessActivitiesMutation,
  useLazyFetchBusinessActivitiesQuery,
} from "@/states/api/businessRegistrationApiSlice";
import { setBusinessActiveStep } from "@/states/features/businessRegistrationSlice";

interface BusinessActivityProps {
  businessId: businessId;
  applicationStatus: string;
}

const BusinessActivities = ({
  businessId,
  applicationStatus,
}: BusinessActivityProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessActivitiesList,
    selectedBusinessActivity,
    businessLinesList,
    selectedBusinessLinesList,
    selectedMainBusinessLine,
  } = useSelector((state: RootState) => state.businessActivity);
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);

  // INITIALIZE CREATE BUSINESS ACTIVITIES MUTATION
  const [
    createBusinessActivities,
    {
      isLoading: createBusinessActivitiesIsLoading,
      isSuccess: createBusinessActivitiesIsSuccess,
      isError: createBusinessActivitiesIsError,
      error: createBusinessActivitiesError,
    },
  ] = useCreateBusinessActivitiesMutation();

  // INITIALIZE FETCH BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      isLoading: businessActivitiesIsLoading,
      isSuccess: businessActivitiesIsSuccess,
      isError: businessActivitiesIsError,
      error: businessActivitiesError,
    },
  ] = useLazyFetchBusinessActivitiesQuery();

  // FETCH BUSINESS ACTIVITIES
  useEffect(() => {
    fetchBusinessActivities({ businessId });
  }, [businessId, fetchBusinessActivities]);

  // HANDLE FETCH BUSINESS ACTIVITIES RESPONSE
  useEffect(() => {
    if (businessActivitiesIsError) {
      if ((businessActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching business activities. Please try again later."
        );
      }
    } else if (businessActivitiesIsSuccess) {
      dispatch(
        setSelectedBusinessLinesList(businessActivitiesData?.data?.businessLine)
      );
      if (
        selectedMainBusinessLine === undefined ||
        Object.keys(selectedMainBusinessLine).length === 0
      ) {
        dispatch(
          setSelectedMainBusinessLine(
            businessActivitiesData?.data?.businessLine?.find(
              (activity: BusinessActivity) =>
                activity.description ===
                businessActivitiesData?.data?.mainBusinessActivity
            )
          )
        );
      }
    }
  }, [
    businessActivitiesData,
    businessActivitiesError,
    businessActivitiesIsError,
    businessActivitiesIsSuccess,
    dispatch,
    selectedMainBusinessLine,
  ]);

  // INITIALIZE FETCH BUSINESS ACTIVITY SECTOR QUERY
  const [
    fetchBusinessActivitiesSectors,
    {
      data: businessActivitiesSectorsData,
      isLoading: businessActivitiesSectorsIsLoading,
      isSuccess: businessActivitiesSectorsIsSuccess,
      isError: businessActivitiesSectorsIsError,
      error: businessActivitiesSectorsError,
    },
  ] = useLazyFetchBusinessActivitiesSectorsQuery();

  // INITIALIZE FETCH BUSINESS LINES QUERY
  const [
    fetchBusinessLines,
    {
      data: businessLinesData,
      isLoading: businessLinesIsLoading,
      isSuccess: businessLinesIsSuccess,
      isError: businessLinesIsError,
      error: businessLinesError,
    },
  ] = useLazyFetchBusinessLinesQuery();

  // FETCH BUSINESS ACTIVITY SECTORS
  useEffect(() => {
    fetchBusinessActivitiesSectors({});
  }, [fetchBusinessActivitiesSectors]);

  // FETCH BUSINESS LINES
  useEffect(() => {
    if (selectedBusinessActivity?.code) {
      fetchBusinessLines({ sectorCode: selectedBusinessActivity?.code });
    }
  }, [fetchBusinessLines, selectedBusinessActivity]);

  // HANDLE BUSINESS ACTIVITY SECTORS RESPONSE
  useEffect(() => {
    if (businessActivitiesSectorsIsError) {
      if ((businessActivitiesSectorsError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching business activities. Please try again later."
        );
      } else {
        toast.error(
          (businessActivitiesSectorsError as ErrorResponse)?.data?.message
        );
      }
    } else if (businessActivitiesSectorsIsSuccess) {
      dispatch(setBusinessActivitiesList(businessActivitiesSectorsData?.data));
    }
  }, [
    businessActivitiesData?.data?.length,
    businessActivitiesSectorsData,
    businessActivitiesSectorsError,
    businessActivitiesSectorsIsError,
    businessActivitiesSectorsIsSuccess,
    dispatch,
  ]);

  // HANDLE BUSINESS LINES RESPONSE
  useEffect(() => {
    if (businessLinesIsError) {
      if ((businessLinesError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching business lines. Please try again later."
        );
      } else {
        toast.error((businessLinesError as ErrorResponse)?.data?.message);
      }
    } else if (businessLinesIsSuccess) {
      dispatch(setBusinessLinesList(businessLinesData?.data));
    }
  }, [
    businessLinesData?.data,
    businessLinesError,
    businessLinesIsError,
    businessLinesIsSuccess,
    dispatch,
  ]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    // VALIDATE BUSINESS LINES
    if (selectedBusinessLinesList?.length === 0) {
      return toast.error("Please select at least one business line");
    }
    if (!selectedMainBusinessLine) {
      console.log(selectedMainBusinessLine);
      setError("mainBusinessActivity", {
        type: "manual",
        message: "Please select the main business activity",
      });
      return;
    }

    createBusinessActivities({
      isVATRegistered: data?.VATRegistered === "yes",
      businessLines: selectedBusinessLinesList,
      mainBusinessActivity: selectedMainBusinessLine?.description,
      businessId,
    });
  };

  // HANDLE CREATE BUSINESS ACTIVITIES RESPONSE
  useEffect(() => {
    if (createBusinessActivitiesIsError) {
      if ((createBusinessActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while creating business activities. Please try again later."
        );
      } else {
        toast.error(
          (createBusinessActivitiesError as ErrorResponse)?.data?.message
        );
      }
    } else if (createBusinessActivitiesIsSuccess) {
      toast.success("Business activities have been successfully created");
      dispatch(setForeignBusinessActiveStep("executive_management"));
      dispatch(setForeignBusinessActiveTab("management"));
    }
  }, [
    createBusinessActivitiesError,
    createBusinessActivitiesIsError,
    createBusinessActivitiesIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex flex-col w-full gap-5">
      {businessActivitiesSectorsIsLoading ||
        (businessActivitiesIsLoading && (
          <figure className="min-h-[40vh] flex items-center justify-center">
            <Loader />
          </figure>
        ))}
      {businessActivitiesSectorsIsSuccess &&
        businessActivitiesList?.length > 0 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset
              className="flex flex-col w-full gap-6"
              disabled={isFormDisabled}
            >
              <Controller
                name="sectorCode"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Select
                        label="Select sector"
                        required
                        defaultValue={String(businessActivitiesList[0].code)}
                        options={businessActivitiesList?.map((activity) => {
                          return {
                            label: activity.description,
                            value: String(activity.code),
                          };
                        })}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          dispatch(
                            setSelectedBusinessActivity(
                              businessActivitiesList.find(
                                (activity) => String(activity.code) == String(e)
                              )
                            )
                          );
                        }}
                      />
                      {errors.activity && (
                        <p className="text-[13px] text-red-500">
                          {String(errors.activity.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              {(selectedBusinessActivity ||
                businessActivitiesList?.length > 0) && (
                <menu className="flex flex-col items-start w-full gap-6">
                  <section className="flex flex-col w-full gap-4">
                    <h1 className="text-md">Select business line</h1>
                    <ul className="w-full gap-2 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                      {businessLinesIsLoading && (
                        <figure className="flex items-center justify-center w-full h-full">
                          <Loader />
                        </figure>
                      )}
                      {!businessLinesIsLoading &&
                        businessLinesList.map(
                          (businessLine: BusinessActivity) => {
                            const isSelected = selectedBusinessLinesList?.find(
                              (activity: BusinessActivity) =>
                                activity.code == businessLine.code
                            );
                            return (
                              <div className="flex items-center gap-2">
                                <li
                                  key={businessLine.code}
                                  className="flex items-center justify-between flex-1 gap-3 p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white"
                                >
                                  <p className="text-start text-[13px] max-w-[85%]">
                                    {businessLine?.description}
                                  </p>
                                </li>
                                <Link
                                  to={"#"}
                                  className="text-[13px] hover:underline w-fit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isSelected) return;
                                    dispatch(
                                      addSelectedBusinessLine(businessLine)
                                    );
                                  }}
                                >
                                  {isSelected ? (
                                    <FontAwesomeIcon
                                      icon={faCircleCheck}
                                      className="text-primary"
                                    />
                                  ) : (
                                    <p className="w-fit text-[13px] text-primary">
                                      Add to list
                                    </p>
                                  )}
                                </Link>
                              </div>
                            );
                          }
                        )}
                    </ul>
                  </section>
                  {selectedBusinessLinesList?.length > 0 ? (
                    <section className="flex flex-col w-full gap-4">
                      <h1 className="text-md">Selected business activities</h1>
                      <ul className="w-full gap-2 flex flex-col p-4 rounded-md bg-background max-h-[35vh] overflow-y-scroll">
                        {selectedBusinessLinesList?.map(
                          (businesLine: BusinessActivity, index: number) => {
                            const isMainBusinessLine =
                              selectedMainBusinessLine?.code ==
                              businesLine.code;
                            return (
                              <div className="flex items-center gap-2">
                                <li
                                  key={index}
                                  className="flex items-center justify-between flex-1 gap-3 p-2 rounded-md cursor-pointer hover:shadow-xs hover:bg-primary hover:text-white"
                                >
                                  <menu className="flex items-center gap-2">
                                    <p className="text-start text-[13px]">
                                      {businesLine?.description}{" "}
                                      {isMainBusinessLine && (
                                        <span className="text-[11px] bg-primary text-white rounded-md p-1 ml-2">
                                          Main activity
                                        </span>
                                      )}
                                    </p>
                                  </menu>
                                </li>
                                <Link
                                  to={"#"}
                                  className="text-[13px] hover:underline text-red-400"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(
                                      removeSelectedBusinessLine(businesLine)
                                    );
                                  }}
                                >
                                  Remove from list
                                </Link>
                              </div>
                            );
                          }
                        )}
                      </ul>
                    </section>
                  ) : (
                    <p className="text-[13px] text-primary font-medium w-full text-center">
                      Start adding business activities to the list to manage
                      them here.
                    </p>
                  )}
                </menu>
              )}
              {selectedBusinessLinesList?.length > 0 && (
                <menu className="w-full">
                  <Controller
                    control={control}
                    name="mainBusinessActivity"
                    render={({ field }) => {
                      return (
                        <Select
                          label="Select main business activity"
                          required
                          placeholder="Select here..."
                          defaultValue={String(selectedMainBusinessLine?.code)}
                          options={selectedBusinessLinesList?.map(
                            (activity) => {
                              return {
                                label: activity.description,
                                value: String(activity.code),
                              };
                            }
                          )}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            dispatch(
                              setSelectedMainBusinessLine(
                                selectedBusinessLinesList.find(
                                  (activity) =>
                                    String(activity.code) == String(e)
                                )
                              )
                            );
                            clearErrors("mainBusinessActivity");
                          }}
                        />
                      );
                    }}
                  />
                  {errors.mainBusinessActivity && (
                    <p className="text-[13px] text-red-500">
                      {String(errors.mainBusinessActivity.message)}
                    </p>
                  )}
                </menu>
              )}
              {businessActivitiesIsSuccess && (
                <section className="flex flex-col w-full gap-6">
                  <h1 className="text-lg font-semibold text-center uppercase">
                    VAT Certificate
                  </h1>
                  <menu className="w-[50%] flex flex-col gap-6">
                    <Controller
                      name="VATRegistered"
                      rules={{ required: "Select choice" }}
                      defaultValue={businessActivitiesData?.data?.vatregistered}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col w-full gap-2">
                            <p className="flex items-center gap-2 text-[15px]">
                              Would you like to register for VAT Certificate{" "}
                              <span className="text-red-600">*</span>
                            </p>
                            <menu className="flex items-center w-full gap-6">
                              <Input
                                type="radio"
                                label="Yes"
                                defaultChecked={
                                  businessActivitiesData?.data?.vatregistered
                                }
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  clearErrors("VATRegistered");
                                }}
                                value={"yes"}
                              />
                              <Input
                                type="radio"
                                label="No"
                                defaultChecked={
                                  !businessActivitiesData?.data?.vatregistered
                                }
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  clearErrors("VATRegistered");
                                }}
                                value={"no"}
                              />
                              {errors?.VATRegistered && (
                                <p className="text-[13px] text-red-500">
                                  {String(errors?.VATRegistered.message)}
                                </p>
                              )}
                            </menu>
                          </label>
                        );
                      }}
                    />
                    {watch("VATRegistered") === "yes" && (
                      <Controller
                        name="turnover"
                        control={control}
                        render={({ field }) => {
                          return (
                            <label className="flex flex-col gap-1 w-[60%]">
                              <Input
                                defaultValue={watch("turnover")}
                                label="Enter expected turnover (optional)"
                                {...field}
                              />
                              <p className="text-[10px] text-secondary">
                                Turnover amount is not required to submit the
                                application. You can also add it later after the
                                application has been processed.
                              </p>
                            </label>
                          );
                        }}
                      />
                    )}
                  </menu>
                </section>
              )}
              {[
                "IN_PROGRESS",
                "IN_PREVIEW",
                "ACTION_REQUIRED",
                "IS_AMENDING",
              ].includes(applicationStatus) && (
                <menu
                  className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
                >
                  <Button
                    value="Back"
                    disabled={isFormDisabled}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setForeignBusinessActiveStep("company_address"));
                    }}
                  />
                  {applicationStatus === "IS_AMENDING" && (
                    <Button
                      submit
                      value={"Complete Amendment"}
                      disabled={
                        (errors && Object.keys(errors).length > 0) ||
                        isFormDisabled
                      }
                    />
                  )}
                  {["IN_PREVIEW", "ACTION_REQUIRED"].includes(
                    applicationStatus
                  ) && (
                    <Button
                      value={"Save & Complete Review"}
                      submit
                      primary
                      disabled={
                        isFormDisabled ||
                        (errors && Object.keys(errors).length > 0)
                      }
                    />
                  )}
                  <Button
                    value={
                      createBusinessActivitiesIsLoading ? (
                        <Loader />
                      ) : (
                        "Save & Continue"
                      )
                    }
                    submit
                    primary
                    disabled={
                      isFormDisabled ||
                      (errors && Object.keys(errors).length > 0)
                    }
                  />
                </menu>
              )}
              {[
                "IN_REVIEW",
                "IS_APPROVED",
                "PENDING_APPROVAL",
                "PENDING_REJECTION",
              ].includes(applicationStatus) && (
                <menu className="flex items-center justify-between gap-3">
                  <Button
                    value={"Back"}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setForeignBusinessActiveStep("company_address"));
                    }}
                  />
                  <Button
                    value={"Next"}
                    primary
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        setForeignBusinessActiveTab("general_information")
                      );
                      dispatch(
                        setForeignBusinessCompletedStep("business_activity_vat")
                      );
                      dispatch(setBusinessActiveStep("board_of_directors"));
                      dispatch(setBusinessActiveStep("management"));
                    }}
                  />
                </menu>
              )}
            </fieldset>
          </form>
        )}
    </section>
  );
};

export default BusinessActivities;
