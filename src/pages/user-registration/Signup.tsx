import { useSelector } from 'react-redux';
import RegistrationNavbar from './RegistrationNavbar';
import { RootState } from '../../states/store';
import SelectNationality from './SelectNationality';
import RwandanRegistrationForm from './RwandanRegistrationForm';

const Signup = () => {
  // STATE VARIABLES
  const { registrationStep } = useSelector((state: RootState) => state.auth);

  return (
    <main className="flex flex-col gap-3">
      <RegistrationNavbar />
      <section className="flex flex-col gap-6 bg-white rounded-md shadow-sm w-[90%] mx-auto p-8">
        <h1 className="flex items-center text-center justify-center uppercase text-2xl font-semibold">
          User Registration
        </h1>
        <menu className="flex flex-col gap-2 h-full justify-center">
          <SelectNationality
            isOpen={registrationStep === 'select-nationality'}
          />
          <RwandanRegistrationForm
            isOpen={registrationStep === 'rwandan-registration-form'}
          />
        </menu>
      </section>
    </main>
  );
};

export default Signup;
