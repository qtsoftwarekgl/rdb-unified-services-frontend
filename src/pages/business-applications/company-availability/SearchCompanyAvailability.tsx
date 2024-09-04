import { Controller, useForm } from 'react-hook-form';
import UserLayout from '../../../containers/UserLayout';
import Button from '../../../components/inputs/Button';
import Input from '../../../components/inputs/Input';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../states/store';
import { useLazySearchBusinessNameAvailabilityQuery } from '@/states/api/businessRegApiSlice';
import { formatNumbers } from '@/helpers/strings';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SimilarBusinessNames from '../SimilarBusinessNames';
import {
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
} from '@/states/features/businessSlice';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';

const SearchCompanyAvailability = () => {
  // REACT HOOK FORM
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { companyName } = watch();

  // NAVIGATION
  const navigate = useNavigate();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // INITIALIZE SEARCH BUSINESS NAME AVAILABILITY
  const [
    searchBusinessNameAvailability,
    {
      data: businessNameAvailabilityData,
      error: businessNameAvailabilityError,
      isFetching: businessNameAvailabilityIsFetching,
      isSuccess: businessNameAvailabilityIsSuccess,
      isError: businessNameAvailabilityIsError,
    },
  ] = useLazySearchBusinessNameAvailabilityQuery();

  // HANDLE SEARCH BUSINESS AVAILABILITY RESPONSE
  useEffect(() => {
    if (businessNameAvailabilityIsError) {
      const errorResponse =
        (businessNameAvailabilityError as ErrorResponse)?.data?.message ||
        'An error occurred while search business name availability. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    businessNameAvailabilityError,
    businessNameAvailabilityIsError,
    businessNameAvailabilityIsSuccess,
  ]);

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      label: 'Services',
      route: '/services',
    },
    {
      label: 'Name Availability',
      route: '/name-availability',
    },
  ];

  return (
    <UserLayout>
      <section className="flex flex-col h-full gap-8 p-8 bg-white rounded-md shadow-sm">
        <nav className="w-full flex flex-col items-center">
          <CustomBreadcrumb navigationLinks={navigationLinks} />
        </nav>
        <form className="max-sm:w-full w-[50%] mx-auto max-sm:p-4 py-4 flex flex-col items-center gap-8 rounded-md border-[#e1e1e6]">
          <h1 className="uppercase text-primary font-semibold text-lg">
            Search business name availability
          </h1>
          <Controller
            name="companyName"
            control={control}
            rules={{ required: 'Company name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-3">
                  <Input
                    required
                    label="Enter the company name to check availability"
                    labelClassName="text-center flex flex-col items-center"
                    suffixIcon={faSearch}
                    suffixIconPrimary
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      if (!field?.value) {
                        setError('companyName', {
                          type: 'manual',
                          message: 'Company name is required',
                        });
                        return;
                      } else {
                        searchBusinessNameAvailability({
                          companyName: field.value,
                        });
                      }
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors('companyName');
                    }}
                  />
                  {businessNameAvailabilityIsFetching && (
                    <p className="flex text-[13px] items-center gap-1">
                      <Loader className="text-primary" /> Looking for name
                      availability
                    </p>
                  )}
                  {businessNameAvailabilityData?.data?.length <= 0 &&
                  businessNameAvailabilityIsSuccess &&
                  companyName ? (
                    <p className="text-green-600 text-[13px] gap-1 flex items-center">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-[13px]"
                      />
                      {companyName} is available for use.
                    </p>
                  ) : (
                    businessNameAvailabilityData?.data?.length > 0 &&
                    businessNameAvailabilityIsSuccess &&
                    companyName && (
                      <p className="text-[13px] text-red-600">
                        The provided name has similar names with up to{' '}
                        {formatNumbers(
                          businessNameAvailabilityData?.data?.[0]?.similarity *
                            100
                        )}
                        %. Consider changing it to avoid conflicts.{' '}
                        <span className="text-[13px] text-red-600">
                          <Link
                            className="text-[13px] text-red-600 underline"
                            to={'#'}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(setSimilarBusinessNamesModal(true));
                              dispatch(
                                setNameAvailabilitiesList(
                                  businessNameAvailabilityData?.data
                                )
                              );
                            }}
                          >
                            Click here to view them.
                          </Link>
                        </span>
                      </p>
                    )
                  )}
                  {errors?.name && (
                    <p className="text-sm text-red-500">
                      {String(errors?.name?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu
            className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
          >
            <Button
              value={'Back'}
              route="/services"
              className="w-20 border border-primary"
            />
           {businessNameAvailabilityIsSuccess && <Button
              value={'Complete'}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/services`);
              }}
              primary
              disabled={companyName && businessNameAvailabilityIsError}
            />}
          </menu>
        </form>
      </section>
      <SimilarBusinessNames businessName={companyName} />
    </UserLayout>
  );
};

export default SearchCompanyAvailability;
