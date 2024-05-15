import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "../../../components/inputs/Select";
import {
  businessActivities,
  businessSubActivities,
} from "../../../constants/businessRegistration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../states/store";
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
} from "../../../states/features/enterpriseRegistrationSlice";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../../constants/Users";

interface BusinessActivityProps {
  entry_id: string | null;
  enterprise_business_lines: any;
  status?: string;
}

const BusinessActivity = ({
  entry_id,
  enterprise_business_lines,
  status,
}: BusinessActivityProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    setError,
    trigger,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const [randomNumber, setRandomNumber] = useState<number>(5);
  const { enterprise_registration_active_step } = useSelector(
    (state: RootState) => state.enterpriseRegistration
  );
  const { user } = useSelector((state: RootState) => state.user);
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);

  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedBusinessLines, setSelectedBusinessLines] = useState<any>([]);
  const mainExists = selectedBusinessLines?.find(
    (activity: object) => activity?.main === true
  );

  useEffect(() => {
    if (enterprise_business_lines) {
      setSelectedBusinessLines(enterprise_business_lines);
    }
  }, [enterprise_business_lines]);

  // HANDLE FORM SUBMISSION
  const onSubmit = () => {
    setTimeout(() => {
      dispatch(
        setUserApplications({
          business_lines: {
            enterprise_business_lines: selectedBusinessLines,
            step: { ...enterprise_registration_active_step },
          },
          entry_id,
        })
      );

      if (
        ["in_preview", "action_required"].includes(status) ||
        isLoading?.amend
      ) {
        dispatch(setEnterpriseActiveTab("enterprise_preview_submission"));
      } else {
        // SET THE NEXT STEP AS ACTIVE
        dispatch(setEnterpriseActiveStep("office_address"));
      }

      // SET CURRENT TAB AS COMPLETED
      dispatch(setEnterpriseCompletedStep("business_activity_vat"));

      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <label className="flex flex-col gap-1 w-[50%] items-start">
            <Select
              label="Select sector"
              required
              placeholder="Select sector"
              value={String(selectedSector)}
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
            />
            {errors.activity && (
              <p className="text-[13px] text-red-500">
                {String(errors.activity.message)}
              </p>
            )}
          </label>
          {(selectedSector || enterprise_business_lines) && (
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
                                if (isFormDisabled) return;
                                if (selectedBusinessLines?.length === 3) {
                                  setError('business_lines', {
                                    type: 'manual',
                                    message:
                                      'You can only select a maximum of 3 business activities',
                                  });
                                  setTimeout(() => {
                                    clearErrors('business_lines');
                                  }, 3000);
                                  return;
                                }
                                clearErrors('business_lines');

                                setSelectedBusinessLines([
                                  ...(selectedBusinessLines ?? []),
                                  subActivity,
                                ]);
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
                              if (isFormDisabled) return;
                              const updatedSubActivities =
                                selectedBusinessLines?.filter(
                                  (subActivity: unknown) => {
                                    return (
                                      subActivity?.id !== business_line?.id
                                    );
                                  }
                                );

                              const mainId = selectedBusinessLines.find(
                                (business) => business?.main
                              ).id;
                              if (mainId == business_line?.id)
                                setValue('main_business_activity', '');

                              setSelectedBusinessLines([
                                ...updatedSubActivities,
                              ]);

                              clearErrors('business_lines');
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
          {errors.business_lines && (
            <p className="text-[13px] text-red-500">
              {String(errors.business_lines.message)}
            </p>
          )}
          <menu className="w-[50%]">
            <Controller
              control={control}
              name="main_business_activity"
              rules={{
                required: !mainExists
                  ? 'Main business activity is required'
                  : false,
              }}
              defaultValue={String(
                enterprise_business_lines.find(
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
            {status === 'is_Amending' && (
              <Button
                submit
                value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors)?.length) {
                    return;
                  }
                  setIsLoading({
                    ...isLoading,
                    amend: true,
                    preview: false,
                    submit: false,
                  });
                }}
                disabled={Object.keys(errors)?.length > 0}
              />
            )}
            {['in_preview', 'action_required'].includes(status) && (
              <Button
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors)?.length) {
                    return;
                  }
                  setIsLoading({
                    ...isLoading,
                    preview: true,
                    submit: false,
                    amend: false,
                  });
                }}
                value={
                  isLoading?.preview && !Object.keys(errors)?.length ? (
                    <Loader />
                  ) : (
                    'Save & Complete Review'
                  )
                }
                primary
                submit
                disabled={isFormDisabled || Object.keys(errors)?.length > 0}
              />
            )}
            <Button
              value={isLoading.submit ? <Loader /> : 'Save & Continue'}
              disabled={isFormDisabled || selectedBusinessLines?.length === 0}
              onClick={async () => {
                await trigger();
                if (Object.keys(errors).length > 0) return;
                setIsLoading({
                  ...isLoading,
                  submit: true,
                  preview: false,
                  amend: false,
                });
                dispatch(
                  setUserApplications({ entry_id, status: 'in_progress' })
                );
              }}
              primary
              submit
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default BusinessActivity;
