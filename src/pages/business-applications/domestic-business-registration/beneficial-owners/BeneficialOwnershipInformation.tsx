import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import {
  beneficialOwnerControlMeans,
  beneficialOwnerControlType,
} from '@/constants/business.constants';
import { capitalizeString } from '@/helpers/strings';
import { RootState } from '@/states/store';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const BeneficialOwnershipInformation = () => {
  // STATE VARIABLES
  const { selectedFounderDetailWithShares } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const { selectedBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );

  // REACT HOOK FORM
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const { beneficialOwnerType, controlType, significantInfluence } = watch();

  // SET DEFAULT VALUES
  useEffect(() => {
    if (selectedFounderDetailWithShares) {
      setValue(
        'extentOfShare',
        selectedFounderDetailWithShares.shareQuantityPercentage
      );
      setValue(
        'extentOfVoting',
        selectedFounderDetailWithShares.shareQuantityPercentage
      );
    }
    if (selectedBeneficialOwner) {
      setValue(
        'beneficialOwnerType',
        selectedBeneficialOwner?.beneficialOwnerType
      );
      setValue('controlType', selectedBeneficialOwner.controlType);
      setValue(
        'significantInfluence',
        selectedBeneficialOwner.significantInfluence
      );
    }
  }, [selectedBeneficialOwner, selectedFounderDetailWithShares, setValue]);

  return (
    <section className="w-full flex flex-col gap-4">
      <fieldset className="grid grid-cols-2 w-full gap-5 justify-between">
        <Controller
          name="registeredDate"
          control={control}
          rules={{ required: 'Date of becoming beneficial owner is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Date of becoming a beneficial owner"
                  required
                  type="date"
                  toDate={moment().toDate()}
                  {...field}
                />
                {errors?.registeredDate && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.registeredDate?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="controlType"
          control={control}
          rules={{ required: 'Control type is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  {...field}
                  label={'Control Type'}
                  required
                  options={beneficialOwnerControlType?.map((controlType) => {
                    return {
                      label: capitalizeString(controlType),
                      value: controlType,
                      disabled: selectedBeneficialOwner?.controlType
                        ? controlType !== selectedBeneficialOwner?.controlType
                        : false,
                    };
                  })}
                />
                {errors?.controlType && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.controlType?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        {selectedBeneficialOwner?.significantInfluence === 'OTHER' && (
          <Controller
            name="significantInfluence"
            control={control}
            rules={{ required: 'Control means is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    label={'Control Means'}
                    required
                    options={beneficialOwnerControlMeans?.map((controlMean) => {
                      return {
                        label: capitalizeString(controlMean),
                        value: controlMean,
                      };
                    })}
                  />
                  {errors?.significantInfluence && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.significantInfluence?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
        <Controller
          name="extentOfShare"
          control={control}
          rules={{
            required:
              controlType === 'DIRECT' || selectedFounderDetailWithShares
                ? 'Extent of shares is required'
                : false,
          }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label={`Extent of shares ${
                    controlType !== 'DIRECT' && '(optional)'
                  }`}
                  required={
                    controlType === 'DIRECT' ||
                    !!selectedFounderDetailWithShares
                  }
                  readOnly={!!selectedFounderDetailWithShares}
                  type="number"
                  placeholder="Extent of shares"
                  {...field}
                />
                {errors?.extentOfShare && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.extentOfShare?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="extentOfVoting"
          control={control}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Extent of voting rights"
                  type="number"
                  required={
                    controlType === 'DIRECT' ||
                    !!selectedFounderDetailWithShares
                  }
                  readOnly={!!selectedFounderDetailWithShares}
                  placeholder="Extent of voting rights"
                  {...field}
                />
              </label>
            );
          }}
        />
        {beneficialOwnerType === 'SENIOR_MANAGEMENT' && (
          <Controller
            name="seniorManagementPosition"
            rules={{
              required: 'Senior management position is required',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    required
                    label="Senior Management Position"
                    placeholder="Senior Management Position"
                    {...field}
                  />
                  {errors?.seniorManagementPosition && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.seniorManagementPosition?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
        {significantInfluence === 'OTHERS' && (
          <Controller
            name="OtherControlMeansDesc"
            control={control}
            rules={{ required: 'Control means description is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    resize
                    required
                    label="Other Control Means Description"
                    placeholder="Enter control means description"
                    {...field}
                  />
                  {errors?.OtherControlMeansDesc && (
                    <span className="text-red-500 text-[12px]">
                      {String(errors?.OtherControlMeansDesc?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        )}
      </fieldset>
      <menu className='w-full flex flex-col gap-4'>
        <h3 className='font-medium text-lg'>Attachments</h3>
        <fieldset className='grid grid-cols-2 gap-5'></fieldset>
      </menu>
    </section>
  );
};

export default BeneficialOwnershipInformation;
