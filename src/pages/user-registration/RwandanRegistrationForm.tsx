import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setRegistrationStep } from '../../states/features/authSlice';
import validateInputs, { validatePassword } from '../../helpers/validations';
import Select from '../../components/inputs/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faCircleCheck,
  faEyeSlash,
  faInfo,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate, maskPhoneDigits } from '@/helpers/strings';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSignupMutation } from '@/states/api/authApiSlice';
import { toast } from 'react-toastify';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { setUser } from '@/states/features/userSlice';
import Loader from '@/components/Loader';

type RwandanRegistrationFormProps = {
  isOpen: boolean;
};

const RwandanRegistrationForm = ({
  isOpen = false,
}: RwandanRegistrationFormProps) => {
  // LOCALES
  const { t } = useTranslation();

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
    handleSubmit,
    clearErrors,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { userInformation } = useSelector(
    (state: RootState) => state.businessPeople
  );
  // PASSWORD ERRORS
  const [passwordErrors, setPasswordErrors] = useState<
    {
      message: string;
      type: string;
      color: string;
    }[]
  >([]);

  // STATE VARIABLES
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('firstName', userInformation?.foreName);
    setValue('lastName', userInformation?.surnames);
    setValue('dateOfBirth', formatDate(userInformation?.dateOfBirth));
    setValue('gender', userInformation?.gender);
    setValue('nationality', userInformation?.nationality);
    setValue('province', userInformation?.province);
    setValue('district', userInformation?.district);
    setValue('sector', userInformation?.sector);
    setValue('cell', userInformation?.cell);
    setValue('village', userInformation?.village);
  }, [userInformation, setValue]);

  useEffect(() => {
    if (!userInformation) {
      dispatch(setRegistrationStep('selectNationality'));
    }
  }, [dispatch, userInformation]);

  // INITIALIZE SIGNUP MUTATION
  const [
    signup,
    {
      data: signupData,
      isLoading: signupIsLoading,
      isError: signupIsError,
      isSuccess: signupIsSuccess,
      error: signupError,
    },
  ] = useSignupMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    signup({
      ...data,
      userType: 'LOCAL',
      nationalId: userInformation?.documentNumber,
    });
  };

  // HANDLE SIGNUP RESPONSE
  useEffect(() => {
    if (signupIsError) {
      toast.error((signupError as ErrorResponse)?.data?.message);
    } else if (signupIsSuccess) {
      toast.success(
        'Account created successfully. You will a receive an OTP on your email address.'
      );
      dispatch(setUser(signupData?.data));
      navigate(`verify`);
    }
  }, [
    dispatch,
    navigate,
    signupData?.data,
    signupError,
    signupIsError,
    signupIsSuccess,
  ]);

  return (
    <section
      className={`${
        isOpen
          ? 'flex flex-col gap-5 bg-white w-full ease-in duration-500'
          : 'h-0 opacity-0 pointer-events-none'
      }`}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full mx-auto grid grid-cols-2 gap-6 max-[1200px]:w-[75%] max-[1100px]:w-[80%] max-[1000px]:w-[85%] max-lg:w-[90%] max-md:w-[95%] max-sm:w-[80%]">
          <Controller
            name="firstName"
            defaultValue={userInformation?.foreName}
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    readOnly
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <p className="text-sm text-red-500">
                      {String(errors?.firstName?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="lastName"
            defaultValue={userInformation?.surnames}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    readOnly
                    placeholder="Last name"
                    label="Last name"
                    {...field}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: 'Select date of birth' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input required readOnly label="Date of birth" {...field} />
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
            defaultValue={watch('gender') || userInformation?.gender}
            rules={{ required: 'Select gender' }}
            render={({ field }) => {
              const gender = userInformation?.gender;
              return (
                <label className="flex flex-col items-start w-[48%] gap-2">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<p className="text-red-500">*</p>
                  </p>
                  <menu className="flex items-center gap-4 mt-2">
                    {gender === 'M' && (
                      <Input
                        type="radio"
                        label="Male"
                        checked={watch('gender') === 'M'}
                        {...field}
                        value={'M'}
                      />
                    )}
                    {gender === 'F' && (
                      <Input
                        type="radio"
                        label="Female"
                        {...field}
                        value={'F'}
                        checked={watch('gender') === 'F'}
                      />
                    )}
                  </menu>
                  {errors?.gender && (
                    <p className="text-sm text-red-500">
                      {String(errors?.gender?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Select
                    placeholder="Select phone number"
                    required
                    label="Phone"
                    options={userInformation?.phones?.map((phone) => {
                      return {
                        value: phone?.msidn,
                        label: maskPhoneDigits(phone?.msidn),
                      };
                    })}
                    {...field}
                  />
                  {errors?.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {String(errors?.phoneNumber?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="email"
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
                    required
                    label="Email"
                    placeholder="name@domain.com"
                    onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e.target.value);
                      await trigger('email');
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
          <Controller
            name="password"
            control={control}
            rules={{
              validate: (value) => {
                if (validatePassword(value).length > 0) {
                  setPasswordErrors(validatePassword(value));
                  if (
                    !passwordErrors?.find((error) => error?.color === 'red')
                  ) {
                    clearErrors('password');
                    setPasswordIsValid(true);
                    return true;
                  } else {
                    return false;
                  }
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1 w-full mx-auto">
                  <Input
                    type={showPassword?.password ? 'text' : 'password'}
                    label={t('password-label')}
                    placeholder="********"
                    suffixIcon={showPassword?.password ? faEyeSlash : faEye}
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      setShowPassword({
                        ...showPassword,
                        password: !showPassword?.password,
                      });
                    }}
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      await trigger('password');
                    }}
                  />
                  {(errors.password || passwordIsValid) && (
                    <menu className="flex flex-col gap-1 w-full">
                      <p className="text-[13px] text-red-500 ml-1">
                        {errors?.password?.message &&
                          String(errors?.password?.message)}
                      </p>
                      {passwordErrors?.length > 0 && (
                        <ul className="text-[13px] grid grid-cols-2 gap-1 mb-2 w-full">
                          {passwordErrors?.map((error, index) => {
                            return (
                              <li
                                key={index}
                                className={`ml-1 text-[12px] text-${error?.color}-600 flex items-center gap-2`}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    error?.color === 'red'
                                      ? faCircle
                                      : faCircleCheck
                                  }
                                />
                                {error?.message}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </menu>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: `${t('confirm-password-required')}`,
              validate: (value) =>
                value === watch('password') || `${t('password-mismatch')}`,
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1 w-full mx-auto">
                  <Input
                    type={showPassword?.confirmPassword ? 'text' : 'password'}
                    label={t('confirm-password-label')}
                    placeholder="********"
                    suffixIcon={
                      showPassword?.confirmPassword ? faEyeSlash : faEye
                    }
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword?.confirmPassword,
                      });
                    }}
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e.target.value);
                      await trigger('confirmPassword');
                    }}
                  />
                  {errors.confirmPassword && (
                    <span className="text-[13px] text-red-500">
                      {String(errors?.confirmPassword?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </fieldset>
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
              dispatch(setRegistrationStep('selectNationality'));
            }}
          />
          <Button
            value={signupIsLoading ? <Loader /> : 'Continue'}
            submit
            primary
            disabled={Object.keys(errors).length > 0}
          />
        </menu>
      </form>
    </section>
  );
};

export default RwandanRegistrationForm;
