import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from "../../../../states/features/businessRegistrationSlice";
import Loader from "../../../../components/Loader";
import { ErrorResponse, Link } from "react-router-dom";
import ViewDocument from "@/pages/user-company-details/ViewDocument";
import { businessId } from "@/types/models/business";
import Select from "@/components/inputs/Select";
import { dayHoursArray } from "@/constants/time";
import { useCreateEmploymentInfoMutation } from "@/states/api/businessRegApiSlice";
import moment from "moment";
import { toast } from "react-toastify";
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from "@/states/features/navigationFlowSlice";
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from "@/helpers/business.helpers";

type EmploymentInfoProps = {
  businessId: businessId;
  applicationStatus: string;
};

const EmploymentInfo = ({
  businessId,
  applicationStatus,
}: EmploymentInfoProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const disableForm = ["IN_REVIEW", "APPROVED"].includes(applicationStatus);
  const [customReferenceDate, setCustomReferenceDate] =
    useState<boolean>(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>("");
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // INITIALIZE CREATE EMPLOYMENT INFO MUTATIon
  const [
    createEmploymentInfo,
    {
      isLoading: createEmploymentInfoIsLoading,
      error: createEmploymentInfoError,
      isSuccess: createEmploymentInfoIsSuccess,
      isError: createEmploymentInfoIsError,
    },
  ] = useCreateEmploymentInfoMutation();

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    createEmploymentInfo({
      businessId,
      workingStartTime:
        data?.workingStartTime && data?.workingStartTime + ":00:00",
      workingEndTime: data?.workingEndTime && data?.workingEndTime + ":00:00",
      numberOfEmployees:
        data?.numberOfEmployees && Number(data?.numberOfEmployees),
      hiringDate: data.hiringDate,
      employmentDeclarationDate: data?.employeeDeclarationDate,
      financialYearStartDate:
        data?.financialYearStartDate &&
        moment(data?.financialYearStartDate).format("0000-MM-DD"),
      financialYearEndDate:
        data?.financialYearStartDate &&
        moment(data?.financialYearStartDate).format("0000-MM-DD"),
    });
  };

  // HANDLE CREATE EMPLYOMENT INFO RESPONSE
  useEffect(() => {
    if (createEmploymentInfoIsError) {
      if ((createEmploymentInfoError as ErrorResponse)?.status === 500) {
        toast.error("An error occurred. Please try again later");
      } else {
        toast.error(
          (createEmploymentInfoError as ErrorResponse)?.data?.message
        );
      }
    } else if (createEmploymentInfoIsSuccess) {
      dispatch(
        completeNavigationFlowThunk({
          isCompleted: true,
          navigationFlowId: findNavigationFlowByStepName(
            businessNavigationFlowsList,
            "Employment Info"
          )?.id,
        })
      );
      dispatch(
        createNavigationFlowThunk({
          businessId,
          massId: findNavigationFlowMassIdByStepName(
            navigationFlowMassList,
            "Attachments"
          ),
          isActive: true,
        })
      );
    }
  }, [
    businessId,
    createEmploymentInfoError,
    createEmploymentInfoIsError,
    createEmploymentInfoIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={disableForm} className="flex flex-col w-full gap-6">
          <Controller
            name="financialYearStartDate"
            control={control}
            rules={{
              required: customReferenceDate
                ? "Account reference date is required"
                : false,
            }}
            defaultValue={moment().format("0000-MM-DD")}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  {customReferenceDate ? (
                    <menu className="flex flex-col gap-2">
                      <Input
                        type="date"
                        selectionType="recurringDate"
                        required
                        label="Account reference date"
                        {...field}
                      />
                      {errors?.financialYearStartDate && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.financialYearStartDate?.message)}
                        </p>
                      )}
                      <ul className="flex flex-col gap-1">
                        <Link
                          to={"#"}
                          className="text-primary text-[12px] hover:underline cursor-pointer w-fit"
                          onClick={(e) => {
                            e.preventDefault();
                            setCustomReferenceDate(false);
                          }}
                        >
                          Use default date
                        </Link>
                      </ul>
                    </menu>
                  ) : (
                    <menu className="flex flex-col gap-2">
                      <label className="flex flex-col gap-2">
                        <p className="flex items-center gap-1">
                          Account reference date{" "}
                          <span className="text-red-600">*</span>
                        </p>
                        <p className="text-[13px] p-1 px-2 bg-secondary text-white w-fit rounded-md">
                          December 31
                        </p>
                      </label>
                      <ul className="flex flex-col items-start gap-1">
                        <Link
                          to={"#"}
                          onClick={(e) => {
                            e.preventDefault();
                            setCustomReferenceDate(true);
                            setValue(
                              "financialYearStartDate",
                              moment().format("0000-MM-DD")
                            );
                          }}
                          className="text-primary text-[12px] hover:underline cursor-pointer"
                        >
                          Click here
                        </Link>{" "}
                      </ul>
                    </menu>
                  )}
                  {errors?.reference_date && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.reference_date?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="has_employees"
            control={control}
            rules={{ required: "Select a choice" }}
            render={({ field }) => {
              return (
                <menu className="flex flex-col w-full gap-3">
                  <h4 className="flex items-center gap-1 text-[15px]">
                    Does the company have employees?{" "}
                    <span className="text-red-600">*</span>
                  </h4>
                  <ul className="flex items-center gap-6">
                    <Input
                      type="radio"
                      label="Yes"
                      defaultChecked={watch("has_employees") === "yes"}
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
                      defaultChecked={watch("has_employees") === "no"}
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
              watch("has_employees") === "yes" ? "grid" : "hidden"
            } w-full grid-cols-2 gap-6`}
          >
            <Controller
              name="hiringDate"
              control={control}
              rules={{
                required:
                  watch("has_employees") === "yes"
                    ? "Hiring date is required"
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      type="date"
                      required
                      label="Hiring Date"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!watch("employeeDeclarationDate")) {
                          setValue("employeeDeclarationDate", e);
                        }
                      }}
                    />
                    {errors?.hiringDate && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.hiringDate?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="employeeDeclarationDate"
              control={control}
              defaultValue={watch("hiringDate")}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      type="date"
                      required
                      label="Employee Declaration Date"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="workingStartTime"
              rules={{
                validate: (value) => {
                  if (watch("has_employees") === "yes") {
                    if (
                      value &&
                      Number(value) >= Number(watch("workingEndTime"))
                    )
                      return "Working Start Time must be less than Working End Time";
                  }
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      options={dayHoursArray}
                      label="Working Start Time"
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger("workingStartTime");
                        await trigger("workingEndTime");
                      }}
                    />
                    {errors?.workingStartTime && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.workingStartTime?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="workingEndTime"
              control={control}
              rules={{
                validate: (value) => {
                  if (watch("has_employees") === "yes") {
                    if (
                      value &&
                      Number(value) <= Number(watch("workingStartTime"))
                    )
                      return "Working End Time must be greater than Working Start Time";
                  }
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      options={dayHoursArray}
                      label="Working End Time"
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger("workingEndTime");
                        await trigger("workingStartTime");
                      }}
                    />
                    {errors?.workingEndTime && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.workingEndTime?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="numberOfEmployees"
              rules={{
                required:
                  watch("has_employees") === "yes"
                    ? "Number of employees is required"
                    : false,
                validate: (value) => {
                  if (watch("has_employees") === "yes") {
                    if (!value) return "Number of employees is required";
                    if (value < 1)
                      return "Number of employees must be greater than 0";
                  }
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      required
                      label="Number of employees"
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger("numberOfEmployees");
                      }}
                    />
                    {errors?.numberOfEmployees && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.numberOfEmployees?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          {[
            "IN_PREVIEW",
            "ACTION_REQUIRED",
            "IS_AMENDING",
            "IN_PROGRESS",
          ].includes(String(applicationStatus)) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    createNavigationFlowThunk({
                      businessId,
                      massId: findNavigationFlowMassIdByStepName(
                        navigationFlowMassList,
                        "Board of Directors"
                      ),
                      isActive: true,
                    })
                  );
                }}
              />
              <Button
                value={
                  createEmploymentInfoIsLoading ? <Loader /> : "Save & Continue"
                }
                submit
                primary
                disabled={disableForm}
              />
            </menu>
          )}
          {[
            "IN_REVIEW",
            "APPROVED",
            "PENDING_APPROVAL",
            "PENDING_REJECTION",
          ].includes(String(applicationStatus)) && (
            <menu className="flex items-center justify-between gap-3">
              <Button
                value="Back"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("executive_management"));
                }}
              />
              <Button
                value="Next"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep("share_details"));
                  dispatch(setBusinessActiveTab("capital_information"));
                }}
              />
            </menu>
          )}
        </fieldset>
      </form>
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
    </section>
  );
};

export default EmploymentInfo;
