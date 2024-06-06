import { Controller, useForm } from 'react-hook-form';
import UserLayout from '../../../containers/UserLayout';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Loader from '../../../components/Loader';
import Button from '../../../components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from '@/components/inputs/Select';
import { capitalizeString, formatDate } from '@/helpers/strings';
import Table from '@/components/table/Table';
import { useLazySearchCompaniesQuery } from '@/states/api/businessRegistrationApiSlice';
import queryString, { ParsedQuery } from 'query-string';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setCompaniesList } from '@/states/features/companySlice';
import { AccessorKeyColumnDefBase, Row } from '@tanstack/react-table';
import { Business } from '@/types/models/business';

const SearchCompanies = () => {
  // REACT HOOK FORM
  const {
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
  const dispatch: AppDispatch = useDispatch();
  const { pagination, companiesList } = useSelector(
    (state: RootState) => state.companies
  );
  const [searchQueries, setSearchQueries] = useState<
    ParsedQuery<string | number>
  >({});
  const [searchType, setSearchType] = useState<string>('companyName');

  // CATCH SEARCH QUERIES
  const { search } = useLocation();

  useEffect(() => {
    if (search) {
      setSearchQueries(queryString.parse(search));
    }
  }, [search]);

  useEffect(() => {
    navigate(
      `?${queryString.stringify({
        ...searchQueries,
        type: searchType,
        page: pagination.page,
        size: pagination.size,
      })}`
    );
  }, [navigate, searchQueries, searchType, pagination]);

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
      dispatch(setCompaniesList(searchCommpaniesData.data.data || []));
    }
  }, [
    dispatch,
    searchCommpaniesData,
    searchCompaniesError,
    searchCompaniesIsError,
    searchCompaniesIsSuccess,
  ]);

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
      id: 'companyType',
      header: 'Company Type',
      accessorKey: 'companyType',
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: 'date_of_incorporation',
      header: 'Date of Incorporation',
      accessorKey: 'createdAt',
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col gap-5 p-6 rounded-md bg-white w-full">
        <h1 className="uppercase font-semibold text-lg text-center">
          Request company details
        </h1>
        <form className="flex flex-col gap-4 w-[95%] mx-auto">
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
                            companyName:
                              searchType === 'companyName' ? field.value : '',
                            tin: searchType === 'tin' ? field.value : '',
                            page: pagination.page,
                            size: pagination.size,
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
              searchCompaniesIsSuccess || companiesList?.length
                ? 'flex'
                : 'hidden'
            } flex-col gap-3`}
          >
            <h1 className="text-primary uppercase font-medium text-center">
              List of companies that match your query {watch('searchValue')}
            </h1>
            <Table
              data={companiesList?.map((company: Business, index) => {
                return {
                  ...company,
                  companyName: company?.companyName?.toUpperCase(),
                  no: index + pagination.page,
                  createdAt: formatDate(company.createdAt),
                };
              })}
              columns={columns as unknown as AccessorKeyColumnDefBase<Business>}
            />
            <menu className="w-full flex items-center justify-center mt-6">
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
        </form>
      </main>
    </UserLayout>
  );
};

export default SearchCompanies;
