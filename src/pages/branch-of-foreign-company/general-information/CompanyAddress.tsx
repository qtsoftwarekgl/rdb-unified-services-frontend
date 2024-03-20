import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/inputs/Button";
import Loader from "../../../components/Loader";
import validateInputs from "../../../helpers/Validations";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  removeForeignBusinessCompletedStep,
  setForeignBusinessActiveStep,
  setForeignBusinessCompletedStep,
  setForeignCompanyAddress,
} from "../../../states/features/foreignBranchRegistrationSlice";
import Select from "../../../components/inputs/Select";
import { countriesList } from "../../../constants/countries";
import { setUserApplications } from "../../../states/features/userApplicationSlice";

interface CompanyAddressProps {
  isOpen: boolean;
  entry_id: string | null;
}

const CompanyAddress: FC<CompanyAddressProps> = ({ isOpen, entry_id }) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { foreign_company_address } = useSelector(
    (state: RootState) => state?.foreignBranchRegistration
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      dispatch(removeForeignBusinessCompletedStep("company_address"));
    }
  }, [foreign_company_address, dispatch, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(setForeignCompanyAddress({ data, step: "company_address" }));
      dispatch(
        setUserApplications({
          entry_id,
          foreign_company_address: {
            ...data,
            step: "company_address",
          },
        })
      );
      dispatch(setForeignBusinessActiveStep("business_activity_vat"));
      dispatch(setForeignBusinessCompletedStep("company_address"));
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4"
      >
        <menu className="flex items-start w-full gap-6">
          <Controller
            name="country"
            control={control}
            defaultValue={watch("country") || foreign_company_address?.country}
            rules={{ required: "Country is required" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Select
                    required
                    label="Country of Incorporation"
                    options={countriesList.map((country) => {
                      return {
                        ...country,
                        label: country.name,
                        value: country.code,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
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
                    label="city"
                    defaultValue={
                      watch("city") || foreign_company_address?.city
                    }
                    placeholder="city"
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
              required: "Email address is required",
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
          <Button value={isLoading ? <Loader /> : "Continue"} primary submit />
        </menu>
      </form>
    </section>
  );
};

export default CompanyAddress;
