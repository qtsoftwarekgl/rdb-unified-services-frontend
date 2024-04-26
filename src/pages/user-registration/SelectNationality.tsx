import { FC, useEffect, useState } from 'react';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import { faEllipsis, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { userData } from '../../constants/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import {
  setNationalIdDetails,
  setRegistrationStep,
} from '../../states/features/authSlice';
import RwandanRegistrationForm from './RwandanRegistrationForm';
import { validNationalID } from '../../constants/Users';
import { Controller, useForm } from 'react-hook-form';

interface SelectNationalityProps {
  isOpen: boolean;
}

const SelectNationality: FC<SelectNationalityProps> = ({ isOpen }) => {
  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentNo, setDocumentNo] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [nationalIdError, setNationalIdError] = useState<boolean>(false);
  const { nationalIdDetails, registrationStep } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(setNationalIdDetails(null));
  }, [dispatch]);

  useEffect(() => {
    if (watch('document_type') === 'passport') {
      dispatch(setNationalIdDetails(null));
      dispatch(setNationalIdDetails(null));
      dispatch(setRegistrationStep('foreign-registration-form'));
    }
  }, [dispatch, watch('document_type')]);

  if (!isOpen) return null;

  return (
    <section className={`flex flex-col gap-8 items-center w-full`}>
      <form
        className={`flex flex-col items-center gap-6 w-[70%] mx-auto p-6 shadow-md rounded-md max-2xl:w-[75%] max-xl:w-[80%] max-[1000px]:w-[85%] max-[900px]:w-[90%] max-md:w-[95%] max-sm:w-[100%]`}
      >
        <menu className="flex items-start w-full gap-6 max-sm:flex-col">
          <Controller
            name="document_type"
            control={control}
            rules={{ required: 'Identification is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-2">
                  <Select
                    label="Identification"
                    placeholder="Select identification"
                    required
                    options={[
                      { value: 'nid', label: 'Rwandese' },
                      { value: 'local_resident', label: 'Local resident' },
                      { label: 'Foreigner', value: 'passport' },
                    ]}
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      await trigger('document_type');
                    }}
                    defaultValue={'nid'}
                    labelClassName={`${
                      (['passport'].includes(watch('document_type')) || !watch('document_type')) &&
                      '!w-1/2 mx-auto max-lg:!w-3/5 max-md:!w-2/3 max-sm:!w-full'
                    }`}
                  />
                  {errors?.document_type && (
                    <p className="text-red-600 text-[13px] mx-1">
                      {String(errors?.document_type?.message)}
                    </p>
                  )}
                </label>
              );
            }}
          />
          {['nid', 'local_resident'].includes(watch('document_type')) && (
            <label className="flex flex-col items-start w-full gap-2">
              <Input
                required
                label="ID Document No"
                suffixIconPrimary
                suffixIcon={isLoading ? faEllipsis : faSearch}
                suffixIconHandler={(e) => {
                  e.preventDefault();
                  if (documentNo.length !== 16) {
                    setIsError(true);
                    return;
                  } else {
                    setIsError(false);
                    setNationalIdError(false);
                    dispatch(setNationalIdDetails(null));
                    setIsLoading(true);
                    setTimeout(() => {
                      const randomNumber = Math.floor(Math.random() * 10);
                      const userDetails = userData[randomNumber];
                      if (documentNo !== validNationalID) {
                        setNationalIdError(true);
                        dispatch(setNationalIdDetails(null));
                      } else {
                        setNationalIdError(false);
                        dispatch(setNationalIdDetails(nationalIdDetails));
                        dispatch(setNationalIdDetails(userDetails));
                        dispatch(
                          setRegistrationStep('rwandan-registration-form')
                        );
                      }
                      setIsLoading(false);
                    }, 1500);
                  }
                }}
                placeholder="1 XXXX X XXXXXXX X XX"
                onChange={(e) => {
                  e.preventDefault();
                  setDocumentNo(e.target.value);
                  if (e.target.value.length !== 16) {
                    setIsError(true);
                  } else {
                    setIsError(false);
                  }
                  dispatch(setNationalIdDetails(null));
                }}
              />
              {isLoading && !isError && (
                <span className="flex items-center gap-[2px] text-[13px]">
                  <Loader size={4} /> Validating document
                </span>
              )}
              {isError && !isLoading && (
                <span className="text-red-600 text-[13px]">
                  ID Number must be 16 digits long
                </span>
              )}
            </label>
          )}
        </menu>
        <menu
          className={`${
            watch('document_type') !== 'nid'
              ? 'hidden'
              : 'flex flex-col gap-1 w-full mx-auto px-2'
          }`}
        >
          {nationalIdError && (
            <p className="text-red-600 text-[13px] text-center max-w-[80%] mx-auto">
              A person with the provided document number is not found. Double
              check the document number and try again.
            </p>
          )}
        </menu>
        <menu
          className={`${
            registrationStep !== 'rwandan-registration-form' &&
            nationalIdDetails &&
            'mt-[-24px] h-0'
          } w-full`}
        >
          <RwandanRegistrationForm
            isOpen={registrationStep === 'rwandan-registration-form'}
          />
        </menu>
        <menu
          className={`${
            registrationStep === 'rwandan-registration-form' && 'hidden'
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
                nationalIdDetails &&
                watch('document_type') === 'nid' &&
                !nationalIdError
              ) {
                dispatch(setNationalIdDetails(nationalIdDetails));
                dispatch(setRegistrationStep('rwandan-registration-form'));
              } else if (watch('document_type') === 'passport') {
                dispatch(setNationalIdDetails(null));
                dispatch(setRegistrationStep('foreign-registration-form'));
              }
            }}
          />
        </menu>
      </form>
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
