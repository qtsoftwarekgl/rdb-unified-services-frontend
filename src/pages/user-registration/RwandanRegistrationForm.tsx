import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNationalIdDetails,
  setRegistrationStep,
  setUserDetails,
} from '../../states/features/authSlice';
import validateInputs from '../../helpers/Validations';
import { useNavigate } from 'react-router';
import Loader from '../../components/Loader';
import Select from '../../components/inputs/Select';
import { userData } from '../../constants/authentication';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

interface RwandanRegistrationFormProps {
  isOpen: boolean;
}

const RwandanRegistrationForm: FC<RwandanRegistrationFormProps> = ({
  isOpen = false,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { nationalIdDetails } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('nationalId', nationalIdDetails?.phone);
    setValue('firstName', nationalIdDetails?.first_name);
    setValue('lastName', nationalIdDetails?.last_name);
    setValue('dateOfBirth', nationalIdDetails?.date_of_birth);
    setValue('gender', nationalIdDetails?.gender);
    setValue('nationality', nationalIdDetails?.nationality);
    setValue('phone', nationalIdDetails?.phone);
    setValue('country', {
      value: 'RW',
      label: 'Rwanda',
    });
    setValue('province', nationalIdDetails?.province);
    setValue('district', nationalIdDetails?.district);
    setValue('sector', nationalIdDetails?.sector);
    setValue('cell', nationalIdDetails?.cell);
    setValue('village', nationalIdDetails?.village);
  }, [nationalIdDetails, setValue]);

  useEffect(() => {
    if (!nationalIdDetails) {
      dispatch(setRegistrationStep('select-nationality'));
    }
  }, [dispatch, isOpen, nationalIdDetails]);

  const handleInputChanges = async (name: string | number) => {
    handleSubmit(async () => {
      await trigger(String(name));
    })();
  };

  return (
    <section
      className={`${
        isOpen
          ? 'flex flex-col gap-5 bg-white w-full ease-in duration-500'
          : 'h-0 opacity-0 pointer-events-none'
      }`}
    >
      <form className="w-full mx-auto flex flex-col gap-6 max-[1200px]:w-[75%] max-[1100px]:w-[80%] max-[1000px]:w-[85%] max-lg:w-[90%] max-md:w-[95%] max-sm:w-[80%] ">
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="firstName"
            defaultValue={watch('firstName') || nationalIdDetails?.first_name}
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    defaultValue={
                      watch('firstName') || nationalIdDetails?.first_name
                    }
                    required
                    readOnly
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <span className="text-sm text-red-500">
                      {String(errors?.firstName?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="lastName"
            defaultValue={watch('lastName') || nationalIdDetails?.last_name}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    readOnly
                    defaultValue={
                      watch('lastName') || nationalIdDetails?.lastName
                    }
                    placeholder="Last name"
                    label="Last name"
                    {...field}
                  />
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue={
              watch('dateOfBirth') || nationalIdDetails?.date_of_birth
            }
            rules={{ required: 'Select date of birth' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    defaultValue={
                      watch('dateOfBirth') || nationalIdDetails?.date_of_birth
                    }
                    required
                    readOnly
                    label="Date of birth"
                    {...field}
                  />
                  {errors?.dateOfBirth && (
                    <p className="text-sm text-red-500">
                      {String(errors?.dateOfBirth?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
            defaultValue={watch('gender') || nationalIdDetails?.gender}
            rules={{ required: 'Select gender' }}
            render={({ field }) => {
              const gender = watch('gender');
              return (
                <label className="flex flex-col items-start w-full gap-2">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<span className="text-red-500">*</span>
                  </p>
                  <menu className="flex items-center gap-4 mt-2">
                    {gender === 'Male' && (
                      <Input
                        type="radio"
                        label="Male"
                        checked={watch('gender') === 'Male'}
                        {...field}
                      />
                    )}
                    {gender === 'Female' && (
                      <Input
                        type="radio"
                        label="Female"
                        {...field}
                        checked={watch('gender') === 'Female'}
                      />
                    )}
                  </menu>
                  {errors?.gender && (
                    <span className="text-sm text-red-500">
                      {String(errors?.gender?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex items-start w-full gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="phone"
            control={control}
            defaultValue={watch('phone') || nationalIdDetails?.phone}
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Select
                    required
                    defaultValue={{
                      label: `(+250) ${userData?.[0]?.phone}`,
                      value: userData?.[0]?.phone,
                    }}
                    label="Phone"
                    options={userData?.slice(0, 3)?.map((user) => {
                      return {
                        label: `(+250) ${user?.phone}`,
                        value: user?.phone,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
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
          <Controller
            name="email"
            defaultValue={watch('email') || nationalIdDetails?.email}
            control={control}
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
                    defaultValue={watch('email') || nationalIdDetails?.email}
                    required
                    label="Email"
                    placeholder="name@domain.com"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      handleInputChanges('email');
                      field.onChange(e.target.value);
                    }}
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
        </menu>
        <p className="flex items-center text-[12px] gap-2 mx-auto">
          <FontAwesomeIcon
            className="p-1 px-2 text-[11px] bg-primary text-white rounded-full"
            icon={faInfo}
          />
          Insert your email address and select a desired phone number to
          continue. You will receive a verification code to your telephone
          number.
        </p>
        <menu className="flex items-center w-full gap-4 mt-3 justify-between">
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRegistrationStep('select-nationality'));
            }}
          />
          <Button
            value={isLoading ? <Loader /> : 'Continue'}
            primary
            onClick={async (e) => {
              e.preventDefault();
              await trigger();
              if (Object.values(errors).length === 0) {
                setIsLoading(true);
                setTimeout(() => {
                  dispatch(
                    setUserDetails({
                      ...nationalIdDetails,
                      email: watch('email'),
                    })
                  );
                  dispatch(
                    setNationalIdDetails({
                      ...nationalIdDetails,
                      email: watch('email'),
                    })
                  );
                  navigate('/auth/register/verify');
                  setIsLoading(false);
                }, 1000);
              }
            }}
          />
        </menu>
      </form>
    </section>
  );
};

export default RwandanRegistrationForm;
