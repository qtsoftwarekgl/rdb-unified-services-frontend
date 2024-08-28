import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import {
  beneficialOwnerControlMeans,
  beneficialOwnerControlType,
  beneficialOwnerTypes,
} from '@/constants/business.constants';
import { capitalizeString } from '@/helpers/strings';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';

const BeneficialOwnershipInformation = () => {
  // REACT HOOK FORM
  const {
    control,
    watch,
    formState: { errors },
  } = useForm();

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
          name="beneficialOwnerType"
          control={control}
          defaultValue={'REGULAR_MANAGEMENT'}
          rules={{ required: 'Select beneficial owner type' }}
          render={({ field }) => {
            return (
              <Select
                label="Beneficial Owner Type"
                required
                options={beneficialOwnerTypes?.map((ownerType) => {
                  return {
                    label: capitalizeString(ownerType),
                    value: ownerType,
                  };
                })}
                {...field}
              />
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
        <Controller
          name="extentOfShare"
          control={control}
          rules={{
            required:
              watch('controlType') === 'DIRECT'
                ? 'Extent of shares is required'
                : false,
          }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label={`Extent of shares ${
                    watch('controlType') !== 'DIRECT' && '(optional)'
                  }`}
                  required={watch('controlType') === 'DIRECT'}
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
                  placeholder="Extent of voting rights"
                  {...field}
                />
              </label>
            );
          }}
        />
        {watch('beneficialOwnerType') === 'SENIOR_MANAGEMENT' && (
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
        {watch('significantInfluence') === 'OTHERS' && (
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
    </section>
  );
};

export default BeneficialOwnershipInformation;
