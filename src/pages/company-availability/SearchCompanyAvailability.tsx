import { Controller, FieldValues, useForm } from "react-hook-form";
import UserLayout from "../../containers/UserLayout";
import { searchedCompanies } from "../../constants/businessRegistration";
import DebouncedInput from "../../components/table/DebouncedInput";
import Button from "../../components/inputs/Button";

const SearchCompanyAvailability = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  const filteredCompanies =
    watch("company_name") &&
    searchedCompanies.filter((company) =>
      company.company_name
        .toLocaleLowerCase()
        .includes(watch("company_name").toLocaleLowerCase())
    );

  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
          Search Company
        </menu>
        <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-sm:w-full w-[80%] mx-auto max-sm:p-4 py-4 flex flex-col gap-12 rounded-md border-[#e1e1e6]"
          >
            <Controller
              name="company_name"
              control={control}
              rules={{ required: "Type a Company Name" }}
              defaultValue={""}
              render={({ field }) => (
                <label className="flex flex-col gap-1">
                  <DebouncedInput
                    type="text"
                    placeholder="Enter Company Name..."
                    className="!w-[70%] self-center !rounded-full !py-4 !px-8"
                    {...field}
                  />
                  {errors.company && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.company.message)}
                    </p>
                  )}
                </label>
              )}
            />
          </form>
          {watch("company_name") && (
            <menu className="px-12 mx-auto w-[50%] border h-[400px] overflow-auto  ">
              <ul className="w-[70%] list-disc">
                {filteredCompanies.map((company, index) => (
                  <li key={index} className="p-4">
                    <p className="text-xl font-semibold">
                      {company.company_name}
                    </p>
                    <label>
                      <span className="mr-4 text-lg font-semibold">
                        {company.company_type}
                      </span>
                      <span className=" font-light text-lg text-[#808080]">
                        {company.location}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {filteredCompanies.length === 0 && watch("company_name") && (
                <menu className="flex flex-col justify-center h-full">
                  <p className="my-auto text-xl text-center text-red-400">
                    Company is not available, double check the name of the
                    company and try again later!
                  </p>
                </menu>
              )}
            </menu>
          )}
          <Button
            value={"Back"}
            route="/services"
            className="w-20 border border-primary"
          />
        </section>
      </section>
    </UserLayout>
  );
};

export default SearchCompanyAvailability;
