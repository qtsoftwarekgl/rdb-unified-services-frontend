import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  setEnterpriseCompletedStep,
  setEnterpriseBusinessActivityVat,
  setEnterpriseBusinessLines,
} from "../../../states/features/enterpriseRegistrationSlice";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";

interface BusinessActivityProps {
  isOpen: boolean;
}

const BusinessActivity: FC<BusinessActivityProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(5);
  const {
    enterprise_business_lines,
    enterprise_business_activity_vat,
    enterprise_registration_active_step,
  } = useSelector((state: RootState) => state.enterpriseRegistration);

  // HANDLE FORM SUBMISSION
  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      // UPDATE COMPANY ACTIVITIES
      dispatch(
        setEnterpriseBusinessActivityVat({
          business_lines: enterprise_business_lines,
          step: { ...enterprise_registration_active_step },
        })
      );

      // SET CURRENT TAB AS COMPLETED
      dispatch(setEnterpriseCompletedStep("business_activity_vat"));

      // SET THE NEXT STEP AS ACTIVE
      dispatch(setEnterpriseActiveStep("office_address"));

      setIsLoading(false);
    }, 1000);
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    if (enterprise_business_activity_vat) {
      if (enterprise_business_activity_vat?.business_lines?.length > 0) {
        dispatch(
          setEnterpriseBusinessLines(
            enterprise_business_activity_vat?.business_lines
          )
        );
      }
    }
  }, [enterprise_business_activity_vat, dispatch, setValue]);

  if (!isOpen) {
    return null;
  }

  return (
    <section className="flex flex-col w-full gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-6"
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
        <menu className="flex items-start w-full gap-6">
          <section className="flex flex-col w-full gap-4">
            <h1 className="text-md">Select business line</h1>
            <ul className="w-full gap-5 flex flex-col p-4 rounded-md bg-background h-[35vh] overflow-y-scroll">
              {businessSubActivities
                ?.slice(0, randomNumber)
                .map((subActivity) => {
                  const subActivityExists = enterprise_business_lines?.find(
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
                            if (enterprise_business_lines?.length > 0) {
                              dispatch(
                                setEnterpriseBusinessLines([
                                  ...enterprise_business_lines,
                                  subActivity,
                                ])
                              );
                            } else {
                              dispatch(
                                setEnterpriseBusinessLines([subActivity])
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
              {enterprise_business_lines?.map(
                (business_line: unknown, index: number) => {
                  const mainExists = enterprise_business_lines?.find(
                    (activity: object) => activity?.main === true
                  );
                  const mainBusinessLine = mainExists?.id === business_line?.id;
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
                                dispatch(
                                  setEnterpriseBusinessLines(
                                    enterprise_business_lines?.map(
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
                                setEnterpriseBusinessLines(
                                  enterprise_business_lines?.map(
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
                            enterprise_business_lines?.filter(
                              (subActivity: unknown) => {
                                return subActivity?.id !== business_line?.id;
                              }
                            );
                          dispatch(
                            setEnterpriseBusinessLines(updatedSubActivities)
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
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setEnterpriseActiveStep("enterprise_details"));
            }}
          />
          <Button value={isLoading ? <Loader /> : "Continue"} primary submit />
        </menu>
      </form>
    </section>
  );
};

export default BusinessActivity;
