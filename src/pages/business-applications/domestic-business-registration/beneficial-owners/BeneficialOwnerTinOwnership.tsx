import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/Loader';
import { useUpdateBeneficialOwnerTinMutation } from '@/states/api/businessRegApiSlice';
import {
  setActiveBeneficialOwnerNavigationStep,
  setCompleteBeneficialOwnerNavigationStep,
  setNewBeneficialOwner,
  setSelectedBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { setSelectedFounderDetailWithShares } from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { queryParam } from '@/types/models/business';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  ErrorResponse,
  URLSearchParamsInit,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';

interface BeneficialOwnerTinOwnershipProps {
  beneficialOwnerId: queryParam;
  setAddNewBeneficialOwner: (value: boolean) => void;
}

const BeneficialOwnerTinOwnership = ({
  beneficialOwnerId,
}: BeneficialOwnerTinOwnershipProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { newBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // NAVIGATION
  const [searchParams, setSearchParams] = useSearchParams();

  // REACT HOOK FORM
  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const { hasTin, tinRwandan } = watch();

  // INITIALIZE UPDATE BENEFICIAL OWNER TIN
  const [
    updateBeneficialOwnerTin,
    {
      data: updateBeneficialOwnerTinData,
      isLoading: updateBeneficialOwnerTinIsLoading,
      isSuccess: updateBeneficialOwnerTinIsSuccess,
      isError: updateBeneficialOwnerTinIsError,
      error: updateBeneficialOwnerTinError,
      reset: resetUpdateBeneficialOwnerTin,
    },
  ] = useUpdateBeneficialOwnerTinMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateBeneficialOwnerTin({
      id: beneficialOwnerId,
      tin: data?.tinNumber,
    });
  };

  // HANDLE UPDATE TIN RESPONSE
  useEffect(() => {
    if (updateBeneficialOwnerTinIsSuccess) {
      dispatch(setNewBeneficialOwner(updateBeneficialOwnerTinData?.data));
      dispatch(setCompleteBeneficialOwnerNavigationStep('tin_ownership'));
      dispatch(setActiveBeneficialOwnerNavigationStep('personal_information'));
      resetUpdateBeneficialOwnerTin();
    } else if (updateBeneficialOwnerTinIsError) {
      const errorResponse =
        (updateBeneficialOwnerTinError as ErrorResponse)?.data?.message ||
        'An error occurred while updating beneficial owner TIN';
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    resetUpdateBeneficialOwnerTin,
    updateBeneficialOwnerTinData,
    updateBeneficialOwnerTinError,
    updateBeneficialOwnerTinIsError,
    updateBeneficialOwnerTinIsSuccess,
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('tinNumber', newBeneficialOwner?.tinNumber);
  }, [newBeneficialOwner?.tinNumber, setValue]);

  return (
    <form
      className="w-full flex flex-col gap-4 h-fit"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="w-full grid grid-cols-2 gap-5 justify-between">
        <Controller
          name="hasTin"
          control={control}
          rules={{ required: 'Indicate if the owner has a TIN' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <p className="mb-2 w-full">
                  Does the person have an individual Tax Identification Number
                  (TIN)?
                </p>
                <ul className="flex items-center gap-5">
                  <Input type="radio" label="Yes" {...field} value="yes" />
                  <Input type="radio" {...field} label="No" value="no" />
                </ul>
                {errors?.hasTin && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.hasTin?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        {hasTin === 'yes' && (
          <Controller
            name="tinRwandan"
            control={control}
            rules={{
              required: `Indicate if the owner's TIN is registered in Rwanda`,
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <p className="mb-2">Is the TIN registered in Rwanda?</p>
                  <ul className="flex items-center gap-5">
                    <Input type="radio" label="Yes" {...field} value="yes" />
                    <Input type="radio" label="No" {...field} value="no" />
                  </ul>
                  {errors?.tinRwandan && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.tinRwandan?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
        {hasTin === 'yes' && tinRwandan && (
          <Controller
            name="tinNumber"
            control={control}
            rules={{
              required: 'TIN value is required',
              validate: (value) => {
                if (value?.length !== 9) {
                  return 'TIN number must be 9 characters long';
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    label="TIN Number"
                    required
                    suffixIcon={tinRwandan === 'yes' ? faSearch : undefined}
                    suffixIconPrimary
                    placeholder="Enter TIN number"
                    {...field}
                  />
                  {tinRwandan === 'yes' && (
                    <span className="text-[12px] text-gray-500">
                      Enter TIN number and click search to fetch details
                    </span>
                  )}
                  {errors?.tinNumber && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.tinNumber?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
      </fieldset>
      <menu className="w-full flex iteme-center gap-3 justify-between my-2">
        <Button
          value={'Cancel'}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedBeneficialOwner(undefined));
            dispatch(setSelectedFounderDetailWithShares(undefined));
            setSearchParams({
              ...searchParams,
              businessId: queryParams?.businessId,
            } as URLSearchParamsInit);
          }}
        />
        <Button
          value={updateBeneficialOwnerTinIsLoading ? <Loader /> : 'Next'}
          submit
          primary
          disabled={Object.keys(errors)?.length > 0}
        />
      </menu>
    </form>
  );
};

export default BeneficialOwnerTinOwnership;
