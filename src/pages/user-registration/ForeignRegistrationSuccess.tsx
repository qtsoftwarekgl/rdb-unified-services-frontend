import { FC } from 'react';
import Button from '../../components/inputs/Button';

interface ForeignRegistrationSuccessProps {
  isOpen: boolean;
}

const ForeignRegistrationSuccess: FC<ForeignRegistrationSuccessProps> = ({
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-5 w-full items-center justify-center m-auto">
      <h2 className='text-[14px] p-2 text-black rounded-md bg-green-200 text-center'>
        Your account application has been submitted successully. You will
        receive a notification on the email address you provied once the
        application is approved by RDB.
      </h2>
      <Button value="Continue" primary route="/auth/login" className='max-sm:!w-full' />
    </section>
  );
};

export default ForeignRegistrationSuccess;
