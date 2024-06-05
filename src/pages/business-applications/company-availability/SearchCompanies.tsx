import { Controller, FieldValues, useForm } from 'react-hook-form';
import UserLayout from '../../../containers/UserLayout';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Loader from '../../../components/Loader';
import moment from 'moment';
import Button from '../../../components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from '@/components/inputs/Select';
import { capitalizeString } from '@/helpers/strings';
import Table from '@/components/table/Table';
import { useLazySearchCompaniesQuery } from '@/states/api/businessRegistrationApiSlice';
import queryString, { ParsedQuery } from 'query-string';

const SearchCompanies = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm();

  // NAVIGATE
  const navigate = useNavigate();

  // STATE VARIABLES
  const [searchQueries, setSearchQueries] = useState<ParsedQuery<string>>({});
  const [searchType, setSearchType] = useState<string>('companyName');

  // CATCH SEARCH QUERIES
  const { search } = useLocation();

  useEffect(() => {
    if (search) {
      setSearchQueries(queryString.parse(search));
    }
  }, [search]);

  useEffect(() => {
    navigate(`?${queryString.stringify({
      ...searchQueries,
      type: searchType,
    })}`);
  }, [navigate, searchQueries, searchType]);

  // INITIALIZE SEARCH COMPANIES QUERY
  const [
    searchCompanies,
    {
      data: searchCommpaniesData,
      error: searchCompaniesError,
      isLoading: searchCompaniesIsLoading,
      isSuccess: searchCompaniesIsSuccess,
      isError: searchCompaniesIsError,
    },
  ] = useLazySearchCompaniesQuery();

  // HANDLE SEARCH COMPANIES RESPONSE
  useEffect(() => {
    if (searchCompaniesIsError) {
      if ((searchCompaniesError as ErrorResponse).status === 500) {
        toast.error('Search failed, please try again later');
      } else {
        toast.error(
          (searchCompaniesError as ErrorResponse).data?.message ||
            'An error occurred, please try again later'
        );
      }
    } else if (searchCompaniesIsSuccess) {
      toast.success('Company details requested successfully');
      console.log(searchCommpaniesData.data);
    }
  }, [
    searchCommpaniesData,
    searchCompaniesError,
    searchCompaniesIsError,
    searchCompaniesIsSuccess,
  ]);

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState<{
    search: boolean;
    submit: boolean;
    data:
      | {
          tin?: string | number;
          companyName: string;
          company_type: string;
        }
      | null
      | Array<{
          tin?: string | number;
          companyName: string;
          company_type: string;
        } | null>;
  }>({
    search: false,
    submit: false,
    data: null,
  });

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
      value: 'companyName',
    },
    {
      label: 'Company TIN',
      value: 'tin',
    },
  ];

  // TABLE COLUMNS
  const columns = [
    {
      id: 'no',
      header: 'No',
      accessorKey: 'no',
    },
    {
      id: 'companyName',
      header: 'Company Name',
      accessorKey: 'companyName',
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
                  if (searchType === 'tin') {
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
                          setSearchType(value);
                          setSearchQueries({
                            ...searchQueries,
                            type: value,
                          });
                          navigate(`?${queryString.stringify(searchQueries)}`);
                        }}
                        options={searchOptions}
                        labelClassName="!max-w-[35%]"
                        className="w-full border border-r-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-l-md rounded-r-none"
                      />
                      <input
                        required
                        type="text"
                        className="placeholder:text-[13px] text-[14px] h-10 w-full border border-l-[0px] border-[#E5E5E5] outline-none focus:outline-none rounded-r-md"
                        placeholder={`Enter ${
                          searchOptions?.find(
                            (option) => option.value === searchType
                          )?.label
                        }`}
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          await trigger('searchValue');
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="text-white bg-primary mx-2 p-3 rounded-md cursor-pointer"
                        onClick={async (e) => {
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

                          setSearchQueries({
                            ...searchQueries,
                            type: searchType,
                            companyName: searchType === 'companyName' ? field.value : '',
                            tin: searchType === 'tin' ? field.value : '',
                          });
                          await searchCompanies({
                            ...searchQueries,
                          });
                        }}
                      />
                    </menu>
                    <section className="flex flex-col gap-1 pl-[35%]">
                      {searchCompaniesIsLoading && (
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
              searchType === 'tin'
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
                  {isLoading?.data?.companyName}
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
              searchType === 'companyName'
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
                route="/services"
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
              isLoading?.data && searchType === 'tin'
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

export default SearchCompanies;
