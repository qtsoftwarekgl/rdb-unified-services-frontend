import { Controller, useForm } from 'react-hook-form';
import { languages } from '../../constants/Authentication';
import rdb_logo from '/rdb-logo.png';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import validateInputs from '../../helpers/Validations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../../components/Loader';

const ResetPasswordRequest = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  // DEFINE INTERFACE
  interface Payload {
    email: string;
  }

  // HANDLE FORM SUBMIT
  const onSubmit = (data: Payload) => {
    setIsLoading(true);
    sessionStorage.setItem('email', data?.email);
    setTimeout(() => {
      navigate('/auth/reset-password/verify');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className="flex flex-col gap-4 w-full mx-auto">
      <header className="h-[8vh] bg-white flex items-center w-full mx-auto justify-between px-8">
        <nav className="flex items-center justify-between gap-3 mx-auto w-[95%]">
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
              Reset Password
            </h1>
            <p className="text-center text-secondary text-[14px] max-w-[90%]">
              Enter your email address to verify account ownership. You will
              receive a 4-digit One-time Password in your inbox.
            </p>
          </menu>
          <menu className="flex flex-col w-full gap-4">
            <Controller
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) => {
                  return (
                    validateInputs(value, 'email') || 'Invalid email address'
                  );
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 items-start w-[90%] mx-auto">
                    <Input
                      placeholder="Email address"
                      label="Email"
                      {...field}
                    />
                    {errors?.email && (
                      <p className="text-red-600 text-[13px]">
                        {errors?.email?.message}
                      </p>
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
                    Back to login
                  </menu>
                }
                styled={false}
                route="/auth/login"
              />
            </ul>
          </menu>
        </form>
      </section>
    </main>
  );
};

export default ResetPasswordRequest;
