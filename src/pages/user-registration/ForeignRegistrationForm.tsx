import { FC, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faX } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { setRegistrationStep } from '../../states/features/authSlice';
import moment from 'moment';
import Select from '../../components/inputs/Select';
import { countriesList } from '../../constants/Countries';
import validateInputs from '../../helpers/Validations';
import { useNavigate } from 'react-router-dom';

interface ForeignRegistrationFormProps {
  isOpen: boolean;
}

const ForeignRegistrationForm: FC<ForeignRegistrationFormProps> = ({
  isOpen,
}) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentFile, setAttachmentFile] = useState<File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATE
  const navigate = useNavigate();

  // HANDLE FORM SUBMIT
  interface Payload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }

  const onSubmit = (data: Payload | FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/register/verify');
    }, 1000);
    return data;
  };

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-5 bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex-col gap-6 w-[70%] mx-auto flex max-[1200px]:w-[75%] max-[1100px]:w-[80%] max-[1000px]:w-[85%] max-lg:w-[90%] max-md:w-[95%] max-sm:w-[80%]`}
      >
        <menu className="w-full flex items-start gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="documentNo"
            rules={{ required: 'Document No is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input label="Document No" required {...field} />
                  {errors?.documentNo && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.documentNo?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="expiryDate"
            rules={{
              required: 'Select expiry date',
              validate: (value) => {
                if (moment(value).format() < moment(new Date()).format()) {
                  return 'Select a valid expiry date';
                }
                return true;
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input label="Expiry Date" type="date" required {...field} />
                  {errors?.expiryDate && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.expiryDate?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    required
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <span className="text-red-500 text-sm">
                      {String(errors?.firstName?.message)}
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
        <menu className="w-full flex items-start gap-6 max-sm:flex-col max-sm:gap-3">
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
                    <span className="text-red-500 text-[13px]">
                      {String(errors?.gender?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="nationality"
            control={control}
            rules={{ required: 'Nationality is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Select
                    isSearchable
                    label="Country"
                    options={countriesList?.map((country) => {
                      return {
                        ...country,
                        label: country.name,
                        value: country?.code,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e?.value);
                    }}
                  />
                  {errors?.country && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.country?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              required: 'Select date of birth',
              validate: (value) => {
                if (moment(value).format() > moment(new Date()).format()) {
                  return 'Select a valid date of birth';
                }
                return true;
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-start">
                  <Input
                    required
                    type="date"
                    label="Date of birth"
                    {...field}
                  />
                  {errors?.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.dateOfBirth?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex items-start gap-6 max-sm:flex-col max-sm:gap-3">
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <p className="flex items-center gap-1">
                    Phone number <span className="text-red-600">*</span>
                  </p>
                  <menu className="flex items-center gap-0 relative">
                    <span className="absolute inset-y-0 start-0 flex items-center ps-3.5">
                      <select
                        className="w-full !text-[12px]"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {countriesList?.map((country) => {
                          return (
                            <option
                              key={country?.dial_code}
                              value={country?.dial_code}
                            >
                              {`${country?.code} ${country?.dial_code}`}
                            </option>
                          );
                        })}
                      </select>
                    </span>
                    <input
                      onChange={field.onChange}
                      className="ps-[96px] py-[8px] px-4 font-normal placeholder:!font-light placeholder:italic placeholder:text-[13px] text-[14px] flex items-center w-full rounded-lg border-[1.5px] border-secondary border-opacity-50 outline-none focus:outline-none focus:border-[1.6px] focus:border-primary ease-in-out duration-50"
                      type="text"
                    />
                  </menu>
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
                    required
                    label="Email"
                    placeholder="name@domain.com"
                    {...field}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.email?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="w-full flex flex-col items-start gap-3 my-3 max-md:items-center">
          <h3 className="uppercase text-[14px] font-normal flex items-center gap-1">
            Attachment <span className="text-red-600">*</span>
          </h3>
          <Controller
            name="attachment"
            rules={{ required: 'Document attachment is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-fit items-start gap-2 max-sm:!w-full">
                  <ul className="flex items-center gap-3 max-sm:w-full max-md:flex-col">
                    <Input
                      type="file"
                      accept="application/pdf,image/*"
                      className="!w-fit max-sm:!w-full"
                      onChange={(e) => {
                        field.onChange(e?.target?.files?.[0]);
                        setAttachmentFile(e?.target?.files?.[0]);
                      }}
                    />
                    {attachmentFile && (
                      <p className="flex items-center gap-2 text-[14px] text-black font-normal">
                        {attachmentFile?.name}
                        <FontAwesomeIcon
                          icon={faX}
                          className="text-red-600 text-[14px] cursor-pointer ease-in-out duration-300 hover:scale-[1.02]"
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentFile(null);
                            setValue('attachment', null);
                          }}
                        />
                      </p>
                    )}
                  </ul>
                  {errors?.attachment && (
                    <p className="text-red-500 text-sm">
                      {String(errors?.attachment?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
        </menu>
        <menu className="flex flex-col gap-4 items-center w-full mt-4">
          <Button
            value={isLoading ? <Loader /> : 'Submit'}
            primary
            submit
            className="!py-3 !min-w-[40%] max-sm:!min-w-full"
          />
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

export default ForeignRegistrationForm;
