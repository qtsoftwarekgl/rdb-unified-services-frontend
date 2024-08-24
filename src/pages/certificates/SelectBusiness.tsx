import Button from "@/components/inputs/Button";
import Select from "@/components/inputs/Select";
import UserLayout from "@/containers/UserLayout";
import { Controller } from "react-hook-form";
import useCompanyCertificate from "./hooks/useCompanyCertificate";

interface Props {
    handleBack: () => void;
    handleContinue: () => void;
}
const SelectBusiness = ({handleContinue, handleBack}: Props) => {
   const {control, businessesList, businessesIsFetching, errors} = useCompanyCertificate();
      
  return (
    <UserLayout>
    <main className="flex flex-col gap-6 p-6 bg-white rounded-md">
      <>
      <h1 className="text-lg font-semibold text-center uppercase text-primary">
        COMPANY CERTIFICATE
      </h1>
      <form
        // onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-[90%] mx-auto"
      >
        <Controller
          control={control}
          name="businessId"
          rules={{ required: "Select business to open new branch" }}
          render={({ field }) => {
            return (
              <label className="w-[49%] flex flex-col gap-1">
                <Select
                  label="Select business"
                  required
                  options={businessesList?.map((business) => {
                    return {
                      label: businessesIsFetching
                        ? "...."
                        : (
                            business?.companyName ||
                            business?.enterpriseName ||
                            business?.enterpriseBusinessName ||
                            business?.branchName
                          )?.toUpperCase(),
                      value: business.id,
                    };
                  })}
                  {...field}
                  placeholder="Select business"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                />
                {errors?.businessId && (
                  <p className="text-red-500 text-[13px]">
                    {String(errors?.businessId?.message)}
                  </p>
                )}
              </label>
            );
          }}
        />
        </form>
        </>

        <menu className={`flex items-center gap-3 w-full px-16 mx-auto justify-between max-sm:flex-col-reverse`}>
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                handleBack();
              }}
            />
            <Button
             value="Continue"
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    handleContinue();
                }}
              primary
              submit
            />
          </menu>
    </main>
  </UserLayout>
  );
}

export default SelectBusiness;