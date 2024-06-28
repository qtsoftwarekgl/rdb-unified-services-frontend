import { Controller, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import Button from '../../components/inputs/Button';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNameReservationActiveStep,
  setNameReservationActiveTab,
} from '../../states/features/nameReservationSlice';
import { convertDecimalToPercentage } from '@/helpers/strings';
import { useLazySearchBusinessNameAvailabilityQuery } from '@/states/api/businessRegApiSlice';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  setNameAvailabilitiesList,
  setSimilarBusinessNamesModal,
} from '@/states/features/businessSlice';
import SimilarBusinessNames from '../business-applications/SimilarBusinessNames';

type Props = {
  isOpen: boolean;
};

const NameReservationSearch = ({ isOpen }: Props) => {
  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm();

  const { name_reservation } = useSelector(
    (state: RootState) => state.nameReservation
  );

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { nameAvailabilitiesList } = useSelector(
    (state: RootState) => state.business
  );

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
      if (
        searchBusinessNameData?.data?.find(
          (availability: { similarity: number; companyName: string }) =>
            availability?.similarity === 1.0
        ) !== undefined
      ) {
        setError('companyName', {
          type: 'manual',
          message: 'Company name already exists',
        });
      }
      dispatch(setNameAvailabilitiesList(searchBusinessNameData?.data));
    }
  }, [
    dispatch,
    searchBusinessNameData?.data,
    searchBusinessNameError,
    searchBusinessNameIsError,
    searchBusinessNameIsSuccess,
    setError,
  ]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-5">
      <form
        className="w-[40%] mx-auto flex flex-col gap-5"
      >
        <Controller
          name="companyName"
          control={control}
          defaultValue={watch('name') || name_reservation}
          rules={{ required: 'Company name is required' }}
          render={({ field }) => {
            return (
              <label className="flex flex-col w-full gap-1">
                <Input
                  label={`Enter the company name to reserve`}
                  suffixIcon={faSearch}
                  suffixIconPrimary
                  required
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
                  {searchBusinessNameIsLoading ||
                    (searchBusinessNameIsFetching && (
                      <figure className="flex items-center gap-2">
                        <Loader />
                        <p className="text-[13px]">Searching...</p>
                      </figure>
                    ))}
                  {searchBusinessNameIsSuccess &&
                    nameAvailabilitiesList?.length > 0 &&
                    !errors?.companyName && (
                      <section className="flex flex-col gap-1">
                        <p className="text-[11px] text-red-600">
                          The given name has a similarity of up to{' '}
                          {convertDecimalToPercentage(
                            nameAvailabilitiesList[0]?.similarity
                          )}
                          % with other business names. Consider changing it to
                          avoid conflicts.
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
                    nameAvailabilitiesList?.length === 0 &&
                    !errors?.companyName && (
                      <p className="text-[11px] text-green-600 px-2">
                        {field.value} is available for use
                      </p>
                    )}
                </menu>
                {errors?.companyName && (
                  <p className="text-red-600 text-[11px]">
                    {String(errors?.companyName?.message)}
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
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setNameReservationActiveStep('owner_details'));
              dispatch(setNameReservationActiveTab('owner_details'));
            }}
          />
          <Button
            value={'Submit'}
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setNameReservationActiveStep('success'));
              dispatch(setNameReservationActiveTab('complete'));
            }}
            disabled={Object.keys(errors)?.length > 0}
          />
        </menu>
      </form>
      <SimilarBusinessNames businessName={watch('companyName')} />
    </section>
  );
};

export default NameReservationSearch;
