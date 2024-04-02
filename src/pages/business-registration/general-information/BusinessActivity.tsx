import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import {
  businessActivities,
  businessSubActivities,
} from '../../../constants/businessRegistration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../states/features/businessRegistrationSlice';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';
import { setUserApplications } from '../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '../../../constants/Users';

export interface business_company_activities {
  vat: string;
  turnover: number | string;
  business_lines: Array<object>;
}

interface BusinessActivityProps {
  isOpen: boolean;
  company_activities: business_company_activities;
  entry_id: string | null;
}

const BusinessActivity: FC<BusinessActivityProps> = ({
  isOpen,
  company_activities,
  entry_id,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(5);
  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    // CHECK IF BUSINESS LINES ARE SELECTED
    if (company_activities?.business_lines?.length <= 0) {
      setIsLoading(false);
      setError('business_lines', {
        type: 'manual',
        message: 'Select at least one business line',
      });
      return;
    }
    if (
      company_activities?.business_lines?.find(
        (activity: object) => activity?.main === true
      ) === undefined
    ) {
      setIsLoading(false);
      setError('business_lines', {
        type: 'manual',
        message: 'Select a main business line',
      });
      return;
    }
    setIsLoading(true);
    clearErrors('business_lines');

    setTimeout(() => {
      // UPDATE COMPANY ACTIVITIES
      dispatch(
        setUserApplications({
          entry_id,
          active_tab: 'management',
          active_step: 'board_of_directors',
          company_activities: {
            ...company_activities,
            vat: data?.vat,
            turnover: data?.turnover,
            business_lines: company_activities?.business_lines,
            step: 'business_activity_vat',
          },
        })
      );

      // SET CURRENT STEP AS COMPLETED
      dispatch(setBusinessCompletedStep('business_activity_vat'));

      // SET CURRENT TAB AS COMPLETED
      dispatch(setBusinessActiveTab('general_information'));

      // SET THE NEXT TAB AS ACTIVE
      dispatch(setBusinessActiveTab('management'));

      setIsLoading(false);
    }, 1000);
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    if (company_activities) {
      setValue('vat', company_activities?.vat);
      setValue('turnover', company_activities?.turnover);
    }
  }, [company_activities, dispatch, setValue]);

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
              defaultValue={{
                label: businessActivities[0]?.name,
                value: businessActivities[0]?.id,
              }}
              options={businessActivities?.map((activity) => {
                return {
                  label: activity.name,
                  value: activity.id,
                };
              })}
              onChange={(e) => {
                setRandomNumber(Math.floor(Math.random() * 10) + 1);
                return e;
              }}
            />
            {errors.activity && (
              <p className="text-[13px] text-red-500">
                {String(errors.activity.message)}
              </p>
            )}
          </label>
          <menu className="flex items-start w-full gap-6">
            <section className="flex flex-col w-full gap-4">
              <h1 className="text-md">Select business line</h1>
              <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                {businessSubActivities
                  ?.slice(0, randomNumber)
                  .map((subActivity) => {
                    const subActivityExists =
                      company_activities?.business_lines?.find(
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
                              if (
                                company_activities?.business_lines?.length > 0
                              ) {
                                dispatch(
                                  setUserApplications({
                                    entry_id,
                                    company_activities: {
                                      ...company_activities,
                                      business_lines: [
                                        subActivity,
                                        ...company_activities.business_lines,
                                      ],
                                    },
                                  })
                                );
                              } else {
                                dispatch(
                                  setUserApplications({
                                    entry_id,
                                    company_activities: {
                                      ...company_activities,
                                      business_lines: [subActivity],
                                    },
                                  })
                                );
                              }
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
              <h1 className="text-md">Selected business lines</h1>
              <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                {company_activities?.business_lines?.map(
                  (business_line: unknown, index: number) => {
                    const mainExists = company_activities?.business_lines?.find(
                      (activity: object) => activity?.main === true
                    );
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
                              Main{' '}
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="cursor-pointer text-[12px] ease-in-out duration-300 hover:scale-[1.03] hover:text-white hover:bg-red-700 rounded-full p-[2px] bg-red-700"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (disableForm) return;
                                  dispatch(
                                    setUserApplications({
                                      entry_id,
                                      company_activities: {
                                        ...company_activities,
                                        business_lines:
                                          company_activities?.business_lines?.map(
                                            (activity: object) => {
                                              if (
                                                activity?.id ===
                                                business_line?.id
                                              ) {
                                                return {
                                                  ...activity,
                                                  main: false,
                                                };
                                              }
                                              return activity;
                                            }
                                          ),
                                      },
                                    })
                                  );
                                }}
                              />
                            </p>
                          )}
                          {!mainExists && (
                            <Link
                              to="#"
                              className="text-[11px] bg-primary text-white p-1 rounded-md shadow-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                if (disableForm) return;
                                dispatch(
                                  setUserApplications({
                                    entry_id,
                                    company_activities: {
                                      ...company_activities,
                                      business_lines:
                                        company_activities?.business_lines?.map(
                                          (activity: object) => {
                                            if (
                                              activity?.id === business_line?.id
                                            ) {
                                              return {
                                                ...activity,
                                                main: true,
                                              };
                                            }
                                            return activity;
                                          }
                                        ),
                                    },
                                  })
                                );
                                clearErrors('business_lines');
                              }}
                            >
                              Set main
                            </Link>
                          )}
                        </menu>
                        <FontAwesomeIcon
                          className="bg-transparent hover:bg-primary hover:text-white rounded-full p-[7px] px-2 cursor-pointer ease-in-out duration-300 hover:scale-[1.03]"
                          icon={faMinus}
                          onClick={(e) => {
                            e.preventDefault();
                            if (disableForm) return;
                            const updatedSubActivities =
                              company_activities?.business_lines?.filter(
                                (subActivity: unknown) => {
                                  return subActivity?.id !== business_line?.id;
                                }
                              );
                            dispatch(
                              setUserApplications({
                                entry_id,
                                company_activities: {
                                  ...company_activities,
                                  business_lines: updatedSubActivities,
                                },
                              })
                            );
                            if (
                              company_activities?.business_lines?.length <= 1
                            ) {
                              setError('business_lines', {
                                type: 'manual',
                                message: 'Select at least one business line',
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
          {errors.business_lines && (
            <p className="text-[13px] text-red-500 text-center">
              {String(errors.business_lines.message)}
            </p>
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
                          value={'yes'}
                          onChange={(e) => {
                            field.onChange(e?.target.value);
                          }}
                          name={field?.name}
                        />
                        <Input
                          type="radio"
                          label="No"
                          checked={watch('vat') === 'no'}
                          value={'no'}
                          onChange={(e) => {
                            field.onChange(e?.target.value);
                          }}
                          name={field?.name}
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
                  rules={{
                    required:
                      watch('vat') === 'yes' ? 'Turnover is required' : false,
                    validate: (value) => {
                      if (watch('vat') === 'yes' && value <= 0) {
                        return 'Turnover must be greater than 0';
                      } else {
                        return true;
                      }
                    },
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-[60%]">
                        <Input
                          defaultValue={watch('turnover')}
                          label="Enter expected turnover"
                          required
                          {...field}
                        />
                        {errors?.turnover && (
                          <p className="text-[13px] text-red-500">
                            {String(errors?.turnover.message)}
                          </p>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            </menu>
          </section>
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
            {isAmending && (
              <Button
                value={'Complete Amendment'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveTab('preview_submission'));
                }}
              />
            )}
            <Button
              value={isLoading ? <Loader /> : 'Save & Continue'}
              submit
              primary
              disabled={disableForm}
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default BusinessActivity;
