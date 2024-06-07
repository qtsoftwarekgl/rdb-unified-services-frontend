import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../../components/inputs/Select';
import {
  businessActivities,
  businessSubActivities,
} from '../../../../constants/businessRegistration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import Input from '../../../../components/inputs/Input';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import { setUserApplications } from '../../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '../../../../constants/Users';

export interface business_company_activities {
  vat: string;
  turnover: number | string;
  business_lines: Array<object>;
}

interface BusinessActivityProps {
  isOpen: boolean;
  company_activities: business_company_activities;
  entryId: string | null;
  status: string;
}

const BusinessActivity: FC<BusinessActivityProps> = ({
  isOpen,
  company_activities,
  entryId,
  status,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const [randomNumber, setRandomNumber] = useState<number>(5);
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedBusinessLines, setSelectedBusinessLines] = useState<
    Array<object>
  >(company_activities?.business_lines);
  const mainExists = selectedBusinessLines?.find(
    (activity: object) => activity?.main === true
  );

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    // CHECK IF BUSINESS LINES ARE SELECTED
    if (company_activities?.business_lines?.length <= 0) {
      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
      setError('business_lines', {
        type: 'manual',
        message: 'Select at least one business activity',
      });
      return;
    }
    if (
      selectedBusinessLines?.find(
        (activity: object) => activity?.main === true
      ) === undefined
    ) {
      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });

      return;
    }
    clearErrors('business_lines');

    setTimeout(() => {
      // UPDATE COMPANY ACTIVITIES
      dispatch(
        setUserApplications({
          entryId,
          active_tab: 'management',
          active_step: 'board_of_directors',
          company_activities: {
            ...company_activities,
            vat: data?.vat,
            turnover: data?.turnover,
            business_lines: selectedBusinessLines,
            step: 'business_activity_vat',
          },
        })
      );

      // SET ACTIVE TAB AND STEP
      let active_tab = 'management';
      let active_step = 'board_of_directors';

      if (
        ['in_preview', 'action_required'].includes(status) ||
        isLoading?.amend
      ) {
        active_tab = 'preview_submission';
        active_step = 'preview_submission';
      }

      // SET CURRENT STEP AS COMPLETED
      dispatch(setBusinessCompletedStep('business_activity_vat'));

      // SET NEXT TAB AS ACTIVE
      dispatch(setBusinessActiveTab(active_tab));

      // SET THE NEXT STEP AS ACTIVE
      dispatch(setBusinessActiveStep(active_step));

      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    if (company_activities) {
      setValue('vat', company_activities?.vat);
      setValue('turnover', company_activities?.turnover);
    }
  }, [company_activities, dispatch, setValue]);

  useEffect(() => {
    if (company_activities?.business_lines) {
      setSelectedBusinessLines(company_activities?.business_lines);
    }
  }, [company_activities]);

  if (!isOpen) {
    return null;
  }

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <label className="flex flex-col gap-1 w-[50%] items-start">
            <Select
              label="Select sector"
              required
              defaultValue={String(businessActivities[0]?.id)}
              options={businessActivities?.map((activity) => {
                return {
                  label: activity.name,
                  value: String(activity.id),
                };
              })}
              onChange={(e) => {
                setRandomNumber(Math.floor(Math.random() * 10) + 1);
                setSelectedSector(e);
              }}
              value={selectedSector}
            />
            {errors.activity && (
              <p className="text-[13px] text-red-500">
                {String(errors.activity.message)}
              </p>
            )}
          </label>
          {(selectedSector || company_activities?.business_lines) && (
            <menu className="flex items-start w-full gap-6">
              <section className="flex flex-col w-full gap-4">
                <h1 className="text-md">Select business activity</h1>
                <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                  {businessSubActivities
                    ?.slice(0, randomNumber)
                    .map((subActivity) => {
                      const subActivityExists = selectedBusinessLines?.find(
                        (activity: object) => activity?.id === subActivity?.id
                      );
                      return (
                        <li
                          key={subActivity.id}
                          className="flex items-center justify-between w-full gap-3 p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white hover:shadow-md"
                        >
                          <p className="text-start">{subActivity?.name}</p>
                          {!subActivityExists ? (
                            <FontAwesomeIcon
                              className="bg-transparent hover:bg-white hover:text-primary rounded-full p-[4px] px-[5px] cursor-pointer ease-in-out duration-300 hover:scale-[1.03]"
                              icon={faPlus}
                              onClick={(e) => {
                                e.preventDefault();
                                if (disableForm) return;

                                setSelectedBusinessLines([
                                  ...(selectedBusinessLines ?? []),
                                  subActivity,
                                ]);

                                clearErrors('business_lines');
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            />
                          )}
                        </li>
                      );
                    })}
                </ul>
              </section>
              <section className="flex flex-col w-full gap-4">
                <h1 className="text-md">Selected business activities</h1>
                <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                  {selectedBusinessLines?.map(
                    (business_line: unknown, index: number) => {
                      const mainBusinessLine =
                        mainExists?.id === business_line?.id;
                      return (
                        <li
                          key={index}
                          className="flex items-center justify-between w-full gap-3 p-2 rounded-md hover:shadow-md"
                        >
                          <menu className="flex items-center gap-2">
                            <p className="text-start">{business_line?.name}</p>
                            {mainExists && mainBusinessLine && (
                              <p className="text-[12px] bg-green-700 text-white p-[3px] px-2 rounded-md shadow-sm flex items-center gap-2">
                                Main Activity
                              </p>
                            )}
                          </menu>
                          <FontAwesomeIcon
                            className="bg-transparent hover:bg-primary hover:text-white rounded-full p-[7px] px-2 cursor-pointer ease-in-out duration-300 hover:scale-[1.03]"
                            icon={faMinus}
                            onClick={(e) => {
                              e.preventDefault();
                              if (disableForm) return;
                              const updatedSubActivities =
                                selectedBusinessLines?.filter(
                                  (subActivity: unknown) => {
                                    return (
                                      subActivity?.id !== business_line?.id
                                    );
                                  }
                                );
                              console.log(company_activities?.business_lines);
                              const mainId = selectedBusinessLines?.find(
                                (business) => business?.main
                              )?.id;
                              if (mainId == business_line?.id)
                                setValue('main_business_activity', '');
                              setSelectedBusinessLines([
                                ...updatedSubActivities,
                              ]);
                              if (selectedBusinessLines?.length <= 1) {
                                setError('business_lines', {
                                  type: 'manual',
                                  message:
                                    'Select at least one business activity',
                                });
                              }
                            }}
                          />
                        </li>
                      );
                    }
                  )}
                </ul>
              </section>
            </menu>
          )}
          {selectedBusinessLines && (
            <menu className="w-[50%]">
              <Controller
                control={control}
                name="main_business_activity"
                rules={{
                  required: 'Main business activity is required',
                }}
                defaultValue={String(
                  selectedBusinessLines.find(
                    (activity: object) => activity?.main === true
                  )?.id ?? ''
                )}
                render={({ field }) => {
                  return (
                    <Select
                      label="Select main business activity"
                      required
                      placeholder="Select here..."
                      options={selectedBusinessLines?.map((activity) => {
                        return {
                          label: activity.name,
                          value: String(activity.id),
                        };
                      })}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const updatedActivities = selectedBusinessLines?.map(
                          (activity: object) => {
                            if (activity?.id == e) {
                              return {
                                ...activity,
                                main: true,
                              };
                            } else {
                              return {
                                ...activity,
                                main: false,
                              };
                            }
                          }
                        );
                        setSelectedBusinessLines([...updatedActivities]);
                        clearErrors('main_business_activity');
                      }}
                    />
                  );
                }}
              />
              {errors.main_business_activity && (
                <p className="text-[13px] text-red-500">
                  {String(errors.main_business_activity.message)}
                </p>
              )}
            </menu>
          )}
          <section className="flex flex-col w-full gap-6">
            <h1 className="text-lg font-semibold text-center uppercase">
              VAT Certificate
            </h1>
            <menu className="w-[50%] flex flex-col gap-6">
              <Controller
                name="vat"
                rules={{ required: 'Select choice' }}
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
                          checked={watch('vat') === 'yes'}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            clearErrors('vat');
                          }}
                          value={'yes'}
                        />
                        <Input
                          type="radio"
                          label="No"
                          checked={watch('vat') === 'no'}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            clearErrors('vat');
                          }}
                          value={'no'}
                        />
                        {errors?.vat && (
                          <p className="text-[13px] text-red-500">
                            {String(errors?.vat.message)}
                          </p>
                        )}
                      </menu>
                    </label>
                  );
                }}
              />
              {watch('vat') === 'yes' && (
                <Controller
                  name="turnover"
                  defaultValue={
                    company_activities?.turnover || watch('turnover')
                  }
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
          {[
            'IN_PROGRESS',
            'in_preview',
            'action_required',
            'is_amending',
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
              {status === 'is_amending' && (
                <Button
                  submit
                  value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                  disabled={Object.keys(errors).length > 0 || disableForm}
                  onClick={async () => {
                    await trigger();
                    if (Object.keys(errors).length > 0) return;
                    setIsLoading({
                      ...isLoading,
                      preview: false,
                      submit: false,
                      amend: true,
                    });
                  }}
                />
              )}
              {['in_preview', 'action_required'].includes(status) && (
                <Button
                  value={
                    isLoading?.preview ? <Loader /> : 'Save & Complete Review'
                  }
                  onClick={() => {
                    setIsLoading({
                      ...isLoading,
                      submit: false,
                      preview: true,
                    });
                    dispatch(
                      setUserApplications({ entryId, status: 'in_preview' })
                    );
                  }}
                  submit
                  primary
                  disabled={disableForm || Object.keys(errors).length > 0}
                />
              )}
              <Button
                value={isLoading?.submit ? <Loader /> : 'Save & Continue'}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors).length > 0) return;
                  setIsLoading({
                    ...isLoading,
                    submit: true,
                    preview: false,
                  });
                  dispatch(
                    setUserApplications({ entryId, status: 'IN_PROGRESS' })
                  );
                }}
                submit
                primary
                disabled={
                  disableForm ||
                  selectedBusinessLines?.length === 0 ||
                  Object.keys(errors).length > 0
                }
              />
            </menu>
          )}
          {['in_review', 'is_approved', 'pending_approval', 'pending_rejection'].includes(status) && (
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
                  dispatch(setBusinessActiveStep('board_of_directors'));
                  dispatch(setBusinessActiveTab('management'));
                }}
              />
            </menu>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default BusinessActivity;
