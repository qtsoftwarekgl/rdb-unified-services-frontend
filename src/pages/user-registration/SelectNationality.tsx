import { useEffect } from 'react';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import { faEllipsis, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import {
  setRegistrationStep,
} from '../../states/features/authSlice';
import RwandanRegistrationForm from './RwandanRegistrationForm';
import { Controller, useForm } from 'react-hook-form';
import { useLazyGetUserInformationQuery } from '@/states/api/externalServiceApiSlice';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'react-router-dom';
import { setUserInformation } from '@/states/features/businessPeopleSlice';
import validateInputs from '@/helpers/validations';

type SelectNationalityProps = {
  isOpen: boolean;
}

const SelectNationality = ({ isOpen }: SelectNationalityProps) => {
  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    watch,
    trigger,
    clearErrors,
    setError,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { registrationStep } = useSelector((state: RootState) => state.auth);
  const { userInformation } = useSelector((state: RootState) => state.businessPeople)

  // INITIALIZE GET USER INFORMATION FROM NID
  const [
    getUserInformation,
    {
      data: userInformationData,
      isFetching: userInformationIsFetching,
      isError: userInformationIsError,
      error: userInformationError,
      isSuccess: userInformationIsSuccess,
    },
  ] = useLazyGetUserInformationQuery();

  // HANDLE GET USER INFORMATION RESPONSE
  useEffect(() => {
    if (userInformationIsError) {
      toast.error((userInformationError as ErrorResponse)?.data?.message);
    } else if (userInformationIsSuccess) {
      dispatch(
        setUserInformation({
          ...userInformationData?.data,
          documentNumber: watch('personDocNo'),
        })
      );
      dispatch(setRegistrationStep('rwandanRegistrationForm'));
    }
  }, [
    dispatch,
    userInformationData,
    userInformationError,
    userInformationIsError,
    userInformationIsSuccess,
    watch('personDocNo'),
  ]);

  useEffect(() => {
    dispatch(setUserInformation(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (watch('userType') === 'FOREIGNER') {
      dispatch(setUserInformation(undefined));
      dispatch(setRegistrationStep('foreignRegistrationForm'));
    }
  }, [dispatch, watch('userType')]);

  if (!isOpen) return null;

  return (
    <section className={`flex flex-col gap-8 items-center w-full`}>
      <section
        className={`flex flex-col items-center gap-6 w-[70%] mx-auto p-6 shadow-md rounded-md max-2xl:w-[75%] max-xl:w-[80%] max-[1000px]:w-[85%] max-[900px]:w-[90%] max-md:w-[95%] max-sm:w-[100%]`}
      >
        <menu className="flex items-start w-full gap-6 max-sm:flex-col">
          <Controller
            name="userType"
            control={control}
            rules={{
              required: 'Identification is required'
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-2">
                  <Select
                    label="Identification"
                    placeholder="Select identification"
                    required
                    options={[
                      { value: 'LOCAL', label: 'Rwandese' },
                      { value: 'RESIDENT', label: 'Local resident' },
                      { label: 'Foreigner', value: 'FOREIGNER' },
                    ]}
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      await trigger('userType');
                    }}
                    defaultValue={'LOCAL'}
                    labelClassName={`${
                      (['passport'].includes(watch('userType')) ||
                        !watch('userType')) &&
                      '!w-1/2 mx-auto max-lg:!w-3/5 max-md:!w-2/3 max-sm:!w-full'
                    }`}
                  />
                  {errors?.userType && (
                    <p className="text-red-600 text-[13px] mx-1 text-center">
                      {String(errors?.userType?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          {['LOCAL', 'RESIDENT'].includes(watch('userType')) && (
            <Controller
              name="personDocNo"
              rules={{ required: 'National identification number is required',
                validate: (value) => {
                  return (
                    validateInputs(value, 'nid') ||
                    'National identification number must be 16 characters'
                  );} }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col items-start w-full gap-2">
                    <Input
                      required
                      label="ID Document No"
                      suffixIconPrimary
                      suffixIcon={
                        userInformationIsFetching ? faEllipsis : faSearch
                      }
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        if (!field.value) {
                          setError('personDocNo', {
                            type: 'manual',
                            message: 'National identification number is required'
                          })
                        } else {
                          clearErrors('personDocNo')
                          getUserInformation({ documentNumber: field?.value });
                        }
                      }}
                      placeholder="1 XXXX X XXXXXXX X XX"
                      {...field}
                      onChange={async (e) => {
                        field.onChange(e.target.value);
                        await trigger('personDocNo');
                      }}
                    />
                    {userInformationIsFetching && !errors?.personDocNo && (
                      <span className="flex items-center gap-[2px] text-[13px]">
                        <Loader className="text-primary" /> Validating document
                      </span>
                    )}
                  </label>
                );
              }}
            />
          )}
        </menu>
        <menu
          className={`${
            watch('userType') !== 'nid'
              ? 'hidden'
              : 'flex flex-col gap-1 w-full mx-auto px-2'
          }`}
        >
          {userInformationIsError && (
            <p className="text-red-600 text-[13px] text-center max-w-[80%] mx-auto">
              A person with the provided document number is not found. Double
              check the document number and try again.
            </p>
          )}
        </menu>
        <menu
          className={`${
            registrationStep !== 'rwandanRegistrationForm' &&
            userInformation &&
            'mt-[-24px] h-0'
          } w-full`}
        >
          <RwandanRegistrationForm
            isOpen={registrationStep === 'rwandanRegistrationForm'}
          />
        </menu>
        <menu
          className={`${
            registrationStep === 'rwandanRegistrationForm' && 'hidden'
          } flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button value="Back" route="/auth/login" />
          <Button
            value="Continue"
            primary
            onClick={async (e) => {
              e.preventDefault();
              await trigger();
              if (
                userInformation &&
                watch('userType') === 'nid' &&
                Object.keys(errors).length <= 0
              ) {
                dispatch(setRegistrationStep('rwandanRegistrationForm'));
              } else if (watch('userType') === 'passport') {
                dispatch(setUserInformation(undefined));
                dispatch(setRegistrationStep('foreignRegistrationForm'));
              }
            }}
          />
        </menu>
      </section>
      <p className={`text-[13px] text-center max-w-[50%] mx-auto`}>
        All Rwandan citizens are required to complete their registration using
        the National Identification Card instead of Passport. Foreign account
        applications are subject to review and failure to comply may lead to
        penalties.
      </p>
    </section>
  );
};

export default SelectNationality;
