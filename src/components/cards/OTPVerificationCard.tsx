import { Controller, FieldValues, useForm } from 'react-hook-form';
import Modal from '../Modal';
import OTPInputs from '../inputs/OTPInputs';
import Button from '../inputs/Button';
import { useState } from 'react';
import Loader from '../Loader';

type OTPVerificationCardProps = {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
};

const OTPVerificationCard = ({
  isOpen,
  onClose,
  phone,
}: OTPVerificationCardProps) => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE PHONE NOT PROVIDED
  if (!phone) {
    return null;
  }

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
    return data;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className="flex flex-col gap-4 w-full items-center">
        <h1 className="flex text-center text-[14px] uppercase items-center gap-1">
          Enter a verification code sent to{' '}
          <span className="text-[14px] font-semibold uppercase">
            {String(phone)}
          </span>
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
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
          <menu className="flex items-center gap-3 justify-between">
            <Button
              value="Cancel"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            />
            <Button
              value={isLoading ? <Loader /> : 'Submit'}
              onClick={async (e) => {
                e.preventDefault();
                await trigger();
                if (Object.keys(errors).length === 0) {
                  handleSubmit(onSubmit)();
                }
              }}
              primary
            />
          </menu>
        </form>
      </section>
    </Modal>
  );
};

export default OTPVerificationCard;
