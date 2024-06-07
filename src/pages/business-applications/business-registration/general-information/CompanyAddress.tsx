import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../../components/inputs/Select';
import Input from '../../../../components/inputs/Input';
import Button from '../../../../components/inputs/Button';
import Loader from '../../../../components/Loader';
import validateInputs from '../../../../helpers/validations';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import { setUserApplications } from '../../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import { provicesList } from '../../../../constants/provinces';
import { districtsList } from '../../../../constants/districts';
import { sectorsList } from '../../../../constants/sectors';
import { cellsList } from '../../../../constants/cells';
import { villagesList } from '../../../../constants/villages';

export interface business_company_address {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  street_name: string;
  po_box: string;
  fax: string;
  email: string;
  phone: string;
}

interface CompanyAddressProps {
  isOpen: boolean;
  company_address: business_company_address | null;
  entryId: string | null;
  status: string;
}

const CompanyAddress: FC<CompanyAddressProps> = ({
  isOpen,
  company_address,
  entryId,
  status,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm();

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('province', company_address?.province);
    setValue('district', company_address?.district);
    setValue('sector', company_address?.sector);
    setValue('cell', company_address?.cell);
    setValue('village', company_address?.village);
    setValue('street_name', company_address?.street_name);
    setValue('po_box', company_address?.po_box);
    setValue('fax', company_address?.fax);
    setValue('email', company_address?.email);
    setValue('phone', company_address?.phone);
  }, [company_address]);

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entryId,
          status: 'IN_PROGRESS',
          active_tab: 'general_information',
          active_step: 'business_activity_vat',
          company_address: {
            ...data,
            step: 'company_address',
          },
        })
      );

      // SET ACTIVE TAB AND STEP
      let active_tab = 'general_information';
      let active_step = 'business_activity_vat';

      if (['in_preview', 'action_required'].includes(status)) {
        active_tab = 'preview_submission';
        active_step = 'preview_submission';
      }

      if (isLoading?.amend) {
        active_tab = 'preview_submission';
        active_step = 'preview_submission';
      }

      dispatch(setBusinessActiveStep(active_step));
      dispatch(setBusinessActiveTab(active_tab));
      dispatch(setBusinessCompletedStep('company_address'));

      setIsLoading({
        ...isLoading,
        submit: false,
        preview: false,
        amend: false,
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col w-full gap-6" disabled={disableForm}>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="province"
              defaultValue={company_address?.province}
              control={control}
              rules={{ required: 'Select province of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      {...field}
                      required
                      placeholder="Select province"
                      label="Province"
                      options={provicesList?.map((province) => {
                        return {
                          label: province.name,
                          value: province.code,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue('district', '');
                        setValue('sector', '');
                        setValue('cell', '');
                        setValue('village', '');
                      }}
                    />
                    {errors?.province && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.province.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="district"
              control={control}
              defaultValue={company_address?.district}
              rules={{ required: 'Select district of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      required
                      placeholder="Select district"
                      label="District"
                      options={districtsList
                        ?.filter(
                          (district) =>
                            district?.province_code === watch('province')
                        )
                        ?.map((district) => {
                          return {
                            label: district.name,
                            value: district.code,
                          };
                        })}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue('sector', '');
                        setValue('cell', '');
                        setValue('village', '');
                      }}
                    />
                    {errors?.district && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.district.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="sector"
              control={control}
              defaultValue={
                sectorsList?.find(
                  (sector) => sector?.code === company_address?.sector
                )?.code
              }
              rules={{ required: 'Select sector of residence' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      {...field}
                      required
                      placeholder="Select sector"
                      label="Sector"
                      options={sectorsList
                        ?.filter(
                          (sector) =>
                            sector?.district_code === watch('district')
                        )
                        ?.map((sector) => {
                          return {
                            label: sector.name,
                            value: sector.code,
                          };
                        })}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue('cell', '');
                        setValue('village', '');
                      }}
                    />
                    {errors?.sector && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.sector.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="cell"
              control={control}
              rules={{ required: 'Select cell of residence' }}
              defaultValue={
                cellsList?.find((cell) => cell?.code === company_address?.cell)
                  ?.code
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      {...field}
                      placeholder="Select cell"
                      required
                      label="Cell"
                      options={cellsList
                        ?.filter(
                          (cell) => cell?.sector_code === watch('sector')
                        )
                        ?.map((cell) => {
                          return {
                            label: cell.name,
                            value: cell.code,
                          };
                        })}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue('village', '');
                      }}
                    />
                    {errors?.cell && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.cell.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="village"
              control={control}
              rules={{ required: 'Select village of residence' }}
              defaultValue={
                villagesList?.find(
                  (village) => village?.code === company_address?.village
                )?.code
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Select
                      placeholder="Select village"
                      {...field}
                      required
                      label="Village"
                      options={villagesList
                        ?.filter(
                          (village) => village?.cell_code === watch('cell')
                        )
                        ?.map((village) => {
                          return {
                            label: village.name,
                            value: village.code,
                          };
                        })}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.village && (
                      <p className="text-red-500 text-[13px]">
                        {String(errors?.village.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="street_name"
              defaultValue={
                watch('street_name') || company_address?.street_name
              }
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      defaultValue={
                        watch('street_name') || company_address?.street_name
                      }
                      label="Street Name"
                      placeholder="Street name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              control={control}
              defaultValue={watch('po_box') || company_address?.po_box}
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="P.O Box"
                      placeholder="Postal code"
                      defaultValue={watch('po_box') || company_address?.po_box}
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="fax"
              defaultValue={watch('fax') || company_address?.fax}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full gap-1">
                    <Input
                      label="Fax"
                      defaultValue={watch('fax') || company_address?.fax}
                      placeholder="Fax"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </menu>
          <menu className="flex items-start w-full gap-6">
            <Controller
              name="email"
              control={control}
              defaultValue={watch('email') || company_address?.email}
              rules={{
                required: 'Email address is required',
                validate: (value) => {
                  return (
                    validateInputs(String(value), 'email') ||
                    'Invalid email address'
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      label="Email"
                      defaultValue={watch('email') || company_address?.email}
                      placeholder="name@domain.com"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-sm text-red-500">
                        {String(errors?.email?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="phone"
              defaultValue={watch('phone') || company_address?.phone}
              rules={{
                required: 'Phone number is required',
                validate: (value) => {
                  return (
                    validateInputs(
                      value?.length < 10 ? `0${value}` : String(value),
                      'tel'
                    ) || 'Invalid phone number'
                  );
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-1">
                    <Input
                      required
                      defaultValue={watch('phone') || company_address?.phone}
                      label="Phone"
                      prefixText="+250"
                      placeholder="Phone number"
                      {...field}
                    />
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
          </menu>
          {[
            'IN_PROGRESS',
            'action_required',
            'is_amending',
            'in_preview',
          ].includes(status) && (
            <menu
              className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
            >
              <Button
                value="Back"
                disabled={disableForm}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('company_details'));
                }}
              />
              {status === 'is_amending' && (
                <Button
                  submit
                  value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                  onClick={async () => {
                    await trigger();
                    if (Object.keys(errors).length > 0) return;
                    setIsLoading({
                      ...isLoading,
                      preview: false,
                      submit: false,
                      amend: true,
                    });
                  }}
                />
              )}
              {['in_preview', 'action_required'].includes(status) && (
                <Button
                  value={
                    isLoading?.preview ? <Loader /> : 'Save & Complete Preview'
                  }
                  primary
                  onClick={() => {
                    dispatch(
                      setUserApplications({ entryId, status: 'in_preview' })
                    );

                    setIsLoading({
                      ...isLoading,
                      preview: true,
                      submit: false,
                      amend: false,
                    });
                  }}
                  submit
                  disabled={disableForm}
                />
              )}
              <Button
                value={isLoading?.submit ? <Loader /> : 'Save & Continue'}
                onClick={async () => {
                  await trigger();
                  if (Object.keys(errors).length > 0) return;
                  setIsLoading({
                    ...isLoading,
                    preview: false,
                    submit: true,
                    amend: false,
                  });
                  dispatch(
                    setUserApplications({ entryId, status: 'IN_PROGRESS' })
                  );
                }}
                primary
                submit
                disabled={disableForm}
              />
            </menu>
          )}
          {['in_review', 'is_approved', 'pending_approval', 'pending_rejection'].includes(status) && (
            <menu className="flex items-center gap-3 justify-between">
              <Button
                value={'Back'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('company_details'));
                }}
              />
              <Button
                value={'Next'}
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveStep('business_activity_vat'));
                }}
              />
            </menu>
          )}
        </fieldset>
      </form>
    </section>
  );
};

export default CompanyAddress;
