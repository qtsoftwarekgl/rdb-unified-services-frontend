import { Controller, FieldValues, useForm } from 'react-hook-form';
import RegistrationNavbar from './RegistrationNavbar';
import Input from '../../components/inputs/Input';
import validateInputs from '../../helpers/validations';
import Select from '../../components/inputs/Select';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const InstitutionRegistration = () => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // REACT NAVIGATION
  const navigate = useNavigate();

  // STATE VARIABLES
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/auth/register/institution/verify`);
    }, 1000);
    return data;
  };

  return (
    <main className="flex flex-col gap-5 w-full">
      <RegistrationNavbar />
      <section className="w-[80%] mx-auto flex flex-col gap-6 p-6 bg-white rounded-md shadow-sm">
        <h1 className="text-xl uppercase font-semibold text-center text-primary">
          Register as an institution
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-[50%] mx-auto rounded-md"
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1">
                  <Input
                    label="Name"
                    required
                    {...field}
                    placeholder="Institution name"
                  />
                  {errors?.name && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.name?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              validate: (value) =>
                validateInputs(value, 'email') || 'Invalid email',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1">
                  <Input
                    label="Email"
                    required
                    {...field}
                    placeholder="Institution email address"
                  />
                  {errors?.email && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.email?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone number is required',
              validate: (value) => {
                return validateInputs(value, 'tel') || 'Invalid phone number';
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Phone number"
                    placeholder="07XX XXX XXX"
                    required
                    {...field}
                  />
                  {errors?.phone && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.phone?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Select institution type' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1">
                  <Select
                    label="Institution type"
                    required
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    options={[
                      { value: 'private_sector', label: 'Private Sector' },
                      { value: 'government', label: 'Government' },
                    ]}
                  />
                  {errors?.type && (
                    <p className="text-red-600 text-[13px]">
                      {String(errors?.type?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu className="flex flex-col items-center gap-3 justify-between mt-3">
            <Button
              value={isLoading ? <Loader /> : 'Submit'}
              submit
              primary
              className="!w-full"
            />
            <Button
            route='/auth/login'
              value={
                <menu className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back
                </menu>
              }
              styled={false}
            />
          </menu>
        </form>
      </section>
    </main>
  );
};

export default InstitutionRegistration;
