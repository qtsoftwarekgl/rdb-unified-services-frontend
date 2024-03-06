import { Controller, useForm } from 'react-hook-form';
import rdb_logo from '/rdb-logo.png';
import { languages } from '../../constants/Authentication';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/inputs/Input';
import { faEyeSlash, faEye } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

const ResetPasswordNew = () => {
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

  const onSubmit = (data: Payload) => {
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
      <header className="h-[8vh] bg-white flex items-center w-full mx-auto justify-between px-8">
        <nav className="flex items-center justify-between gap-3 w-[95%]">
          <figure className="flex items-center gap-6 justify-between max-[800px]:flex-col-reverse">
            <img
              src={rdb_logo}
              alt="RDB Logo"
              className="mx-auto h-full w-auto max-w-[200px]"
            />
          </figure>
          <select className="">
            {languages.map((language, index) => {
              return (
                <option className="w-full" key={index} value={language.value}>
                  {language.label}
                </option>
              );
            })}
          </select>
        </nav>
      </header>
      <section className="w-full h-full min-h-[85vh] flex flex-col items-center justify-center">
        <form
          className="bg-white w-[35%] rounded-md shadwow-sm flex flex-col gap-6 py-8 px-6 max-w-[600px] max-[1450px]:w-[40%] max-[1300px]:w-[45%] max-[1200px]:w-[50%] max-[1100px]:w-[55%] max-[900px]:w-[55%] max-[800px]:w-[60%] max-[700px]:w-[65%] max-[600px]:w-[70%] max-[550px]:w-[75%] max-[500px]:w-[80%] max-[450px]:w-[85%] max-[400px]:w-[90%] max-[350px]:w-[95%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <menu className="flex flex-col w-full gap-2 items-center justify-center">
            <h1 className="flex text-center text-primary text-xl uppercase font-semibold">
              Set new password
            </h1>
            <p className="text-center text-secondary text-[14px] max-w-[90%]">
              Set a new password for your account.
            </p>
          </menu>
          <menu className="flex flex-col w-full gap-4">
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
                    <Input
                      type={showPassword?.password ? 'text' : 'password'}
                      label="Password"
                      password
                      placeholder="********"
                      suffixIcon={showPassword?.password ? faEyeSlash : faEye}
                      suffixButtonHandler={(e) => {
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
                        {errors.password.message}
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
                required: 'Re-enter your new password to confirm it',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start gap-1 w-[90%] mx-auto">
                    <Input
                      type={showPassword?.confirmPassword ? 'text' : 'password'}
                      label="Confirm Password"
                      placeholder="********"
                      password
                      suffixIcon={
                        showPassword?.confirmPassword ? faEyeSlash : faEye
                      }
                      suffixButtonHandler={(e) => {
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
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <ul className="w-full flex flex-col gap-3 items-center justify-center">
              <Button
                value={isLoading ? <Loader /> : 'Submit'}
                className="w-[90%] mx-auto !text-[14px]"
                submit
                primary
              />
              <Button
                className="!text-[14px]"
                value={
                  <menu className="flex !text-[15px] items-center gap-2 ease-in-out duration-200 hover:gap-3 max-[700px]:text-[14px] max-[500px]:text-[13px]">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
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
