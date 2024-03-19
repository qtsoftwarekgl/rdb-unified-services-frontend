import { FC, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Input from "../../../components/inputs/Input";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "../../../components/inputs/Select";
import {
  companyCategories,
  companyPositions,
  companyTypes,
} from "../../../constants/businessRegistration";
import Button from "../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setForeignBusinessActiveStep,
  setForeignCompanyDetails,
  setForeignBusinessCompletedStep,
} from "../../../states/features/foreignBranchRegistrationSlice";

interface CompanyDetailsProps {
  isOpen: boolean;
}

const CompanyDetails: FC<CompanyDetailsProps> = ({ isOpen }) => {
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
  const { foreign_company_details } = useSelector(
    (state: RootState) => state.foreignBranchRegistration
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchCompany, setSearchCompany] = useState({
    error: false,
    success: false,
    loading: false,
    name: "",
  });

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setForeignCompanyDetails({
          name: data?.name,
          category: data?.category,
          type: data?.type,
          position: data?.position,
          articles_of_association: data?.articles_of_association,
          step: "company_details",
        })
      );

      // SET CURRENT STEP AS COMPLETED
      dispatch(setForeignBusinessCompletedStep("company_details"));

      // SET ACTIVE STEP
      dispatch(setForeignBusinessActiveStep("company_address"));
    }, 1000);
  };

  // HANDLE DEFAULT VALUES
  useEffect(() => {
    if (foreign_company_details) {
      setValue("name", foreign_company_details?.name);
      setValue("category", foreign_company_details?.category);
      setValue("type", foreign_company_details?.type);
      setValue("position", foreign_company_details?.position);
      setValue(
        "articles_of_association",
        foreign_company_details?.articles_of_association
      );
    }
  }, [foreign_company_details, setValue]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-4"
      >
        <menu className="flex items-start w-full gap-6">
          <Controller
            name="name"
            control={control}
            defaultValue={watch("name") || foreign_company_details?.name}
            rules={{ required: "Company name is required" }}
            render={() => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    label="Search company name"
                    required
                    defaultValue={
                      watch("name") || foreign_company_details?.name
                    }
                    suffixIcon={faSearch}
                    suffixIconPrimary
                    onChange={(e) => {
                      setSearchCompany({
                        ...searchCompany,
                        name: e.target.value,
                        error: false,
                        success: false,
                        loading: false,
                      });
                    }}
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      if (!searchCompany?.name) {
                        return;
                      }
                      setSearchCompany({
                        ...searchCompany,
                        loading: true,
                        error: false,
                        success: false,
                      });
                      setTimeout(() => {
                        const randomNumber = Math.floor(Math.random() * 10);
                        if (randomNumber < 7) {
                          setValue("name", searchCompany.name);
                          setSearchCompany({
                            ...searchCompany,
                            loading: false,
                            success: true,
                            error: false,
                          });
                        } else {
                          setSearchCompany({
                            ...searchCompany,
                            loading: false,
                            success: false,
                            error: true,
                          });
                        }
                      }, 1000);
                    }}
                  />
                  <menu
                    className={`flex flex-col gap-1 w-full my-1 ${
                      !Object.values(searchCompany).includes(true) && "hidden"
                    }`}
                  >
                    <article
                      className={`${
                        searchCompany.loading ? "flex" : "hidden"
                      } text-[12px] items-center`}
                    >
                      <Loader size={4} /> Checking if "{searchCompany.name}"
                      exists
                    </article>
                    <p
                      className={`${
                        searchCompany.error && searchCompany?.name
                          ? "flex"
                          : "hidden"
                      } text-[12px] items-center text-red-500 gap-2`}
                    >
                      {searchCompany.name} is already taken. Please try another
                      name
                    </p>
                    <p
                      className={`${
                        searchCompany.success ? "flex" : "hidden"
                      } text-[12px] items-center gap-2 text-secondary`}
                    >
                      {searchCompany.name} is available{" "}
                      <span className="w-fit">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-600"
                        />
                      </span>
                    </p>
                  </menu>
                  {errors.name && !searchCompany?.name && (
                    <p className="text-xs text-red-500">
                      {String(errors.name.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="category"
            defaultValue={
              watch("category") || foreign_company_details?.category
            }
            rules={{ required: "Select company category" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Select
                    defaultValue={companyCategories?.find(
                      (category) =>
                        category?.value === foreign_company_details?.category
                    )}
                    label="Company category"
                    required
                    options={companyCategories?.map((category) => {
                      return {
                        ...category,
                        value: category?.value,
                        label: category?.label,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.category && (
                    <p className="text-xs text-red-500">
                      {String(errors?.category?.message)}
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
            name="type"
            defaultValue={watch("type") || foreign_company_details?.type}
            rules={{ required: "Select company type" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Select
                    defaultValue={companyTypes?.find(
                      (type) => type?.value === foreign_company_details?.type
                    )}
                    label="Company type"
                    required
                    options={companyTypes?.map((type) => {
                      return {
                        ...type,
                        value: type?.value,
                        label: type?.label,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.type && (
                    <p className="text-xs text-red-500">
                      {String(errors?.type?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="position"
            defaultValue={
              watch("position") || foreign_company_details?.position
            }
            rules={{ required: "Select your position" }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Select
                    defaultValue={companyPositions?.find(
                      (position) =>
                        position?.value === foreign_company_details?.position
                    )}
                    label="Your position"
                    required
                    options={companyPositions?.map((position) => {
                      return {
                        ...position,
                        value: position?.value,
                        label: position?.label,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.position && (
                    <p className="text-xs text-red-500">
                      {String(errors?.position?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex flex-col w-full gap-2 my-2">
          <h4>Does the company have Articles of Association?</h4>
          <Controller
            control={control}
            name="articles_of_association"
            rules={{ required: "Select one of the choices provided" }}
            render={({ field }) => {
              return (
                <ul className="flex items-center gap-6">
                  <Input
                    type="radio"
                    label="Yes"
                    checked={
                      watch("articles_of_association") === "yes" ||
                      foreign_company_details?.articles_of_association === "yes"
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange(e?.target?.value);
                        setValue("articles_of_association", "yes");
                      }
                    }}
                    name={field?.name}
                  />
                  <Input
                    type="radio"
                    label="No"
                    checked={
                      watch("articles_of_association") === "no" ||
                      foreign_company_details?.articles_of_association === "no"
                    }
                    name={field?.name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange(e?.target?.value);
                        setValue("articles_of_association", "no");
                      }
                    }}
                  />
                </ul>
              );
            }}
          />
        </menu>
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button value="Back" route="/business-registration/new" />
          <Button
            value={isLoading ? <Loader /> : "Continue"}
            primary={!searchCompany?.error}
            disabled={searchCompany?.error}
            submit
          />
        </menu>
      </form>
    </section>
  );
};

export default CompanyDetails;