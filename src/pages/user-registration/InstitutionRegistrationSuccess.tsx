import Button from '../../components/inputs/Button';
import RegistrationNavbar from './RegistrationNavbar';

const InstitutionRegistrationSuccess = () => {
  return (
    <main className="flex flex-col gap-5 mx-auto">
        <RegistrationNavbar />
      <section className="flex flex-col bg-white p-6 rounded-md shadow-md w-[90%] mx-auto gap-5 items-center justify-center m-auto">
        <h2 className="text-[14px] p-2 text-black rounded-md bg-green-200 text-center">
          Your account application has been submitted successully. You will
          receive a notification on the email address you provied once the
          application is approved by RDB.
        </h2>
        <Button
          value="Continue"
          primary
          route="/auth/login"
          className="max-sm:!w-full"
        />
      </section>
    </main>
  );
};

export default InstitutionRegistrationSuccess;
