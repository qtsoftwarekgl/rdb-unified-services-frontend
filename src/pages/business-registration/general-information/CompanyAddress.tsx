import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../../components/inputs/Select';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/inputs/Button';
import Loader from '../../../components/Loader';
import validateInputs from '../../../helpers/Validations';
import { AppDispatch, RootState } from '../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeBusinessCompletedStep,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../states/features/businessRegistrationSlice';
import { setUserApplications } from '../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '../../../constants/Users';
import { provicesList } from '../../../constants/provinces';
import { districtsList } from '../../../constants/districts';
import { sectorsList } from '../../../constants/sectors';
import { cellsList } from '../../../constants/cells';
import { villagesList } from '../../../constants/villages';

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
  entry_id: string | null;
}

const CompanyAddress: FC<CompanyAddressProps> = ({
  isOpen,
  company_address,
  entry_id,
}) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.user);
  const { isAmending } = useSelector((state: RootState) => state.amendment);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (company_address) {
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
    } else {
      dispatch(removeBusinessCompletedStep('company_address'));
    }
  }, [company_address, dispatch, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setUserApplications({
          entry_id,
          status: 'in_progress',
          active_tab: 'general_information',
          active_step: 'business_activity_vat',
          company_address: {
            ...data,
            step: 'company_address',
          },
        })
      );
      dispatch(setBusinessActiveStep('business_activity_vat'));
      dispatch(setBusinessCompletedStep('company_address'));
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
                      defaultValue={company_address?.province}
                      required
                      label="Province"
                      options={provicesList?.map((province) => {
                        return {
                          label: province.name,
                          value: province.code,
                        };
                      })}
                      onChange={(e) => {
                        field.onChange(e);
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
                      defaultValue={company_address?.district}
                      required
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
                      onChange={(e) => {
                        field.onChange(e);
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
                      defaultValue={
                        sectorsList?.find(
                          (sector) => sector?.code === company_address?.sector
                        )?.code
                      }
                      required
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
                      defaultValue={
                        cellsList?.find(
                          (cell) => cell?.code === company_address?.cell
                        )?.code
                      }
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
                      defaultValue={
                        villagesList?.find(
                          (village) =>
                            village?.code === company_address?.village
                        )?.code
                      }
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
            {isAmending && (
              <Button
                value={'Complete Amendment'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setBusinessActiveTab('preview_submission'));
                }}
              />
            )}
            <Button
              value={isLoading ? <Loader /> : 'Continue'}
              primary
              submit
              disabled={disableForm}
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default CompanyAddress;
