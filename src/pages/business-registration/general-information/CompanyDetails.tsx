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
  privateCompanyTypes,
} from "../../../constants/businessRegistration";
import Button from "../../../components/inputs/Button";
import { AppDispatch, RootState } from "../../../states/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from "../../../states/features/businessRegistrationSlice";
import { setUserApplications } from "../../../states/features/userApplicationSlice";
import { RDBAdminEmailPattern } from "../../../constants/Users";

export interface business_company_details {
  name: string;
  category: string;
  type: string;
  position: string;
  articles_of_association: string;
  step: string;
  name_reserved?: boolean;
}

interface CompanyDetailsProps {
  isOpen: boolean;
  entry_id: string | null;
  company_details: business_company_details | null;
  status: string;
}

const CompanyDetails: FC<CompanyDetailsProps> = ({
  isOpen,
  entry_id,
  company_details,
  status
}) => {

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
    trigger
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false
  });
  const [searchCompany, setSearchCompany] = useState({
    error: false,
    success: false,
    loading: false,
    name: '',
  });
  const [companyTypesOptions, setCompanyTypesOptions] = useState(companyTypes);
  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  useEffect(() => {
    if (watch('category') === 'public') {
      setCompanyTypesOptions(companyTypes);
    } else if (watch('category') === 'private') {
      setCompanyTypesOptions(privateCompanyTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('category')]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setTimeout(() => {

      // SET ACTIVE TAB AND STEP
      let active_tab = 'general_information';
      let active_step = 'company_address';

      if (status === 'in_preview') {
        active_tab = 'preview_submission';
        active_step = 'preview_submission';
      }

      dispatch(
        setUserApplications({
          entry_id,
          active_tab: 'general_information',
          active_step: 'company_address',
          status: 'in_progress',
          company_details: {
            ...company_details,
            name: data?.name,
            category: data?.category,
            type: data?.type,
            position: data?.position,
            articles_of_association: data?.articles_of_association,
            step: 'company_details',
          },
        })
      );

      // SET CURRENT STEP AS COMPLETED
      dispatch(setBusinessCompletedStep('company_details'));

      // SET ACTIVE TAB
      dispatch(setBusinessActiveTab(active_tab));

      // SET ACTIVE STEP
      dispatch(setBusinessActiveStep(active_step));

      // RESET LOADING STATE
      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
      });
    }, 1000);
  };

  // HANDLE DEFAULT VALUES
  useEffect(() => {
    if (company_details) {
      setValue("name", company_details?.name);
      setValue("category", company_details?.category);
      setValue("type", company_details?.type);
      setValue("position", company_details?.position);
      setValue(
        "articles_of_association",
        company_details?.articles_of_association
      );
    }
  }, [company_details, setValue]);


  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="name"
              control={control}
              defaultValue={company_details?.name || watch('name')}
              rules={{ required: 'Company name is required' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      label="Search company name"
                      required
                      defaultValue={company_details?.name}
                      suffixIcon={
                        company_details?.name_reserved ? undefined : faSearch
                      }
                      readOnly={company_details?.name_reserved ? true : false}
                      suffixIconPrimary
                      onChange={(e) => {
                        field.onChange(e);
                        setSearchCompany({
                          ...searchCompany,
                          name: e.target.value,
                          error: false,
                          success: false,
                          loading: false,
                        });
                        setError('name', {
                          type: 'manual',
                          message:
                            'Check if company name is available before proceeding',
                        });
                      }}
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        if (!field?.value) {
                          return;
                        }
                        clearErrors('name');
                        setSearchCompany({
                          ...searchCompany,
                          loading: true,
                          error: false,
                          success: false,
                        });
                        setTimeout(() => {
                          if (field?.value?.toLowerCase() === 'xyz') {
                            setValue('name', searchCompany.name);
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
                        !Object.values(searchCompany).includes(true) && 'hidden'
                      }`}
                    >
                      <article
                        className={`${
                          searchCompany.loading ? 'flex' : 'hidden'
                        } text-[12px] items-center`}
                      >
                        <Loader size={4} /> Checking if "{searchCompany.name}"
                        exists
                      </article>
                      <p
                        className={`${
                          searchCompany.error && searchCompany?.name
                            ? 'flex'
                            : 'hidden'
                        } text-[12px] items-center text-red-500 gap-2`}
                      >
                        {searchCompany.name} is already taken. Please try
                        another name
                      </p>
                      <p
                        className={`${
                          searchCompany.success ? 'flex' : 'hidden'
                        } text-[12px] items-center gap-2 text-green-600`}
                      >
                        {searchCompany.name} is available{' '}
                        <span className="w-fit">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-green-600"
                          />
                        </span>
                      </p>
                    </menu>
                    {errors.name && (
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
              defaultValue={company_details?.category}
              rules={{ required: 'Select company category' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      label="Company category"
                      required
                      options={companyCategories?.map((category) => {
                        return {
                          ...category,
                          value: category?.value,
                          label: category?.label,
                        };
                      })}
                      defaultValue={company_details?.category}
                      onChange={(e) => {
                        field.onChange(e);
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
              defaultValue={company_details?.type}
              rules={{ required: 'Select company type' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={company_details?.type}
                      label="Company type"
                      required
                      options={companyTypesOptions?.map((type) => {
                        return {
                          ...type,
                          value: type?.value,
                          label: type?.label,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
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
              defaultValue={company_details?.position}
              rules={{ required: 'Select your position' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      defaultValue={company_details?.position}
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
                        field.onChange(e);
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
              rules={{ required: 'Select one of the choices provided' }}
              render={({ field }) => {
                return (
                  <ul className="flex items-center gap-6">
                    <Input
                      type="radio"
                      label="Yes"
                      checked={watch('articles_of_association') === 'yes'}
                      {...field}
                      value={'yes'}
                    />
                    <Input
                      type="radio"
                      label="No"
                      checked={watch('articles_of_association') === 'no'}
                      {...field}
                      value={'no'}
                    />
                    {errors?.articles_of_association && (
                      <p className="text-xs text-red-500">
                        {String(errors?.articles_of_association?.message)}
                      </p>
                    )}
                  </ul>
                );
              }}
            />
          </menu>
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              disabled={disableForm}
              value="Back"
              route="/business-registration/new"
            />
            {isAmending && (
              <Button
                value={'Complete Amendment'}
                submit
                onClick={() => {
                  setIsLoading({
                    ...isLoading,
                    preview: true,
                    submit: false,
                    amend: false,
                  });
                }}
              />
            )}
            {status === 'in_preview' && (
              <Button
                value={
                  isLoading?.preview ? <Loader /> : 'Save & Complete Preview'
                }
                submit
                primary={!searchCompany?.error}
                disabled={
                  searchCompany?.error ||
                  disableForm ||
                  Object.keys(errors).length > 0
                }
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
              />
            )}
            <Button
              value={isLoading?.submit ? <Loader /> : 'Save & Continue'}
              primary={!searchCompany?.error}
              disabled={
                searchCompany?.error ||
                disableForm ||
                Object.keys(errors).length > 0
              }
              onClick={() => {
                setIsLoading({
                  ...isLoading,
                  submit: true,
                  preview: false,
                });
                dispatch(
                  setUserApplications({ entry_id, status: 'in_progress' })
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

export default CompanyDetails;
