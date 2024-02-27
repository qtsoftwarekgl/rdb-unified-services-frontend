import { Controller, useForm } from 'react-hook-form';
import rdb_icon from '/rdb-icon.png';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import validateInputs from '../../helpers/Validations';
import InfoPanel from './InfoPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/Modal';
import { setInfoModal } from '../../states/features/authSlice';

const Login = () => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { infoModal } = useSelector((state: RootState) => state.auth);

  // HANDLE SUBMIT
  const onSubmit = (data: object) => {
    console.log(data);
  };

  return (
    <main className="h-[100vh] flex items-center justify-between w-full !bg-white">
      <section className="login-panel !bg-white flex flex-col items-center justify-between gap-8 w-full">
        <figure className="w-[90%] mx-auto flex items-center gap-6 justify-between max-[800px]:flex-col-reverse">
          <img src={rdb_icon} alt="RDB Logo" className="mx-auto" />
          <FontAwesomeIcon onClick={(e) => {
            e.preventDefault();
            dispatch(setInfoModal(true));
          }} className='text-primary cursor-pointer ease-in-out duration-200 hover:scale-[1.02] lg:hidden' icon={faCircleInfo} />
        </figure>
        <h1 className='text-primary font-semibold uppercase text-2xl'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-[50%] max-[1200px]:max-w-[55%] max-[1000px]:max-w-[60%] max-[800px]:max-w-[50%] max-[650px]:max-w-[55%] max-[600px]:max-w-[60%] max-[550px]:max-w-[65%] max-[500px]:max-w-[70%] max-[450px]:max-w-[75%]">
          <Controller
            rules={{ required: 'Email is required', validate: (value) => {
              return validateInputs(value, 'email') || 'Invalid email address';
            } }}
            name="email"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    placeholder="Enter email address"
                    label="Email"
                    {...field}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.email.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            rules={{ required: 'Password is required' }}
            name="password"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    placeholder="Enter password"
                    label="Password"
                    {...field}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors.password.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu className='flex items-center gap-3 justify-between w-full my-1 max-[1050px]:flex-col max-[800px]:flex-row max-[450px]:flex-col'>
            <Input label='Keep me logged in' type='checkbox' onChange={(e) => {
              return e.target.checked;
            }} />
            <Button styled={false} className='!text-[13px]' value='Forgot password?' />
          </menu>
          <menu className='flex flex-col gap-4 items-center my-4'>
            <Button submit primary value='Login' className='w-full' />
            <Button value='Create account' styled={false} />
          </menu>
        </form>
      </section>
      <article className='w-full h-full max-[800px]:hidden'>
      <InfoPanel />
      </article>
      <Modal isOpen={infoModal} onClose={() => {
        dispatch(setInfoModal(false));
      }} className='!h-full'>
        <InfoPanel />
      </Modal>
    </main>
  );
};

export default Login;
