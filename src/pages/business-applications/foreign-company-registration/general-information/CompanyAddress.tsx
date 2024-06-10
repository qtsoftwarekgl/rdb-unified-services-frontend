import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../../components/inputs/Input";
import Button from "../../../../components/inputs/Button";
import Loader from "../../../../components/Loader";
import validateInputs from "../../../../helpers/validations";
import { AppDispatch, RootState } from "../../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  removeForeignBusinessCompletedStep,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
  setForeignBusinessCompletedStep,
} from "../../../../states/features/foreignCompanyRegistrationSlice";
import Select from "../../../../components/inputs/Select";
import { countriesList } from "../../../../constants/countries";
import { setUserApplications } from "../../../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../../../constants/Users";

interface CompanyAddressProps {
  entryId: string | null;
  foreign_company_address: any;
  status?: string;
}

const CompanyAddress: FC<CompanyAddressProps> = ({
  entryId,
  foreign_company_address,
  status,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm();

  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const isFormDisabled = RDBAdminEmailPattern.test(user?.email);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (foreign_company_address) {
      setValue("country", foreign_company_address?.country);
      setValue("city", foreign_company_address?.city);
      setValue("street_name", foreign_company_address?.street_name);
      setValue("zip_code", foreign_company_address?.zip_code);
      setValue("email", foreign_company_address?.email);
      setValue("phone", foreign_company_address?.phone);
    } else {
      dispatch(removeForeignBusinessCompletedStep("foreign_company_address"));
    }
  }, [foreign_company_address, dispatch, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entryId,
          foreign_company_address: {
            ...data,
            step: "foreign_company_address",
          },
        })
      );
      if ((['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status)) || isLoading?.amend)
        dispatch(setForeignBusinessActiveTab("foreign_preview_submission"));
      else {
        dispatch(setForeignBusinessActiveStep("foreign_business_activity_vat"));
      }
      // SET CURRENT STEP AS COMPLETED
      dispatch(setForeignBusinessCompletedStep("foreign_company_address"));
      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          className="flex flex-col w-full gap-6"
          disabled={isFormDisabled}
        >
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="country"
              control={control}
              defaultValue={
                watch("country") || foreign_company_address?.country
              }
              rules={{ required: "Country is required" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      placeholder="Select country of incorporation"
                      {...field}
                      required
                      defaultValue={foreign_company_address?.country}
                      label="Country of Incorporation"
                      options={countriesList
                        ?.filter((country) => country.code !== 'RW')
                        .map((country) => {
                          return {
                            ...country,
                            label: country.name,
                            value: country.code,
                          };
                        })}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.country && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.country.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="city"
              control={control}
              defaultValue={watch("city") || foreign_company_address?.city}
              rules={{ required: "city is required" }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="City"
                      defaultValue={
                        watch("city") || foreign_company_address?.city
                      }
                      placeholder="City"
                      {...field}
                    />
                    {errors?.city && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.city.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              control={control}
              name="street_name"
              defaultValue={
                watch("street_name") || foreign_company_address?.street_name
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      defaultValue={
                        watch("street_name") ||
                        foreign_company_address?.street_name
                      }
                      label="Street Name"
                      placeholder="Street name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              defaultValue={
                watch("zip_code") || foreign_company_address?.zip_code
              }
              name="zip_code"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="ZIP Code"
                      placeholder="ZIP code"
                      defaultValue={
                        watch("zip_code") || foreign_company_address?.zip_code
                      }
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="email"
              control={control}
              defaultValue={watch("email") || foreign_company_address?.email}
              rules={{
                required: watch("email") ? "Email address is required" : false,
                validate: (value) => {
                  return (
                    validateInputs(String(value), "email") ||
                    "Invalid email address"
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      label="Email"
                      defaultValue={
                        watch("email") || foreign_company_address?.email
                      }
                      placeholder="name@domain.com"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {String(errors?.email?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="phone"
              control={control}
              defaultValue={watch("phone") || foreign_company_address?.phone}
              rules={{
                required: "Phone number is required",
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <p className="flex items-center gap-1">
                      Phone number <span className="text-red-600">*</span>
                    </p>
                    <menu className="relative flex items-center gap-0">
                      <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                        <select
                          className="w-full !text-[12px]"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        >
                          {countriesList?.map((country) => {
                            return (
                              <option
                                key={country?.dial_code}
                                value={country?.dial_code}
                              >
                                {`${country?.code} ${country?.dial_code}`}
                              </option>
                            );
                          })}
                        </select>
                      </span>
                      <input
                        onChange={field.onChange}
                        defaultValue={
                          watch("phone") || foreign_company_address?.phone
                        }
                        className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                        type="text"
                      />
                    </menu>
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phone?.message)}
                      </p>
                    )}
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
                dispatch(setForeignBusinessActiveStep("company_details"));
              }}
            />
            {status === "is_amending" && (
              <Button
                submit
                value={isLoading?.amend ? <Loader /> : "Complete Amendment"}
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
            {['IN_PREVIEW', 'ACTION_REQUIRED'].includes(status) && (
              <Button
                value={
                  isLoading?.preview && !Object.keys(errors)?.length ? (
                    <Loader />
                  ) : (
                    "Save & Complete Review"
                  )
                }
                primary
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
                submit
                disabled={isFormDisabled || Object.keys(errors)?.length > 0}
              />
            )}
            <Button
              value={isLoading.submit ? <Loader /> : "Save & Continue"}
              primary
              onClick={async () => {
                await trigger();
                if (Object.keys(errors)?.length) {
                  return;
                }
                setIsLoading({
                  ...isLoading,
                  submit: true,
                  preview: false,
                  amend: false,
                });
                dispatch(
                  setUserApplications({ entryId, status: "IN_PROGRESS" })
                );
              }}
              submit
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default CompanyAddress;
