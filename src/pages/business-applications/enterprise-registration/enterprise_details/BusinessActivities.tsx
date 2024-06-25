import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../../components/inputs/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import {
  setEnterpriseActiveStep,
  setEnterpriseCompletedStep,
} from '../../../../states/features/enterpriseRegistrationSlice';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { BusinessActivity, businessId } from '@/types/models/business';
import { ErrorResponse, Link } from 'react-router-dom';
import {
  addSelectedBusinessLine,
  removeSelectedBusinessLine,
  setBusinessActivitiesList,
  setBusinessLinesList,
  setSelectedBusinessActivity,
  setSelectedBusinessLinesList,
  setSelectedMainBusinessLine,
} from '@/states/features/businessActivitySlice';
import {
  useLazyFetchBusinessActivitiesSectorsQuery,
  useLazyFetchBusinessLinesQuery,
} from '@/states/api/coreApiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useCreateBusinessActivitiesMutation,
  useLazyFetchBusinessActivitiesQuery,
} from '@/states/api/businessRegApiSlice';

type BusinessActivitiesProps = {
  businessId: businessId;
  applicationStatus?: string;
};

const BusinessActivities = ({
  businessId,
  applicationStatus,
}: BusinessActivitiesProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
    setError,
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

  // INITIALIZE FETCH BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      isFetching: businessActivitiesIsFetching,
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
          'An error occured while fetching business activities. Please try again later.'
        );
      }
    } else if (businessActivitiesIsSuccess) {
      dispatch(
        setSelectedBusinessLinesList(businessActivitiesData?.data?.businessLine)
      );
      if (selectedMainBusinessLine === undefined) {
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
      isFetching: businessActivitiesSectorsIsFetching,
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
      isFetching: businessLinesIsFetching,
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
      if ((businessActivitiesSectorsError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occured while fetching business activities. Please try again later.'
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
      if ((businessLinesError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occured while fetching business lines. Please try again later.'
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

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    // VALIDATE BUSINESS LINES
    if (selectedBusinessLinesList?.length === 0) {
      return toast.error('Please select at least one business line');
    }
    if (!selectedMainBusinessLine) {
      setError('mainBusinessActivity', {
        type: 'manual',
        message: 'Please select the main business activity',
      });
      return;
    }

    createBusinessActivities({
      isVATRegistered: data?.isVATRegistered === 'yes',
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
          'An error occured while creating business activities. Please try again later.'
        );
      } else {
        toast.error(
          (createBusinessActivitiesError as ErrorResponse)?.data?.message
        );
      }
    } else if (createBusinessActivitiesIsSuccess) {
      toast.success('Business activities have been successfully created');
      dispatch(setEnterpriseActiveStep('office_address'));
      dispatch(setEnterpriseCompletedStep('business_activity_vat'));
    }
  }, [
    createBusinessActivitiesError,
    createBusinessActivitiesIsError,
    createBusinessActivitiesIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6">
          <Controller
            name="sectorCode"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full items-start">
                  <Select
                    label="Select sector"
                    required
                    defaultValue={String(businessActivitiesList[0]?.code)}
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
          {(selectedBusinessActivity || businessActivitiesList?.length > 0) && (
            <menu className="flex flex-col items-start w-full gap-6">
              {businessActivitiesSectorsIsFetching && (
                <figure className="flex items-center justify-center w-full h-full">
                  <Loader />
                </figure>
              )}
              {businessLinesIsSuccess && (
                <section className="flex flex-col w-full gap-4">
                  <h1 className="text-md">Select business line</h1>
                  <ul className="w-full gap-2 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                    {!businessLinesIsFetching &&
                      businessLinesList.map(
                        (businessLine: BusinessActivity) => {
                          const isSelected = selectedBusinessLinesList?.find(
                            (activity: BusinessActivity) =>
                              activity.code == businessLine.code
                          );
                          return (
                            <li
                              key={businessLine.code}
                              className="flex items-center justify-between w-full gap-3 p-2 rounded-md hover:shadow-xs hover:bg-gray-50"
                            >
                              <p className="text-start text-[13px] max-w-[85%]">
                                {businessLine?.description}
                              </p>
                              <Link
                                to={'#'}
                                className="text-[12px] flex items-center text-primary gap-2 p-1 rounded-md hover:bg-primary hover:text-white roundedm-md cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (isSelected) return;
                                  if (selectedBusinessLinesList?.length >= 3) {
                                    toast.info(
                                      'Cannot add more than 3 business lines'
                                    );
                                    return;
                                  }
                                  dispatch(
                                    addSelectedBusinessLine(businessLine)
                                  );
                                }}
                              >
                                {isSelected ? (
                                  <FontAwesomeIcon icon={faCircleCheck} />
                                ) : (
                                  <menu className="w-fit flex items-center gap-2 text-[13px]">
                                    <FontAwesomeIcon
                                      className="text-[12px]"
                                      icon={faPlus}
                                    />
                                    Add to list
                                  </menu>
                                )}
                              </Link>
                            </li>
                          );
                        }
                      )}
                  </ul>
                </section>
              )}
              {selectedBusinessLinesList?.length > 0 ? (
                <section className="flex flex-col w-full gap-4">
                  <h1 className="text-md">Selected business activities</h1>
                  {businessActivitiesIsFetching ? (
                    <figure className="flex items-center justify-center w-full h-full">
                      <Loader />
                    </figure>
                  ) : (
                    <ul className="w-full gap-2 flex flex-col p-4 rounded-md bg-background max-h-[35vh] overflow-y-scroll">
                      {selectedBusinessLinesList?.map(
                        (businesLine: BusinessActivity, index: number) => {
                          const isMainBusinessLine =
                            selectedMainBusinessLine?.code == businesLine.code;
                          return (
                            <li
                              key={index}
                              className="flex items-center justify-between w-full gap-3 p-2 rounded-md hover:shadow-xs hover:bg-gray-50"
                            >
                              <menu className="flex items-center gap-2">
                                <p className="text-start text-[13px]">
                                  {businesLine?.description}{' '}
                                  {isMainBusinessLine && (
                                    <span className="text-[11px] bg-primary text-white rounded-md p-1 ml-2">
                                      Main activity
                                    </span>
                                  )}
                                </p>
                              </menu>
                              <Link
                                to={'#'}
                                className="text-[12px] flex items-center text-red-600 gap-2 p-1 rounded-md hover:bg-primary hover:text-white roundedm-md cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(
                                    removeSelectedBusinessLine(businesLine)
                                  );
                                }}
                              >
                                <FontAwesomeIcon
                                  className="text-[12px]"
                                  icon={faMinus}
                                />
                                Remove from list
                              </Link>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </section>
              ) : (
                <p className="text-[13px] text-primary font-medium w-full text-center">
                  Start adding business activities to the list to manage them
                  here.
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
                      options={selectedBusinessLinesList?.map((activity) => {
                        return {
                          label: activity.description,
                          value: String(activity.code),
                        };
                      })}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        dispatch(
                          setSelectedMainBusinessLine(
                            selectedBusinessLinesList.find(
                              (activity) => String(activity.code) == String(e)
                            )
                          )
                        );
                        clearErrors('mainBusinessActivity');
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

          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setEnterpriseActiveStep('company_details'));
              }}
            />
            {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(
              String(applicationStatus)
            ) && <Button value={'Save & Complete Review'} primary submit />}
            <Button
              value={
                createBusinessActivitiesIsLoading ? (
                  <Loader />
                ) : (
                  'Save & Continue'
                )
              }
              primary
              submit
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default BusinessActivities;
