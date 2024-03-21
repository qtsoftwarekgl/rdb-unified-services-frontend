import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
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
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../states/features/foreignBranchRegistrationSlice";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import { setUserApplications } from "../../../states/features/userApplicationSlice";

interface BusinessActivityProps {
  entry_id: string | null;
  foreign_company_activities: any;
}

const BusinessActivity = ({
  entry_id,
  foreign_company_activities,
}: BusinessActivityProps) => {
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

  const { user } = useSelector((state: RootState) => state.user);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      // UPDATE COMPANY ACTIVITIES
      dispatch(
        setUserApplications({
          entry_id,
          foreign_company_activities: {
            vat: data?.vat,
            turnover: data?.turnover,
            business_lines: foreign_company_activities?.business_lines,
            step: "foreign_business_activity_vat",
          },
        })
      );

      // SET CURRENT STEP AS COMPLETED
      dispatch(
        setForeignBusinessCompletedStep("foreign_business_activity_vat")
      );

      // SET CURRENT TAB AS COMPLETED
      dispatch(setForeignBusinessActiveTab("foreign_general_information"));

      // SET THE NEXT TAB AS ACTIVE
      dispatch(setForeignBusinessActiveTab("foreign_management"));

      setIsLoading(false);
    }, 1000);
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    if (foreign_company_activities) {
      setValue("vat", foreign_company_activities?.vat);
      setValue("turnover", foreign_company_activities?.turnover);
    }
  }, [foreign_company_activities, dispatch, setValue]);

  return (
    <section className="flex flex-col w-full gap-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={user?.email?.includes("info@rdb")}
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
                      foreign_company_activities?.business_lines?.find(
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
                              if (user?.email?.includes("info@rdb")) return;
                              if (
                                foreign_company_activities?.business_lines
                                  ?.length > 0
                              ) {
                                dispatch(
                                  setUserApplications({
                                    foreign_company_activities: {
                                      ...foreign_company_activities,
                                      business_lines: [
                                        ...foreign_company_activities.business_lines,
                                        subActivity,
                                      ],
                                    },
                                    entry_id,
                                  })
                                );
                              } else {
                                dispatch(
                                  setUserApplications({
                                    foreign_company_activities: {
                                      ...foreign_company_activities,
                                      business_lines: [subActivity],
                                    },
                                    entry_id,
                                  })
                                );
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
            <section className="flex flex-col w-full gap-4">
              <h1 className="text-md">Selected business lines</h1>
              <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
                {foreign_company_activities?.business_lines?.map(
                  (business_line: unknown, index: number) => {
                    const mainExists =
                      foreign_company_activities?.business_lines?.find(
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
                              Main{" "}
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="cursor-pointer text-[12px] ease-in-out duration-300 hover:scale-[1.03] hover:text-white hover:bg-red-700 rounded-full p-[2px] bg-red-700"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (user?.email?.includes("info@rdb")) return;
                                  dispatch(
                                    setUserApplications({
                                      foreign_company_activities: {
                                        ...foreign_company_activities,
                                        business_lines:
                                          foreign_company_activities?.business_lines?.map(
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
                                      entry_id,
                                    })
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
                                if (user?.email?.includes("info@rdb")) return;
                                dispatch(
                                  setUserApplications({
                                    foreign_company_activities: {
                                      business_lines:
                                        foreign_company_activities?.business_lines?.map(
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
                                    entry_id,
                                  })
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
                            if (user?.email?.includes("info@rdb")) return;
                            const updatedSubActivities =
                              foreign_company_activities?.business_lines?.filter(
                                (subActivity: unknown) => {
                                  return subActivity?.id !== business_line?.id;
                                }
                              );
                            dispatch(
                              setUserApplications({
                                foreign_company_activities: {
                                  ...foreign_company_activities,
                                  business_lines: updatedSubActivities,
                                },
                                entry_id,
                              })
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
          <section className="flex flex-col w-full gap-6">
            <h1 className="text-lg font-semibold text-center uppercase">
              VAT Certificate
            </h1>
            <menu className="w-[50%] flex flex-col gap-6">
              <Controller
                name="vat"
                rules={{ required: "Select choice" }}
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
                          checked={watch("vat") === "yes"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue("vat", "yes");
                            }
                          }}
                          name={field?.name}
                        />
                        <Input
                          type="radio"
                          label="No"
                          checked={watch("vat") === "no"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue("vat", "no");
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
              {watch("vat") === "yes" && (
                <Controller
                  defaultValue={0}
                  name="turnover"
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-1 w-[60%]">
                        <Input
                          defaultValue={watch("turnover") || 0}
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
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setForeignBusinessActiveStep("foreign_company_address")
                );
              }}
            />
            <Button
              value={isLoading ? <Loader /> : "Continue"}
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
