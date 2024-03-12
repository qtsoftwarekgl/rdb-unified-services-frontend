import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import {
  businessActivities,
  businessSubActivities,
} from '../../../constants/BusinessRegistration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../states/store';
import {
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setCompanyActivities,
  setCompanySubActivities,
} from '../../../states/features/businessRegistrationSlice';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';

interface BusinessActivityProps {
  isOpen: boolean;
}

const BusinessActivity: FC<BusinessActivityProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(5);
  const { company_business_lines, company_activities } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      // UPDATE COMPANY ACTIVITIES
      dispatch(
        setCompanyActivities({
          vat: data?.vat,
          turnover: data?.turnover,
          business_lines: company_business_lines,
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

      if (company_activities?.business_lines?.length > 0) {
        dispatch(setCompanySubActivities(company_activities?.business_lines));
      }
    }
  }, [company_activities, dispatch, setValue]);

  if (!isOpen) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
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
              console.log(e);
            }}
          />
          {errors.activity && (
            <p className="text-[13px] text-red-500">
              {String(errors.activity.message)}
            </p>
          )}
        </label>
        <menu className="w-full flex items-start gap-6">
          <section className="w-full flex flex-col gap-4">
            <h1 className="text-md">Select business line</h1>
            <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
              {businessSubActivities
                ?.slice(0, randomNumber)
                .map((subActivity) => {
                  const subActivityExists = company_business_lines?.find(
                    (activity: object) => activity?.id === subActivity?.id
                  );
                  return (
                    <li
                      key={subActivity.id}
                      className="w-full flex p-2 cursor-pointer items-center gap-3 justify-between rounded-md hover:bg-primary hover:text-white hover:shadow-md"
                    >
                      <p className="text-start">{subActivity?.name}</p>
                      {!subActivityExists ? (
                        <FontAwesomeIcon
                          className="bg-transparent hover:bg-white hover:text-primary rounded-full p-[4px] px-[5px] cursor-pointer ease-in-out duration-300 hover:scale-[1.03]"
                          icon={faPlus}
                          onClick={(e) => {
                            e.preventDefault();
                            if (company_business_lines?.length > 0) {
                              dispatch(
                                setCompanySubActivities([
                                  ...company_business_lines,
                                  subActivity,
                                ])
                              );
                            } else {
                              dispatch(setCompanySubActivities([subActivity]));
                            }
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
          <section className="w-full flex flex-col gap-4">
            <h1 className="text-md">Selected business lines</h1>
            <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
              {company_business_lines?.map(
                (business_line: unknown, index: number) => {
                  const mainExists = company_business_lines?.find(
                    (activity: object) => activity?.main === true
                  );
                  const mainBusinessLine = mainExists?.id === business_line?.id;
                  return (
                    <li
                      key={index}
                      className="w-full flex p-2 items-center gap-3 justify-between rounded-md hover:shadow-md"
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
                                dispatch(
                                  setCompanySubActivities(
                                    company_business_lines?.map(
                                      (activity: object) => {
                                        if (
                                          activity?.id === business_line?.id
                                        ) {
                                          return {
                                            ...activity,
                                            main: false,
                                          };
                                        }
                                        return activity;
                                      }
                                    )
                                  )
                                );
                              }}
                            />
                          </p>
                        )}
                        {!mainExists && (
                          <Link
                            to="#"
                            className="text-[12px] bg-primary text-white p-1 rounded-md shadow-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(
                                setCompanySubActivities(
                                  company_business_lines?.map(
                                    (activity: object) => {
                                      if (activity?.id === business_line?.id) {
                                        return {
                                          ...activity,
                                          main: true,
                                        };
                                      }
                                      return activity;
                                    }
                                  )
                                )
                              );
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
                          console.log(business_line);
                          const updatedSubActivities =
                            company_business_lines?.filter(
                              (subActivity: unknown) => {
                                return subActivity?.id !== business_line?.id;
                              }
                            );
                          dispatch(
                            setCompanySubActivities(updatedSubActivities)
                          );
                        }}
                      />
                    </li>
                  );
                }
              )}
            </ul>
          </section>
        </menu>
        <section className="flex w-full flex-col gap-6">
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
                  <label className="flex flex-col gap-2 w-full">
                    <p className="flex items-center gap-2 text-[15px]">
                      Would you like to register for VAT Certificate{' '}
                      <span className="text-red-600">*</span>
                    </p>
                    <menu className="w-full flex items-center gap-6">
                      <Input
                        type="radio"
                        label="Yes"
                        checked={watch('vat') === 'yes'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setValue('vat', 'yes');
                          }
                        }}
                        name={field?.name}
                      />
                      <Input
                        type="radio"
                        label="No"
                        checked={watch('vat') === 'no'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setValue('vat', 'no');
                          }
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
                defaultValue={0}
                name="turnover"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-[60%]">
                      <Input
                        defaultValue={watch('turnover') || 0}
                        label="Enter expected turnover"
                        required
                        {...field}
                      />
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
          <Button value="Back" />
          <Button value={isLoading ? <Loader /> : 'Continue'} primary submit />
        </menu>
      </form>
    </section>
  );
};

export default BusinessActivity;
