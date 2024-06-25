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
import { useLazySearchBusinessesQuery } from '@/states/api/businessRegApiSlice';
import queryString, { ParsedQuery } from 'query-string';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  setBusinessesList,
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
} from '@/states/features/businessSlice';
import { ColumnDef, Row } from '@tanstack/react-table';
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
  const { page, size, totalElements, totalPages, businessesList } = useSelector(
    (state: RootState) => state.business
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

  // SET DEFAULT SEARCH TYPE
  useEffect(() => {
    navigate(
      `?${queryString.stringify({
        ...searchQueries,
        type: searchType,
      })}`
    );
  }, [navigate, searchQueries, searchType]);

  // INITIALIZE SEARCH COMPANIES QUERY
  const [
    searchBusinesses,
    {
      data: searchBusinessesData,
      error: searchBusinessesError,
      isLoading: searchBusinessesIsLoading,
      isSuccess: searchBusinessesIsSuccess,
      isError: searchBusinessesIsError,
    },
  ] = useLazySearchBusinessesQuery();

  // RELOAD COMPANIES LIST ON PAGINATION CHANGE
  useEffect(() => {
    if (watch('searchValue')) {
      searchBusinesses({
        ...searchQueries,
        companyName: searchType === 'companyName' ? watch('searchValue') : '',
        tin: searchType === 'tin' ? watch('searchValue') : '',
        page,
        size,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchBusinesses, size]);

  // HANDLE SEARCH COMPANIES RESPONSE
  useEffect(() => {
    if (searchBusinessesIsError) {
      if ((searchBusinessesError as ErrorResponse).status === 500) {
        toast.error('Search failed, please try again later');
      } else {
        toast.error(
          (searchBusinessesError as ErrorResponse).data?.message ||
            'An error occurred, please try again later'
        );
      }
    } else if (searchBusinessesIsSuccess) {
      dispatch(setBusinessesList(searchBusinessesData.data.data || []));
      dispatch(
        setBusinessTotalPages(searchBusinessesData.data.totalPages || 0)
      );
      dispatch(
        setBusinessTotalElements(searchBusinessesData.data.totalElements || 0)
      );
    }
  }, [
    dispatch,
    searchBusinessesData,
    searchBusinessesError,
    searchBusinessesIsError,
    searchBusinessesIsSuccess,
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
    },
    {
      id: 'dateOfIncorporation',
      header: 'Date of Incorporation',
      accessorKey: 'createdAt',
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <Button
            styled={false}
            route={`/services/company-details/${row.original.id}`}
            value="Full info"
          />
        );
      },
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
                    return value.length >= 3 || 'Company name is too short';
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
                        className={`${
                          errors?.searchValue && 'text-red-600'
                        } text-white bg-primary mx-2 p-3 rounded-md cursor-pointer`}
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
                          if (Object.keys(errors).length) {
                            return;
                          }
                          clearErrors('searchValue');

                          setSearchQueries({
                            ...searchQueries,
                            type: searchType,
                          });
                          await searchBusinesses({
                            ...searchQueries,
                            companyName:
                              searchType === 'companyName'
                                ? watch('searchValue')
                                : '',
                            tin:
                              searchType === 'tin' ? watch('searchValue') : '',
                            page,
                            size,
                          });
                        }}
                      />
                    </menu>
                    <section className="flex flex-col gap-1 pl-[35%]">
                      {searchBusinessesIsLoading && (
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
              searchBusinessesIsSuccess || businessesList?.length
                ? 'flex'
                : 'hidden'
            } flex-col gap-3`}
          >
            <h1 className="text-primary uppercase font-medium text-center">
              List of companies that match your query {watch('searchValue')}
            </h1>
            <Table
              page={page}
              size={size}
              totalElements={totalElements}
              totalPages={totalPages}
              setPage={setBusinessPage}
              setSize={setBusinessSize}
              data={businessesList?.map((business: Business, index: number) => {
                return {
                  ...business,
                  companyName: business?.companyName?.toUpperCase(),
                  no: index + page,
                  createdAt: formatDate(business.createdAt),
                  companyType: capitalizeString(business.companyType),
                };
              })}
              columns={columns as unknown as ColumnDef<Business>}
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
