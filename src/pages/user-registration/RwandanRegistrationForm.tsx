import { FC, useState } from 'react';
import { Controller, FieldValue, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { setRegistrationStep } from '../../states/features/authSlice';
import Select from '../../components/inputs/Select';
import { countriesList } from '../../constants/Countries';
import validateInputs from '../../helpers/Validations';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface RwandanRegistrationFormProps {
  isOpen: boolean;
}

const RwandanRegistrationForm: FC<RwandanRegistrationFormProps> = ({
  isOpen = false,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // HANDLE FORM SUBMIT
  const onSubmit = (data: object) => {
    console.log(data);
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-5 bg-white">
      <form
        className="w-[70%] mx-auto flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <span className="text-red-500 text-sm">
                      {errors?.firstName?.message}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    placeholder="Middle name"
                    label="Middle name"
                    {...field}
                  />
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input placeholder="Last name" label="Last name" {...field} />
                </label>
              );
            }}
          />
          <Controller
            name="nationalId"
            control={control}
            rules={{ required: 'National ID is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    placeholder="National ID"
                    required
                    label="National ID Number"
                    {...field}
                  />
                  {errors?.nationalId && (
                    <p className="text-red-500 text-sm">
                      {errors?.nationalId?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: 'Select date of birth' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    type="date"
                    label="Date of birth"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {errors?.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {errors?.dateOfBirth?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Select gender' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-2 items-start w-full">
                  <p className="flex items-center gap-1 text-[15px]">
                    Gender<span className="text-red-500">*</span>
                  </p>
                  <menu className="flex items-center gap-4 mt-2">
                    <Input type="radio" label="Male" {...field} />
                    <Input type="radio" label="Female" {...field} />
                  </menu>
                  {errors?.gender && (
                    <span className="text-red-500 text-sm">
                      {errors?.gender?.message}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="nationality"
            control={control}
            rules={{ required: 'Nationality is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Nationality"
                    placeholder="Nationality"
                    {...field}
                  />
                  {errors?.nationality && (
                    <p className="text-red-500 text-sm">
                      {errors?.nationality?.message}
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
              validate: (value: FieldValue<FieldValues>) => {
                if (String(value).length <= 9) {
                  return (
                    validateInputs(String(`0${value}`), 'tel') ||
                    'Invalid phone number'
                  );
                }
                return (
                  validateInputs(String(value), 'tel') || 'Invalid phone number'
                );
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Phone Number"
                    prefixText="+250"
                    placeholder="7XX XXX XXX"
                    {...field}
                  />
                  {errors?.phone && (
                    <p className="text-red-500 text-sm">
                      {errors?.phone?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="country"
            control={control}
            rules={{ required: 'Select a country' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Select
                    isSearchable
                    label="Country"
                    options={countriesList}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.country && (
                    <p className="text-red-500 text-sm">
                      {errors?.country?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="province"
            control={control}
            rules={{ required: 'Province is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Province"
                    placeholder="Province of residence"
                    {...field}
                  />
                  {errors?.province && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.province?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="district"
            control={control}
            rules={{ required: 'District is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="District"
                    placeholder="District of residence"
                    {...field}
                  />
                  {errors?.district && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.district?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="sector"
            control={control}
            rules={{ required: 'Sector is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Sector"
                    placeholder="Sector of residence"
                    {...field}
                  />
                  {errors?.sector && (
                    <p className="text-red-500 text-sm">
                      {errors?.sector?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="cell"
            control={control}
            rules={{ required: 'Cell is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Cell"
                    placeholder="Cell of residence"
                    {...field}
                  />
                  {errors?.cell && (
                    <p className="text-red-500 text-sm">
                      {errors?.cell?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="village"
            control={control}
            rules={{ required: 'Village is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Village"
                    placeholder="Village of residence"
                    {...field}
                  />
                  {errors?.village && (
                    <p className="text-red-500 text-sm">
                      {errors?.village?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Address"
                    placeholder="Address of residence"
                    {...field}
                  />
                  {errors?.address && (
                    <p className="text-red-500 text-sm">
                      {errors?.address?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="poBox"
            control={control}
            rules={{ required: 'PO Box is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input label="PO Box" placeholder="Postal Code" {...field} />
                  {errors?.poBox && (
                    <p className="text-red-500 text-sm">
                      {errors?.poBox?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email address is required',
              validate: (value) => {
                return (
                  validateInputs(String(value), 'email') ||
                  'Invalid email address'
                );
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Email"
                    placeholder="name@domain.com"
                    {...field}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm">
                      {errors?.email?.message}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    label="Preferred name"
                    placeholder="Nickname"
                    {...field}
                  />
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6">
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
                    suffixIconHandler={(e) => {
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
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword?.confirmPassword,
                      });
                    }}
                    {...field}
                  />
                  {errors?.confirmPassword && (
                    <span className="text-[13px] text-red-500">
                      {errors?.confirmPassword?.message}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex flex-col gap-4 items-center w-full mt-4">
          <Button value="Submit" primary submit className="!py-3 !min-w-[40%]" />
          <Button
            styled={false}
            value={
              <menu className="flex items-center gap-2 ease-in-out duration-300 hover:gap-3">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRegistrationStep('select-nationality'));
            }}
          />
        </menu>
      </form>
    </section>
  );
};

export default RwandanRegistrationForm;
