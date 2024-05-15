import { Controller, FieldValues, useForm } from 'react-hook-form';
import { searchedCompanies } from '../../../constants/businessRegistration';
import UserLayout from '../../../containers/UserLayout';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Loader from '../../../components/Loader';
import moment from 'moment';
import Button from '../../../components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validTinNumber } from '@/constants/authentication';
import Select from '@/components/inputs/Select';
import { capitalizeString } from '@/helpers/strings';
import Table from '@/components/table/Table';

const SearchCompanyDetails = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    trigger,
    reset,
  } = useForm();

  // NAVIGATE
  const navigate = useNavigate();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState<{
    search: boolean;
    submit: boolean;
    data:
      | {
          tin?: string | number;
          company_name: string;
          company_type: string;
        }
      | null
      | Array<{
          tin?: string | number;
          company_name: string;
          company_type: string;
        } | null>;
  }>({
    search: false,
    submit: false,
    data: null,
  });
  const [searchType, setSearchType] = useState<string>('company_name');

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading({ ...isLoading, submit: true });
    setTimeout(() => {
      setIsLoading({ ...isLoading, submit: false });
      toast.success('Company details requested successfully');
      setTimeout(() => {
        navigate('/services');
      }, 1000);
    }, 1000);
    return data;
  };

  // SEARCH OPTIONS
  const searchOptions = [
    {
      label: 'Company Name',
      value: 'company_name',
    },
    {
      label: 'Company TIN',
      value: 'company_tin',
    },
  ];

  // HANDLE SEARCH OPTIONS CHANGE
  const handleSearchOptionsChange = (value: string) => {
    setSearchType(value);
  };

  // TABLE COLUMNS
  const columns = [
    {
      id: 'no',
      header: 'No',
      accessorKey: 'no',
    },
    {
      id: 'company_name',
      header: 'Company Name',
      accessorKey: 'company_name',
    },
    {
      id: 'company_type',
      header: 'Company Type',
      accessorKey: 'company_type',
    },
    {
      id: 'date_of_incorporation',
      header: 'Date of Incorporation',
      accessorKey: 'date_of_incorporation',
    },
  ];

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-5 p-6 rounded-md bg-white">
        <h1 className="uppercase font-semibold text-lg text-center">
          Request company details
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <section className="w-[45%] mx-auto">
            <Controller
              name="searchValue"
              control={control}
              rules={{
                required: 'Company name is required',
                validate: (value) => {
                  if (searchType === 'company_tin') {
                    return (
                      (value.length < 9 && 'TIN number must be 9 digits') ||
                      (value.length > 9 && 'TIN number cannot exceed 9 digits')
                    );
                  } else {
                    return value.length < 3 && 'Company name is too short';
                  }
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <menu className="flex items-center w-full gap-0">
                      <Select
                        value={searchType}
                        onChange={async (value) => {
                          handleSearchOptionsChange(value);
                          reset({
                            searchValue: '',
                          });
                          await trigger('searchValue');
                          setIsLoading({ ...isLoading, data: null });
                        }}
                        options={searchOptions}
                        labelClassName="!max-w-[35%]"
                        className="w-full border border-r-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-l-md rounded-r-none"
                      />
                      <input
                        required
                        type="text"
                        className="placeholder:text-[13px] text-[14px] h-10 w-full border border-l-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-r-md"
                        placeholder={`Enter ${capitalizeString(searchType)}`}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger('searchValue');
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-white bg-primary mx-2 p-3 rounded-md cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!field.value) {
                            setError('searchValue', {
                              type: 'manual',
                              message: `${capitalizeString(
                                searchType
                              )} is required`,
                            });
                            return;
                          }
                          clearErrors('searchValue');
                          setIsLoading({ ...isLoading, search: true });
                          setTimeout(() => {
                            setIsLoading({ ...isLoading, search: false });
                            const randomNumber = Math.floor(Math.random() * 10);
                            const companyDetails =
                              searchedCompanies[randomNumber];

                            if (
                              field.value !== String(validTinNumber) &&
                              searchType === 'company_tin'
                            ) {
                              setError('searchValue', {
                                type: 'manual',
                                message: `Company not found`,
                              });
                              setIsLoading({ ...isLoading, data: null });
                            } else if (searchType === 'company_tin') {
                              clearErrors('searchValue');
                              setIsLoading({
                                ...isLoading,
                                data: companyDetails,
                              });
                            } else if (searchType === 'company_name') {
                              setIsLoading({
                                ...isLoading,
                                data: searchedCompanies,
                              });
                            }
                          }, 1000);
                        }}
                      />
                    </menu>
                    <section className="flex flex-col gap-1 pl-[35%]">
                      {isLoading.search && (
                        <p className="text-primary text-[13px] flex items-center gap-1">
                          <Loader size={4} /> Searching...
                        </p>
                      )}
                      {errors?.searchValue && (
                        <p className="text-red-600 text-[13px]">
                          {String(errors?.searchValue.message)}
                        </p>
                      )}
                    </section>
                  </label>
                );
              }}
            />
          </section>

          <section
            className={`${
              isLoading?.data &&
              !Object.keys(errors).length &&
              !isLoading?.search &&
              searchType === 'company_tin'
                ? 'flex'
                : 'hidden'
            } flex-col gap-5`}
          >
            <section className="flex flex-col gap-4 w-[40%] mx-auto mt-5">
              <h1 className="uppercase font-semibold text-lg text-primary">
                Company Details
              </h1>
              <section className="flex flex-col gap-4">
                <p>
                  <span className="font-semibold">Company Name:</span>{' '}
                  {isLoading?.data?.company_name}
                </p>
                <p>
                  <span className="font-semibold">Company TIN:</span>{' '}
                  {isLoading?.data?.tin || watch('searchValue')}
                </p>
                <p>
                  <span className="font-semibold">Company Type:</span>{' '}
                  {isLoading?.data?.company_type}
                </p>
                <p>
                  <span className="font-semibold">Incorporation date:</span>{' '}
                  {moment().subtract(1, 'years').format('MMMM Do YYYY')}
                </p>
              </section>
            </section>
          </section>
          <section
            className={`${
              isLoading?.data &&
              !Object.keys(errors).length &&
              !isLoading?.search &&
              searchType === 'company_name'
                ? 'flex'
                : 'hidden'
            } flex-col gap-3`}
          >
            <h1 className="text-primary uppercase font-medium text-center">
              List of companies that match your query {watch('searchValue')}
            </h1>
            <Table
              data={
                (isLoading?.data as Array<unknown>)?.map(
                  (company, index: number) => {
                    return {
                      ...company,
                      no: index + 1,
                    };
                  }
                ) || []
              }
              columns={columns}
              showFilter={false}
            />
            <menu className="w-full flex items-center justify-center">
              <Button
                styled={false}
                route='/services'
                value={
                  <menu className="flex items-center gap-2 hover:gap-3 transition-all duration-200">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </menu>
                }
              />
            </menu>
          </section>
          <menu
            className={
              isLoading?.data && searchType === 'company_tin'
                ? 'w-[40%] mx-auto flex flex-col items-center gap-3 justify-between mt-6'
                : 'hidden'
            }
          >
            <Button
              value={isLoading?.submit ? <Loader /> : 'Request full info'}
              primary
              submit
              className="!w-full"
            />
            <Button
              styled={false}
              route="/services"
              value={
                <menu className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back
                </menu>
              }
            />
          </menu>
        </form>
      </main>
    </UserLayout>
  );
};

export default SearchCompanyDetails;
