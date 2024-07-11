import store from 'store';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/inputs/Input';
import { faEyeSlash, faEye, faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import RegistrationNavbar from '../user-registration/RegistrationNavbar';
import { useTranslation } from 'react-i18next';
import { validatePassword } from '@/helpers/validations';
import { useResetPasswordMutation } from '@/states/api/authApiSlice';

const ResetPasswordNew = () => {

  // LOCALES
  const { t } = useTranslation();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    trigger
  } = useForm();

  // NAVIGATE
  const navigate = useNavigate();

    // PASSWORD ERRORS
    const [passwordErrors, setPasswordErrors] = useState<{
      message: string;
      type: string;
      color: string;
    }[]>([]);

  // STATE VARIABLES
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  // INITIALIZE PASSWORD RESET MUTATION
  const [resetPassword, {
    error: resetPasswordError,
    isLoading: resetPasswordIsLoading,
    isSuccess: resetPasswordIsSuccess,
    isError: resetPasswordIsError,
  }] = useResetPasswordMutation();

  const onSubmit = (data: FieldValues) => {
    resetPassword({
      password: data?.password,
      passwordResetCode: store.get('passwordResetCode'),
    });
  };

  // HANDLE PASSWORD RESET RESPONSE
  useEffect(() => {
    if (resetPasswordIsSuccess) {
      toast.success('Password reset successful. Login to continue');
      store.remove('passwordResetCode');
      navigate('/auth/login');
    } else if (resetPasswordIsError) {
      const errorResponse =
        (resetPasswordError as ErrorResponse)?.data?.message ||
        'An error occurred while resetting password. Refresh and try again';
      toast.error(errorResponse);
    }
  }, [
    resetPasswordIsSuccess,
    resetPasswordIsError,
    navigate,
    resetPasswordError,
  ]);

  return (
    <main className="flex flex-col gap-4 w-full mx-auto">
      <RegistrationNavbar />
      <section className="w-full h-full min-h-[85vh] flex flex-col items-center justify-center">
        <form
          className="bg-white w-[35%] rounded-md shadwow-sm flex flex-col gap-6 py-8 px-6 max-w-[600px] max-[1450px]:w-[40%] max-[1300px]:w-[45%] max-[1200px]:w-[50%] max-[1100px]:w-[55%] max-[900px]:w-[55%] max-[800px]:w-[60%] max-[700px]:w-[65%] max-[600px]:w-[70%] max-[550px]:w-[75%] max-[500px]:w-[80%] max-[450px]:w-[85%] max-[400px]:w-[90%] max-[350px]:w-[95%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <menu className="flex flex-col w-full gap-2 items-center justify-center">
            <h1 className="flex text-center text-primary text-xl uppercase font-semibold">
              {t('set-new-password')}
            </h1>
          </menu>
          <menu className="flex flex-col w-full gap-4">
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
                  <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
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
                      <menu className="flex flex-col gap-1">
                        <p className="text-[13px] text-red-500 ml-1">
                          {errors?.password?.message &&
                            String(errors?.password?.message)}
                        </p>
                        {passwordErrors?.length > 0 && (
                          <ul className="text-[13px] flex flex-col gap-1">
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
                  <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
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
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('confirmPassword');
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
            <ul className="w-full flex flex-col gap-3 items-center justify-center">
              <Button
                value={resetPasswordIsLoading ? <Loader /> : `${t('submit')}`}
                className="w-[90%] mx-auto !text-[14px]"
                submit
                primary
                disabled={Object.keys(errors)?.length > 0}
              />
              <Button
                className="!text-[14px]"
                value={
                  <menu className="flex !text-[15px] items-center gap-2 ease-in-out duration-200 hover:gap-3 max-[700px]:text-[14px] max-[500px]:text-[13px]">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {t('back')}
                  </menu>
                }
                styled={false}
                route="/auth/reset-password/request"
              />
            </ul>
          </menu>
        </form>
      </section>
    </main>
  );
};

export default ResetPasswordNew;
