import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../components/inputs/Input';
import Button from '../../../components/inputs/Button';
import { AppDispatch } from '../../../states/store';
import { useDispatch } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setEmploymentInfo,
} from '../../../states/features/businessRegistrationSlice';
import Loader from '../../../components/Loader';

export interface business_employment_info {
  has_employees: string;
  hiring_date?: string;
  employees_no?: number;
  reference_date?: string;
  number_of_employees?: number;
}

interface EmploymentInfoProps {
  isOpen: boolean;
  employment_info: business_employment_info;
}

const EmploymentInfo: FC<EmploymentInfoProps> = ({ isOpen, employment_info }) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (employment_info) {
      setValue('has_employees', employment_info?.has_employees);
      setValue('hiring_date', employment_info?.hiring_date);
      setValue('employees_no', employment_info?.employees_no);
      setValue('reference_date', employment_info?.reference_date);
    }
  }, [employment_info, setValue]);

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setEmploymentInfo({
          ...data,
          step: 'employment_info',
        })
      );
      dispatch(setBusinessCompletedStep('employment_info'));
      dispatch(setBusinessActiveStep('share_details'));
      dispatch(setBusinessActiveTab('capital_information'));
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-6 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <Controller
          name="has_employees"
          control={control}
          defaultValue={employment_info?.has_employees}
          rules={{ required: 'Select a choice' }}
          render={({ field }) => {
            return (
              <menu className="flex flex-col gap-3 w-full">
                <h4 className="flex items-center gap-1 text-[15px]">
                  Does the company have employees?{' '}
                  <span className="text-red-600">*</span>
                </h4>
                <ul className="flex items-center gap-6">
                  <Input
                    type="radio"
                    label="Yes"
                    checked={watch('has_employees') === 'yes'}
                    name={field?.name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue(field?.name, 'yes');
                      }
                    }}
                  />
                  <Input
                    type="radio"
                    label="No"
                    name={field?.name}
                    checked={watch('has_employees') === 'no'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue(field?.name, 'no');
                      }
                    }}
                  />
                </ul>
                {errors?.has_employees && (
                  <p className="text-red-600 text-[13px]">
                    {String(errors?.has_employees?.message)}
                  </p>
                )}
              </menu>
            );
          }}
        />
        <menu
          className={`${
            watch('has_employees') === 'yes' ? 'flex' : 'hidden'
          } w-full items-start gap-5 flex-wrap`}
        >
          <Controller
            name="hiring_date"
            control={control}
            defaultValue={employment_info?.hiring_date}
            rules={{
              required:
                watch('has_employees') === 'yes'
                  ? 'Hiring date is required'
                  : false,
            }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    defaultValue={employment_info?.hiring_date}
                    type="date"
                    required
                    label="Hiring Date"
                    {...field}
                  />
                  {errors?.hiring_date && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.hiring_date?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="employees_no"
            defaultValue={employment_info?.employees_no || 0}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    label="Number of employees"
                    defaultValue={employment_info?.employees_no || 0}
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="reference_date"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    type="date"
                    label="Account reference date"
                    {...field}
                  />
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
            onClick={(e) => {
              e.preventDefault();
              dispatch(setBusinessActiveStep('senior_management'));
            }}
          />
          <Button value={isLoading ? <Loader /> : 'Continue'} submit primary />
        </menu>
      </form>
    </section>
  );
};

export default EmploymentInfo;
