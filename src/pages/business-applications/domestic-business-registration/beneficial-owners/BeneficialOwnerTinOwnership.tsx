import Input from '@/components/inputs/Input';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Controller, useForm } from 'react-hook-form';

const BeneficialOwnerTinOwnership = () => {
  // REACT HOOK FORM
  const {
    control,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <section className="w-full flex flex-col gap-4">
      <fieldset className="w-full grid grid-cols-2 gap-5 justify-between">
        <Controller
          name="hasTin"
          control={control}
          rules={{ required: 'Indicate if the owner has a TIN' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <p className="mb-2 w-full">
                  Does the person have a Tax Identification Number?
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
        {watch('hasTin') === 'yes' && (
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
        {watch('hasTin') === 'yes' && watch('tinRwandan') && (
          <Controller
            name="tinNumber"
            control={control}
            rules={{ required: 'TIN value is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    label="TIN Number"
                    required
                    suffixIcon={
                      watch('tinRwandan') === 'yes' ? faSearch : undefined
                    }
                    suffixIconPrimary
                    placeholder="Enter TIN number"
                    {...field}
                  />
                  {watch('tinRwandan') === 'yes' && (
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
    </section>
  );
};

export default BeneficialOwnerTinOwnership;
