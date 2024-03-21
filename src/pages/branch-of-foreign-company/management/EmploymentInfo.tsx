import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../states/features/foreignBranchRegistrationSlice";
import Loader from "../../../components/Loader";
import { setUserApplications } from "../../../states/features/userApplicationSlice";

interface EmploymentInfoProps {
  entry_id: string | null;
  foreign_employment_info: any;
}

const EmploymentInfo = ({
  entry_id,
  foreign_employment_info,
}: EmploymentInfoProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  // SET DEFAULT VALUES
  useEffect(() => {
    if (foreign_employment_info) {
      setValue("has_employees", foreign_employment_info?.has_employees);
      setValue("hiring_date", foreign_employment_info?.hiring_date);
      setValue("employees_no", foreign_employment_info?.employees_no);
      setValue("reference_date", foreign_employment_info?.reference_date);
    }
  }, [foreign_employment_info, setValue]);

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          foreign_employment_info: {
            ...data,
            step: "foreign_employment_info",
          },
        })
      );
      dispatch(setForeignBusinessCompletedStep("foreign_employment_info"));
      dispatch(setForeignBusinessActiveStep("foreign_beneficial_owners"));
      dispatch(setForeignBusinessActiveTab("foreign_beneficial_owners"));
    }, 1000);
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={user?.email?.includes("info@rdb")}
        >
          <Controller
            name="has_employees"
            control={control}
            defaultValue={foreign_employment_info?.has_employees}
            rules={{ required: "Select a choice" }}
            render={({ field }) => {
              return (
                <menu className="flex flex-col w-full gap-3">
                  <h4 className="flex items-center gap-1 text-[15px]">
                    Does the branch have employees?
                    <span className="text-red-600">*</span>
                  </h4>
                  <ul className="flex items-center gap-6">
                    <Input
                      type="radio"
                      label="Yes"
                      checked={watch("has_employees") === "yes"}
                      name={field?.name}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(field?.name, "yes");
                        }
                      }}
                    />
                    <Input
                      type="radio"
                      label="No"
                      name={field?.name}
                      checked={watch("has_employees") === "no"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue(field?.name, "no");
                        }
                      }}
                    />
                  </ul>
                  {errors?.has_employees && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.has_employees?.message)}
                    </p>
                  )}
                </menu>
              );
            }}
          />
          <menu
            className={`${
              watch("has_employees") === "yes" ? "flex" : "hidden"
            } w-full items-start gap-5 flex-wrap`}
          >
            <Controller
              name="hiring_date"
              control={control}
              defaultValue={foreign_employment_info?.hiring_date}
              rules={{
                required:
                  watch("has_employees") === "yes"
                    ? "Hiring date is required"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      defaultValue={foreign_employment_info?.hiring_date}
                      type="date"
                      required
                      label="Hiring Date"
                      {...field}
                    />
                    {errors?.hiring_date && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.hiring_date?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="employees_no"
              defaultValue={foreign_employment_info?.employees_no || 0}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      label="Number of employees"
                      defaultValue={foreign_employment_info?.employees_no || 0}
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="reference_date"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      type="date"
                      label="Account reference date"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setForeignBusinessActiveStep("foreign_senior_management")
                );
              }}
            />
            <Button
              value={isLoading ? <Loader /> : "Continue"}
              submit
              primary
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default EmploymentInfo;
