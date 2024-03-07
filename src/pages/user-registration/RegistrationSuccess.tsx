import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RegistrationNavbar from './RegistrationNavbar';
import rdb_logo from '/rdb-logo.png';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRegistrationStep } from '../../states/features/authSlice';

const RegistrationSuccess = () => {

  // STATE VARIABLES
  const dispatch = useDispatch();

  // NAVIGATE
  const navigate = useNavigate();

  return (
    <main className="flex flex-col gap-4 w-full">
      <RegistrationNavbar />
      <section className="w-full h-full min-h-[85vh] flex flex-col items-center justify-center">
        <article className="bg-white w-[35%] rounded-md shadwow-sm flex flex-col gap-6 py-8 px-6 max-w-[600px] max-[1450px]:w-[40%] max-[1300px]:w-[45%] max-[1200px]:w-[50%] max-[1100px]:w-[55%] max-lg:w-[60%] max-md:w-[65%] max-sm:w-[85%]">
          <figure className="flex items-center gap-6 justify-between max-[800px]:flex-col-reverse">
            <img
              src={rdb_logo}
              alt="RDB Logo"
              className="mx-auto h-full w-auto max-w-[200px]"
            />
          </figure>
          <FontAwesomeIcon
            className="text-[5rem] text-primary max-lg:text-[4rem] max-md:text-[3rem] max-sm:text-[2rem]"
            icon={faCircleCheck}
          />
          <menu className="flex flex-col w-full gap-2 items-center justify-center">
            <h1 className="flex text-center text-primary text-xl uppercase font-semibold">
              Registration Successful
            </h1>
            <p className="text-center text-secondary text-[14px] max-w-[90%]">
              Your account has been created Successfully. Click the button below
              to continue.
            </p>
          </menu>
          <Button
            value="Continue"
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRegistrationStep('select-nationality'));
              navigate('/auth/login');
            }}
          />
        </article>
      </section>
    </main>
  );
};

export default RegistrationSuccess;
