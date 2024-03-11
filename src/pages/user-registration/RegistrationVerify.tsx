import { Controller, FieldValues, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import OTPInputs from '../../components/inputs/OTPInputs';
import { useState } from 'react';
import Loader from '../../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationNavbar from './RegistrationNavbar';
import { setNationalIdDetails, setRegistrationStep } from '../../states/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../states/store';

const RegistrationVerify = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // STATE VARIABLES
  const dispatch = useDispatch();
  const { registrationStep } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  // HANDLE FORM SUBMIT
  interface Payload {
    otp: string;
  }

  const onSubmit = (data: Payload | FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      if (registrationStep === 'rwandan-registration-form') {
        dispatch(setNationalIdDetails(null));
        navigate('/auth/register/set-password');
      } else {
        navigate('/auth/register/success');
      }
      setIsLoading(false);
    }, 1000);
    return data;
  };

  return (
    <main className="flex flex-col gap-3 w-full">
      <RegistrationNavbar />
      <section className="w-full h-full min-h-[85vh] flex flex-col items-center justify-center">
        <form
          className="bg-white w-[35%] rounded-md shadwow-sm flex flex-col gap-6 py-8 px-6 max-w-[600px] max-[1450px]:w-[40%] max-[1300px]:w-[45%] max-[1200px]:w-[50%] max-[1100px]:w-[55%] max-lg:w-[60%] max-md:w-[65%] max-sm:w-[85%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <menu className="flex flex-col w-full gap-2 items-center justify-center">
            <h1 className="flex text-center text-primary text-xl uppercase font-semibold">
              Verify Account
            </h1>
            <p className="text-center text-secondary text-[14px] max-w-[90%]">
              {registrationStep === 'rwandan-registration-form'
                ? 'Enter the 4-digit One-time Password sent to your phone number.'
                : 'Enter the One-time Password sent to your email. Please check your spam folder if you do not find the email in your inbox.'}
            </p>
          </menu>
          <menu className="flex flex-col w-full gap-4">
            <Controller
              name="otp"
              rules={{
                required: 'Enter the 4-digit OTP sent to your phone number',
                validate: (value) => {
                  if (value.length !== 4) {
                    return 'Enter a valid 4-digit OTP';
                  }
                  return true;
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-center gap-2 w-[90%] mx-auto">
                    <OTPInputs className="justify-center" {...field} />
                    {errors?.otp && (
                      <p className="text-red-600 text-[13px] text-center">
                        {String(errors?.otp?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            <ul className="w-full flex flex-col gap-3 items-center justify-center">
              <Button
                value={isLoading ? <Loader /> : 'Submit'}
                className="w-[70%] mx-auto !text-[15px]"
                submit
                primary
              />
              <p className="text-secondary text-[14px] text-center">
                If you didn't receive a code,{' '}
                <span className="text-primary font-medium text-[14px]">
                  <Link to={'#'} className="text-[14px]">
                    Resend it here
                  </Link>
                </span>
              </p>
              <Button
                className="!text-[14px]"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setRegistrationStep('rwandan-registration-form'));
                  navigate('/auth/register');
                }}
                value={
                  <menu className="flex !text-[15px] items-center gap-2 ease-in-out duration-200 hover:gap-3 max-[700px]:text-[14px] max-[500px]:text-[13px]">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </menu>
                }
                styled={false}
              />
            </ul>
          </menu>
        </form>
      </section>
    </main>
  );
};

export default RegistrationVerify;
