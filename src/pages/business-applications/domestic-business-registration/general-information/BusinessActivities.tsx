import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../../components/inputs/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setBusinessCompletedTab,
} from '../../../../states/features/businessRegistrationSlice';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import Input from '../../../../components/inputs/Input';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import { BusinessActivity, businessId } from '@/types/models/business';
import {
  useLazyFetchBusinessActivitiesSectorsQuery,
  useLazyFetchBusinessLinesQuery,
} from '@/states/api/coreApiSlice';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  useCreateBusinessActivitiesMutation,
  useLazyFetchBusinessActivitiesQuery,
} from '@/states/api/businessRegApiSlice';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

type BusinessActivityProps = {
  businessId: businessId;
  status: string;
};

const BusinessActivities = ({ businessId, status }: BusinessActivityProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    clearErrors,
    setError,
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
  const disableForm = RDBAdminEmailPattern.test(user?.email);

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
      if ((businessLinesError as ErrorResponse).status === 500) {
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
      dispatch(setBusinessActiveStep('executive_management'));
      dispatch(setBusinessActiveTab('management'));
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
              disabled={disableForm}
            >
              <Controller
                name="sectorCode"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-full items-start">
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
                  {businessLinesIsLoading && (
                        <figure className="flex items-center justify-center w-full h-full">
                          <Loader />
                        </figure>
                      )}
                    {businessLinesIsSuccess && 
                  <section className="flex flex-col w-full gap-4">
                    <h1 className="text-md">Select business line</h1>
                    <ul className="w-full gap-2 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                      {!businessLinesIsLoading &&
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
                  </section>}
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
                                  <FontAwesomeIcon className='text-[12px]' icon={faMinus} />
                                  Remove from list
                                </Link>
                              </li>
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
                            defaultValue={String(
                              selectedMainBusinessLine?.code
                            )}
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
              {businessActivitiesIsSuccess && (
                <section className="flex flex-col w-full gap-6">
                  <h1 className="text-lg font-semibold text-center uppercase">
                    VAT Certificate
                  </h1>
                  <menu className="w-[50%] flex flex-col gap-6">
                    <Controller
                      name="isVATRegistered"
                      rules={{ required: 'Select choice' }}
                      defaultValue={businessActivitiesData?.data?.isVATRegistered}
                      control={control}
                      render={({ field }) => {
                        return (
                          <label className="flex flex-col w-full gap-2">
                            <p className="flex items-center gap-2 text-[15px]">
                              Would you like to register for VAT Certificate{' '}
                              <span className="text-red-600">*</span>
                            </p>
                            <menu className="flex items-center w-full gap-6">
                              <Input
                                type="radio"
                                label="Yes"
                                defaultChecked={
                                  businessActivitiesData?.data?.isVATRegistered
                                }
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  clearErrors('isVATRegistered');
                                }}
                                value={'yes'}
                              />
                              <Input
                                type="radio"
                                label="No"
                                defaultChecked={
                                  !businessActivitiesData?.data?.isVATRegistered
                                }
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  clearErrors('isVATRegistered');
                                }}
                                value={'no'}
                              />
                              {errors?.isVATRegistered && (
                                <p className="text-[13px] text-red-500">
                                  {String(errors?.isVATRegistered.message)}
                                </p>
                              )}
                            </menu>
                          </label>
                        );
                      }}
                    />
                    {watch('isVATRegistered') === 'yes' && (
                      <Controller
                        name="turnover"
                        control={control}
                        render={({ field }) => {
                          return (
                            <label className="flex flex-col gap-1 w-[60%]">
                              <Input
                                defaultValue={watch('turnover')}
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
                'IN_PROGRESS',
                'IN_PREVIEW',
                'ACTION_REQUIRED',
                'IS_AMENDING',
              ].includes(status) && (
                <menu
                  className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
                >
                  <Button
                    value="Back"
                    disabled={disableForm}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setBusinessActiveStep('company_address'));
                    }}
                  />
                  {status === 'IS_AMENDING' && (
                    <Button
                      submit
                      value={'Complete Amendment'}
                      disabled={Object.keys(errors).length > 0 || disableForm}
                    />
                  )}
                  {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) && (
                    <Button
                      value={'Save & Complete Review'}
                      submit
                      primary
                      disabled={disableForm || Object.keys(errors).length > 0}
                    />
                  )}
                  <Button
                    value={
                      createBusinessActivitiesIsLoading ? (
                        <Loader />
                      ) : (
                        'Save & Continue'
                      )
                    }
                    submit
                    primary
                    disabled={disableForm || Object.keys(errors).length > 0}
                  />
                </menu>
              )}
              {[
                'IN_REVIEW',
                'IS_APPROVED',
                'PENDING_APPROVAL',
                'PENDING_REJECTION',
              ].includes(status) && (
                <menu className="flex items-center gap-3 justify-between">
                  <Button
                    value={'Back'}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setBusinessActiveStep('company_address'));
                    }}
                  />
                  <Button
                    value={'Next'}
                    primary
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setBusinessCompletedTab('general_information'));
                      dispatch(setBusinessCompletedStep('business_activity_vat'));
                      dispatch(setBusinessActiveStep('board_of_directors'));
                      dispatch(setBusinessActiveTab('management'));
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
