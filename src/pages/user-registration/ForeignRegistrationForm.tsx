import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { setRegistrationStep } from '../../states/features/authSlice';
import moment from 'moment';
import Select from '../../components/inputs/Select';
import { countriesList } from '../../constants/countries';
import validateInputs, { validatePassword } from '../../helpers/validations';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import ViewDocument from '../user-company-details/ViewDocument';
import { toast } from 'react-toastify';
import { genderOptions } from '@/constants/inputs.constants';
import { useSignupMutation } from '@/states/api/authApiSlice';
import { setUser } from '@/states/features/userSlice';
import {
  faCircle,
  faCircleCheck,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import { useUploadUserAttachmentMutation } from '@/states/api/userManagementApiSlice';

type ForeignRegistrationFormProps = {
  isOpen: boolean;
};

const ForeignRegistrationForm = ({ isOpen }: ForeignRegistrationFormProps) => {
  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
    watch,
    clearErrors,
  } = useForm();

  // LOCALES
  const { t } = useTranslation();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null
  );
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<
    {
      message: string;
      type: string;
      color: string;
    }[]
  >([]);

  // INITIALIZE UPLOAD USER ATTACHMENT MUTATION
  const [
    uploadUserAttachment,
    {
      error: userAttachmentError,
      isLoading: userAttachmentIsLoading,
      isSuccess: userAttachmentIsSuccess,
      isError: userAttachmentIsError,
    },
  ] = useUploadUserAttachmentMutation();

  // NAVIGATE
  const navigate = useNavigate();

  // INITIALIZE SIGNUP MUTATION
  const [
    signup,
    {
      data: signupData,
      isLoading: signupIsLoading,
      isError: signupIsError,
      isSuccess: signupIsSuccess,
      error: signupError,
      reset: resetSignup,
    },
  ] = useSignupMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    signup({
      ...data,
      userType: 'FOREIGN',
    });
  };

  // HANDLE SIGNUP RESPONSE
  useEffect(() => {
    if (signupIsError) {
      toast.error((signupError as ErrorResponse)?.data?.message);
    } else if (signupIsSuccess) {
      const formData = new FormData();
      formData.append('file', watch('attachment'));
      formData.append('userId', String(signupData?.data?.id));
      formData.append('attachmentType', 'PASSPORT');
      formData.append('fileName', String(attachmentFile?.name));
      uploadUserAttachment({ formData });
    }
  }, [
    attachmentFile?.name,
    dispatch,
    navigate,
    signupData,
    signupError,
    signupIsError,
    signupIsSuccess,
    uploadUserAttachment,
    watch,
  ]);

  // HANDLE UPLOAD ATTACHMENT RESPONSE
  useEffect(() => {
    if (userAttachmentIsError) {
      toast.error(
        (userAttachmentError as ErrorResponse)?.data?.message ||
          'An error occurred while uploading attachment. Please try again'
      );
    } else if (userAttachmentIsSuccess) {
      dispatch(setUser(signupData?.data));
      navigate('verify');
      resetSignup();
    }
  }, [dispatch, navigate, resetSignup, signupData, userAttachmentError, userAttachmentIsError, userAttachmentIsSuccess]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-5 bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-4 w-full`}
      >
        <fieldset className="w-[70%] mx-auto grid grid-cols-2 gap-6 max-[1200px]:w-[75%] max-[1100px]:w-[80%] max-[1000px]:w-[85%] max-lg:w-[90%] max-md:w-[95%] max-sm:w-[80%]">
          <Controller
            name="personDocNo"
            rules={{
              required: 'Passport number is required',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    label="Passport Number"
                    required
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e?.target?.value.toUpperCase());
                      await trigger('personDocNo');
                    }}
                  />
                  {errors?.personDocNo && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.personDocNo?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="issueDate"
            rules={{
              required: 'Select issue date',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    range
                    label="Issue Date"
                    type="date"
                    required
                    toDate={new Date()}
                    {...field}
                  />
                  {errors?.issueDate && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.issueDate?.message)}
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
                if (
                  moment(value).format() < moment(watch('issueDate')).format()
                ) {
                  return 'Expiry date cannot be greater than issue date';
                }
                return true;
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input
                    range
                    label="Expiry Date"
                    type="date"
                    required
                    fromDate={watch('issueDate')}
                    {...field}
                  />
                  {errors?.expiryDate && (
                    <p className="text-[13px] text-red-500">
                      {String(errors?.expiryDate?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    placeholder="First name"
                    label="First name"
                    {...field}
                  />
                  {errors?.firstName && (
                    <span className="text-sm text-red-500">
                      {String(errors?.firstName?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
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
                <label className="flex flex-col items-start w-full gap-2">
                  <Select
                    options={genderOptions}
                    required
                    label={'Sex'}
                    {...field}
                  />
                  {errors?.gender && (
                    <p className="text-red-500 text-[13px]">
                      {String(errors?.gender?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="nationality"
            control={control}
            rules={{ required: 'Nationality is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Select
                    label="Country of residence"
                    placeholder="Select country of residence"
                    options={countriesList
                      ?.filter((country) => country?.code !== 'RW')
                      ?.map((country) => {
                        return {
                          ...country,
                          label: country.name,
                          value: country?.code,
                        };
                      })}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!watch('persDocIssuePlace')) {
                        setValue('persDocIssuePlace', e);
                      }
                    }}
                  />
                  {errors?.nationality && (
                    <p className="text-sm text-red-500">
                      {String(errors?.nationality?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="persDocIssuePlace"
            control={control}
            rules={{ required: 'Select country of issue' }}
            defaultValue={watch('nationality')}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start w-full gap-1">
                  <Select
                    label="Country of passport issue"
                    placeholder="Select country of passport issue"
                    options={countriesList
                      ?.filter((country) => country?.code !== 'RW')
                      ?.map((country) => {
                        return {
                          ...country,
                          label: country.name,
                          value: country?.code,
                        };
                      })}
                    {...field}
                  />
                  {errors?.persDocIssuePlace && (
                    <p className="text-sm text-red-500">
                      {String(errors?.persDocIssuePlace?.message)}
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
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    type="date"
                    label="Date of birth"
                    toDate={moment(new Date()).subtract(16, 'years').toDate()}
                    {...field}
                  />
                  {errors?.dateOfBirth && (
                    <p className="text-sm text-red-500">
                      {String(errors?.dateOfBirth?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: 'Phone number is required',
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col w-full gap-1">
                  <Input label="Phone number" required type="tel" {...field} />
                  {errors?.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {String(errors?.phoneNumber?.message)}
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
                <label className="flex flex-col items-start w-full gap-1">
                  <Input
                    required
                    label="Email"
                    placeholder="name@domain.com"
                    {...field}
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-500">
                      {String(errors?.email?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          <menu className="flex flex-col items-start w-full gap-2 mb-3 max-md:items-center">
            <p className="text-[14px] font-normal flex items-center gap-1">
              Passport attachment <span className="text-red-600">*</span>
            </p>
            <Controller
              name="attachment"
              rules={{ required: 'Document attachment is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-full items-start gap-2 max-sm:!w-full">
                    <ul className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept="application/pdf"
                        className="!w-fit max-sm:!w-full"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            field.onChange(e.target.files[0]);
                            setValue('attachment', e.target.files[0]);
                            setAttachmentFile(e.target.files[0]);
                            trigger('attachment');
                          } else toast.info('No file selected');
                        }}
                      />
                      {errors?.attachment && (
                        <p className="text-sm text-red-500">
                          {String(errors?.attachment?.message)}
                        </p>
                      )}
                    </ul>
                    {field?.value && (
                      <ul className="text-[13px] text-gray-500 flex items-center gap-3">
                        {field?.value?.name}
                        <Button
                          styled={false}
                          className="!underline"
                          value={'Preview'}
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentPreview(
                              URL.createObjectURL(field?.value)
                            );
                          }}
                        />
                      </ul>
                    )}
                  </label>
                );
              }}
            />
            {userAttachmentIsLoading && (
              <figure className="flex items-center gap-3">
                <Loader className="text-primary" /> Uploading{' '}
                {attachmentFile?.name}
              </figure>
            )}
          </menu>
          <Controller
            name="password"
            control={control}
            rules={{
              validate: (value) => {
                if (validatePassword(value).length > 0) {
                  setPasswordErrors(validatePassword(value));
                  if (
                    !passwordErrors?.find((error) => error?.color === 'red')
                  ) {
                    clearErrors('password');
                    setPasswordIsValid(true);
                    return true;
                  } else {
                    return false;
                  }
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1 w-full mx-auto">
                  <Input
                    type={showPassword?.password ? 'text' : 'password'}
                    label={t('password-label')}
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
                    onChange={async (e) => {
                      field.onChange(e);
                      await trigger('password');
                    }}
                  />
                  {(errors.password || passwordIsValid) && (
                    <menu className="flex flex-col gap-1 w-full">
                      <p className="text-[13px] text-red-500 ml-1">
                        {errors?.password?.message &&
                          String(errors?.password?.message)}
                      </p>
                      {passwordErrors?.length > 0 && (
                        <ul className="text-[13px] grid grid-cols-2 gap-1 mb-2 w-full">
                          {passwordErrors?.map((error, index) => {
                            return (
                              <li
                                key={index}
                                className={`ml-1 text-[12px] text-${error?.color}-600 flex items-center gap-2`}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    error?.color === 'red'
                                      ? faCircle
                                      : faCircleCheck
                                  }
                                />
                                {error?.message}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </menu>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: `${t('confirm-password-required')}`,
              validate: (value) =>
                value === watch('password') || `${t('password-mismatch')}`,
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col items-start gap-1 w-full mx-auto">
                  <Input
                    type={showPassword?.confirmPassword ? 'text' : 'password'}
                    label={t('confirm-password-label')}
                    placeholder="********"
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
                    onChange={async (e) => {
                      field.onChange(e.target.value);
                      await trigger('confirmPassword');
                    }}
                  />
                  {errors.confirmPassword && (
                    <span className="text-[13px] text-red-500">
                      {String(errors?.confirmPassword?.message)}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </fieldset>

        <menu className="flex flex-col items-center w-full gap-4 mt-4">
          <Button
            value={
              signupIsLoading || userAttachmentIsLoading ? (
                <Loader />
              ) : (
                'Submit'
              )
            }
            primary
            submit
            className="!py-3 !min-w-[40%] max-sm:!min-w-full"
          />
          <Button
            styled={false}
            value={
              <menu className="flex items-center gap-2 duration-300 ease-in-out hover:gap-3">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setRegistrationStep('selectNationality'));
            }}
          />
        </menu>
      </form>
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
    </section>
  );
};

export default ForeignRegistrationForm;
