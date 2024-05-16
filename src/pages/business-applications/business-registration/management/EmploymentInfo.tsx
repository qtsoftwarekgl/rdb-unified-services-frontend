import { FC, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../../../components/inputs/Input';
import Button from '../../../../components/inputs/Button';
import { AppDispatch, RootState } from '../../../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
} from '../../../../states/features/businessRegistrationSlice';
import Loader from '../../../../components/Loader';
import { setUserApplications } from '../../../../states/features/userApplicationSlice';
import { RDBAdminEmailPattern } from '../../../../constants/Users';
import moment from 'moment';

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
  entry_id: string | null;
  status: string;
}

const EmploymentInfo: FC<EmploymentInfoProps> = ({
  isOpen,
  employment_info,
  entry_id,
  status,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({
    submit: false,
    preview: false,
    amend: false,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const disableForm = RDBAdminEmailPattern.test(user?.email);

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
    setTimeout(() => {
      dispatch(
        setUserApplications({
          entry_id,
          active_tab: 'capital_information',
          active_step: 'share_details',
          employment_info: {
            ...data,
            step: 'employment_info',
          },
        })
      );

      // SET ACTIVE TAB AND STEP
      let active_tab = 'capital_information';
      let active_step = 'share_details';

      if (
        ['in_preview', 'action_required'].includes(status) ||
        isLoading?.amend
      ) {
        active_tab = 'preview_submission';
        active_step = 'preview_submission';
      }

      dispatch(setBusinessCompletedStep('employment_info'));
      dispatch(setBusinessActiveStep(active_step));
      dispatch(setBusinessActiveTab(active_tab));

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
        <fieldset disabled={disableForm} className="flex flex-col w-full gap-6">
          <Controller
            name="reference_date"
            control={control}
            rules={{
              required: 'Account reference date is required',
            }}
            render={({ field }) => {
              return (
                <label className="w-[49%] flex flex-col gap-1">
                  <Input
                    type="date"
                    required
                    label="Account reference date"
                    {...field}
                    value={moment(`12/31/${new Date().getFullYear()}`).format(
                      'YYYY-MM-DD'
                    )}
                  />
                  {errors?.reference_date && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.reference_date?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="has_employees"
            control={control}
            defaultValue={employment_info?.has_employees}
            rules={{ required: 'Select a choice' }}
            render={({ field }) => {
              return (
                <menu className="flex flex-col w-full gap-3">
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
              defaultValue={employment_info?.employees_no}
              rules={{
                required:
                  watch('has_employees') === 'yes'
                    ? 'Number of employees is required'
                    : false,
                validate: (value) => {
                  if (watch('has_employees') === 'yes') {
                    if (!value) return 'Number of employees is required';
                    if (value < 1)
                      return 'Number of employees must be greater than 0';
                  }
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      required
                      label="Number of employees"
                      defaultValue={employment_info?.employees_no}
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e);
                        await trigger('employees_no');
                      }}
                    />
                    {errors?.employees_no && (
                      <p className="text-red-600 text-[13px]">
                        {String(errors?.employees_no?.message)}
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
                dispatch(setBusinessActiveStep('senior_management'));
              }}
            />
            {status === 'is_Amending' && (
              <Button
                value={isLoading?.amend ? <Loader /> : 'Complete Amendment'}
                onClick={() => {
                  setIsLoading({
                    ...isLoading,
                    amend: true,
                    submit: false,
                    preview: false,
                  });
                }}
                submit
              />
            )}
            {['in_preview', 'action_required'].includes(status) && (
              <Button
                value={
                  isLoading?.preview ? <Loader /> : 'Save & Complete Review'
                }
                onClick={() => {
                  setIsLoading({
                    ...isLoading,
                    preview: true,
                    submit: false,
                    amend: false,
                  });
                }}
                submit
                primary
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
                  submit: true,
                  preview: false,
                  amend: false,
                });
                dispatch(
                  setUserApplications({ entry_id, status: 'in_progress' })
                );
              }}
              submit
              primary
              disabled={disableForm}
            />
          </menu>
        </fieldset>
      </form>
    </section>
  );
};

export default EmploymentInfo;