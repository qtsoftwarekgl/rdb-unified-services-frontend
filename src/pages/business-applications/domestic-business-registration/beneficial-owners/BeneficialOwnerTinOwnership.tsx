import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import {
  setActiveBeneficialOwnerNavigationStep,
  setCompleteBeneficialOwnerNavigationStep,
  setNewBeneficialOwner,
  setSelectedBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { setSelectedFounderDetailWithShares } from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface BeneficialOwnerTinOwnershipProps {
  setAddNewBeneficialOwner: (value: boolean) => void;
}

const BeneficialOwnerTinOwnership = ({
  setAddNewBeneficialOwner,
}: BeneficialOwnerTinOwnershipProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { newBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );

  // REACT HOOK FORM
  const {
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { hasTin, tinRwandan } = watch();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    dispatch(setNewBeneficialOwner({
      ...newBeneficialOwner,
      tinNumber: data?.tinNumber,
    }));
    dispatch(setCompleteBeneficialOwnerNavigationStep('tin_ownership'));
    dispatch(setActiveBeneficialOwnerNavigationStep('personal_information'));
  };

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
            setAddNewBeneficialOwner(false);
          }}
        />
        <Button
          value={'Next'}
          submit
          primary
          disabled={Object.keys(errors)?.length > 0}
        />
      </menu>
    </form>
  );
};

export default BeneficialOwnerTinOwnership;
