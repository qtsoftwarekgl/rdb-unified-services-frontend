import { FC, useEffect, useState } from 'react';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import { faEllipsis, faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';
import Loader from '../../components/Loader';
import { userData } from '../../constants/Authentication';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import {
  setNationalIdDetails,
  setRegistrationStep,
} from '../../states/features/authSlice';

interface SelectNationalityProps {
  isOpen: boolean;
}

const SelectNationality: FC<SelectNationalityProps> = ({ isOpen }) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [documentType, setDocumentType] = useState<string>('nid');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documentNo, setDocumentNo] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [nationalIdError, setNationalIdError] = useState<boolean>(false);
  const { nationalIdDetails } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isOpen) {
      dispatch(setNationalIdDetails(null));
    }
  }, [dispatch, isOpen]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-8 items-center w-full">
      <form
        className={`flex flex-col items-center gap-6 w-[60%] mx-auto p-6 shadow-md rounded-md`}
      >
        <menu className="w-full flex items-start gap-6">
          <Select
            label="Document Type"
            required
            options={[
              { value: 'nid', label: 'National ID' },
              { label: 'Passport', value: 'passport' },
            ]}
            onChange={(e) => {
              setDocumentType(e?.value);
            }}
            defaultValue={{ value: 'nid', label: 'National ID' }}
            labelClassName={`${
              documentType === 'passport' && '!w-1/2 mx-auto'
            }`}
          />
          {documentType === 'nid' && (
            <label className="flex flex-col gap-2 items-start w-full">
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
                      const randomNumber = Math.floor(Math.random() * 16);
                      const userDetails = userData[randomNumber];
                      if (!userDetails) {
                        setNationalIdError(true);
                        dispatch(setNationalIdDetails(null));
                      }
                      if (userDetails) {
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
                  if (e.target.value.length > 16) {
                    setIsError(true);
                  } else if (e.target.value.length < 16) {
                    setIsError(true);
                  } else if (e.target.value.length === 16) {
                    setIsError(false);
                  }
                }}
              />
              {isLoading && !isError && (
                <span className="flex items-center gap-[2px] text-[13px]">
                  <Loader size={4} /> Validating document
                </span>
              )}
              {isError && !isLoading && (
                <span className="text-red-600 text-[13px]">
                  Invalid document number
                </span>
              )}
            </label>
          )}
        </menu>
        <menu
          className={`${
            documentType !== 'nid'
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
          {nationalIdDetails && (
            <ul className="flex flex-col gap-2 w-full">
              <p className="">
                Names: {nationalIdDetails.first_name}{' '}
                {nationalIdDetails.last_name}
              </p>
              <p>Date of Birth: {nationalIdDetails.date_of_birth}</p>
              <p>Gender: {nationalIdDetails.gender}</p>
              <p>Phone: (+250) {nationalIdDetails.phone}</p>
              <p>Province: {nationalIdDetails.district}</p>
              <p>District: {nationalIdDetails.district}</p>
              <p>Sector: {nationalIdDetails.cell}</p>
              <p>Cell: {nationalIdDetails.cell}</p>
              <p>Village: {nationalIdDetails.village}</p>
            </ul>
          )}
        </menu>
        <menu className="flex items-center gap-6 w-full mx-auto justify-between">
          <Button value="Back" route="/auth/login" />
          <Button
            value="Continue"
            primary
            onClick={(e) => {
              e.preventDefault();
              if (
                nationalIdDetails &&
                documentType === 'nid' &&
                !nationalIdError
              ) {
                dispatch(setNationalIdDetails(nationalIdDetails));
                dispatch(setRegistrationStep('rwandan-registration-form'));
              } else if (documentType === 'passport') {
                dispatch(setNationalIdDetails(null));
                dispatch(setRegistrationStep('foreign-registration-form'));
              }
            }}
          />
        </menu>
      </form>
    </section>
  );
};

export default SelectNationality;
