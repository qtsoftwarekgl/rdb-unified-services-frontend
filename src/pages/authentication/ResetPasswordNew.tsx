import { Controller, FieldValues, useForm } from 'react-hook-form';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/inputs/Input';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import RegistrationNavbar from '../user-registration/RegistrationNavbar';
import { useTranslation } from 'react-i18next';

const ResetPasswordNew = () => {

  // LOCALES
  const { t } = useTranslation();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // NAVIGATE
  const navigate = useNavigate();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // HANDLE FORM SUBMIT
  interface Payload {
    password: string;
    confirmPassword: string;
  }

  const onSubmit = (data: Payload | FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Password reset successful. Redirecting...');
      setIsLoading(false);
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    }, 1000);
    return data;
  };

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
              rules={{ required: `${t('password-required')}` }}
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
                    />
                    {errors.password && (
                      <span className="text-[13px] text-red-500">
                        {String(errors?.password?.message)}
                      </span>
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
                value={isLoading ? <Loader /> : `${t('submit')}`}
                className="w-[90%] mx-auto !text-[14px]"
                submit
                primary
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
