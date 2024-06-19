import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/Input';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../../../components/Loader';
import Select from '../../../../components/inputs/Select';
import {
  companyCategories,
  companyPositions,
  companyTypes,
  privateCompanyTypes,
} from '../../../../constants/businessRegistration';
import Button from '../../../../components/inputs/Button';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setBusinessActiveStep, setBusinessCompletedStep } from '../../../../states/features/businessRegistrationSlice';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import { businessId } from '@/types/models/business';
import { toast } from 'react-toastify';
import { ErrorResponse, Link } from 'react-router-dom';
import {
  setBusiness,
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
} from '@/states/features/businessSlice';
import {
  useCreateCompanyDetailsMutation,
  useLazyGetBusinessQuery,
  useLazySearchBusinessNameAvailabilityQuery,
} from '@/states/api/businessRegistrationApiSlice';
import { convertDecimalToPercentage } from '@/helpers/strings';
import SimilarBusinessNames from './SimilarBusinessNames';

type CompanyDetailsProps = {
  businessId: businessId;
}

const CompanyDetails = ({ businessId }: CompanyDetailsProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm();
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { business, nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );
  const [companyTypesOptions, setBusinessTypesOptions] = useState(companyTypes);
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusiness,
    {
      data: businessData,
      error: businessError,
      isLoading: businessIsLoading,
      isError: businessIsError,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessQuery();

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusiness({ id: businessId });
    }
  }, [getBusiness, businessId]);

  // HANDLE GET BUSINESS RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while fetching business data');
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess) {
      dispatch(setBusiness(businessData?.data));
    }
  }, [
    businessData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
  ]);

  // INITIALIZE SEARCH BUSINESS NAME AVAILABILITY QUERY
  const [
    searchBusinessNameAvailability,
    {
      data: searchBusinessNameData,
      isLoading: searchBusinessNameIsLoading,
      error: searchBusinessNameError,
      isError: searchBusinessNameIsError,
      isSuccess: searchBusinessNameIsSuccess,
      isFetching: searchBusinessNameIsFetching,
    },
  ] = useLazySearchBusinessNameAvailabilityQuery();

  // HANDLE SEARCH BUSINESS NAME AVAILABILITY RESPONSE
  useEffect(() => {
    if (searchBusinessNameIsError) {
      if ((searchBusinessNameError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while searching for business name availability'
        );
      } else {
        toast.error((searchBusinessNameError as ErrorResponse)?.data?.message);
      }
    } else if (searchBusinessNameIsSuccess) {
      if (searchBusinessNameIsSuccess) {
        dispatch(setNameAvailabilitiesList(searchBusinessNameData?.data));
      }
    }
  }, [
    dispatch,
    searchBusinessNameData?.data,
    searchBusinessNameError,
    searchBusinessNameIsError,
    searchBusinessNameIsSuccess,
  ]);

  // INITIALIZE CREATE COMPANY DETAILS MUTATION
  const [
    createCompanyDetails,
    {
      error: createCompanyDetailsError,
      isLoading: createCompanyDetailsIsLoading,
      isError: createCompanyDetailsIsError,
      isSuccess: createCompanyDetailsIsSuccess,
    },
  ] = useCreateCompanyDetailsMutation();

  // SET BUSINESS CATEGORY OPTIONS
  useEffect(() => {
    if (watch('companyCategory') === 'PUBLIC') {
      setBusinessTypesOptions(companyTypes);
    } else if (watch('companyCategory') === 'PRIVATE') {
      setBusinessTypesOptions(privateCompanyTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('companyCategory'), business?.companyCategory]);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    createCompanyDetails({
      businessId,
      companyName: data.companyName,
      position: data.position,
      hasArticlesOfAssociation: data.hasArticlesOfAssociation === 'yes',
      companyType: data.companyType,
      companyCategory: data.companyCategory,
    });
  };

  // HANDLE CREATE COMPANY DETAILS RESPONSE
  useEffect(() => {
    if (createCompanyDetailsIsError) {
      if ((createCompanyDetailsError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while creating company details');
      } else {
        toast.error((createCompanyDetailsError as ErrorResponse)?.data?.message);
      }
    } else if (createCompanyDetailsIsSuccess) {
      dispatch(setBusinessCompletedStep('company_details'));
      dispatch(setBusinessActiveStep('company_address'));
    }
  }, [
    createCompanyDetailsError,
    createCompanyDetailsIsError,
    createCompanyDetailsIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex flex-col w-full gap-4">
      {businessIsLoading && (
        <figure className="h-[40vh] flex items-center justify-center">
          <Loader />
        </figure>
      )}
      {businessIsSuccess && business && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset
            className="flex flex-col w-full gap-6"
            disabled={disableForm}
          >
            <menu className="flex items-start w-full gap-6">
              <Controller
                name="companyName"
                control={control}
                rules={{ required: 'Company name is required' }}
                defaultValue={business?.companyName}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-full gap-1">
                      <Input
                        label="Search company name"
                        required
                        suffixIconPrimary
                        suffixIcon={faSearch}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setError('companyName', {
                            type: 'manual',
                            message:
                              'Check if company name is available before proceeding',
                          });
                        }}
                        suffixIconHandler={(e) => {
                          e.preventDefault();
                          if (!field?.value || field?.value?.length < 3) {
                            return;
                          }
                          clearErrors('companyName');
                          searchBusinessNameAvailability({
                            companyName: field?.value,
                          });
                        }}
                      />
                      <menu className="flex w-full flex-col gap-2">
                        {searchBusinessNameIsLoading || searchBusinessNameIsFetching && (
                          <figure className="flex items-center gap-2">
                            <Loader />
                            <p className="text-[13px]">Searching...</p>
                          </figure>
                        )}
                        {searchBusinessNameIsSuccess &&
                          nameAvailabilitiesList?.length > 0 && !errors?.companyName && (
                            <section className="flex flex-col gap-1">
                              <p className="text-[11px] text-red-600">
                                The given name has a similarity of up to{' '}
                                {convertDecimalToPercentage(
                                  nameAvailabilitiesList[0]?.similarity
                                )}
                                % with other business names. Consider changing
                                it to avoid conflicts.
                              </p>
                              <Link
                                to={'#'}
                                className="text-[11px] underline text-primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setSimilarBusinessNamesModal(true));
                                }}
                              >
                                Click to find conflicting business names
                              </Link>
                            </section>
                          )}
                        {searchBusinessNameIsSuccess &&
                          nameAvailabilitiesList?.length === 0 && !errors?.companyName && (
                            <p className="text-[11px] text-green-600 px-2">
                              {field.value} is available for use
                            </p>
                          )}
                      </menu>
                      {errors.companyName && (
                        <p className="text-xs text-red-500">
                          {String(errors.companyName.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                name="companyCategory"
                rules={{ required: 'Select company category' }}
                defaultValue={business?.companyCategory}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        label="Company category"
                        required
                        placeholder="Select company category"
                        options={companyCategories?.map((category) => {
                          return {
                            ...category,
                            value: category?.value,
                            label: category?.label,
                          };
                        })}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger(field?.name);
                        }}
                      />
                      {errors?.companyCategory && (
                        <p className="text-xs text-red-500">
                          {String(errors?.companyCategory?.message)}
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
                name="companyType"
                rules={{ required: 'Select company type' }}
                defaultValue={watch('companyType') || business?.companyType}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        label="Company type"
                        required
                        placeholder="Select company type"
                        options={companyTypesOptions?.map((type) => {
                          return {
                            ...type,
                            value: type?.value,
                            label: type?.label,
                          };
                        })}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger(field?.name);
                        }}
                      />
                      {errors?.companyType && (
                        <p className="text-xs text-red-500">
                          {String(errors?.companyType?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                control={control}
                name="position"
                rules={{ required: 'Select your position' }}
                defaultValue={business?.position}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col w-full gap-1">
                      <Select
                        label="Your position"
                        required
                        placeholder="Select your position"
                        options={companyPositions?.map((position) => {
                          return {
                            ...position,
                            value: position?.value,
                            label: position?.label,
                          };
                        })}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger(field?.name);
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
                name="hasArticlesOfAssociation"
                rules={{ required: 'Select one of the choices provided' }}
                render={({ field }) => {
                  return (
                    <ul className="flex items-center gap-6">
                      <Input
                        type="radio"
                        label="Yes"
                        defaultChecked={business?.hasArticlesOfAssociation}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e.target.value);
                          await trigger(field?.name);
                        }}
                        value={'yes'}
                      />
                      <Input
                        type="radio"
                        label="No"
                        defaultChecked={!business?.hasArticlesOfAssociation}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e.target.value);
                          await trigger(field?.name);
                        }}
                        value={'no'}
                      />
                      {errors?.hasArticlesOfAssociation && (
                        <p className="text-xs text-red-500">
                          {String(errors?.hasArticlesOfAssociation?.message)}
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
              <Button
                primary
                value={
                  createCompanyDetailsIsLoading ? <Loader /> : 'Save & Continue'
                }
                submit
              />
            </menu>
            {['IN_REVIEW'].includes(business.applicationStatus) && (
              <menu className="flex items-center w-full gap-3 justify-between">
                <Button
                  value="Back"
                  route="/business-registration/new"
                  disabled
                />
                <Button
                  value={'Next'}
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setBusinessActiveStep('company_address'));
                  }}
                />
              </menu>
            )}
          </fieldset>
        </form>
      )}
      <SimilarBusinessNames companyName={watch('companyName')} />
    </section>
  );
};

export default CompanyDetails;
