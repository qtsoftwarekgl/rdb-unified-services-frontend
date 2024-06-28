import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '../../components/inputs/Select';
import Input from '../../components/inputs/Input';
import { useEffect, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { userData } from '../../constants/authentication';
import Loader from '../../components/Loader';
import { countriesList } from '../../constants/countries';
import moment from 'moment';
import Button from '../../components/inputs/Button';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNameReservationActiveStep,
  setNameReservationActiveTab,
  setNameReservationCompletedStep,
  setNameReservationOwnerDetails,
} from '../../states/features/nameReservationSlice';
import { validNationalID } from '../../constants/Users';
import validateInputs from '../../helpers/validations';
import { maskPhoneDigits } from '@/helpers/strings';

type Props = {
  isOpen: boolean;
};

const OwnerDetails = ({ isOpen }: Props) => {
  // REACT HOOK FORMS
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    reset,
  } = useForm();

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { owner_details } = useSelector(
    (state: RootState) => state.nameReservation
  );
  const [searchMember, setSearchMember] = useState({
    loading: false,
    error: false,
    data: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        setNameReservationOwnerDetails({
          ...data,
          gender: searchMember?.data?.gender || watch('gender'),
          step: 'owner_details',
        })
      );
      setSearchMember({
        ...searchMember,
        data: null,
      });
      dispatch(setNameReservationActiveTab('name_reservation'));
      dispatch(setNameReservationActiveStep('name_reservation'));
      dispatch(setNameReservationCompletedStep('owner_details'));
    }, 1000);
    return data;
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    if (owner_details) {
      setValue('document_type', owner_details?.document_type);
      setValue('documentNumber', owner_details?.documentNumber);
      setValue('first_name', owner_details?.first_name);
      setValue('middle_name', owner_details?.middle_name);
      setValue('last_name', owner_details?.last_name);
      setValue('gender', owner_details?.gender);
      setValue('country', owner_details?.country);
      setValue('date_of_birth', owner_details?.date_of_birth);
      setValue('phone', owner_details?.phone);
      setValue('name_owner', owner_details?.name_owner || 'owner');

      if (owner_details?.document_type === 'nid') {
        setValue('street_name', owner_details?.street_name);
        setSearchMember({
          ...searchMember,
          data: {
            ...owner_details,
            gender: owner_details?.gender,
          },
        });
      }
    }
  }, [owner_details, setValue]);

  if (!isOpen) return null;

  return (
    <section className="flex flex-col gap-6">
      <menu className="flex flex-col gap-4">
        <p>
          I am reserving for: <span className="text-red-600">*</span>
        </p>
        <Controller
          name="name_owner"
          control={control}
          render={({ field }) => {
            return (
              <ul className="flex flex-col w-fit items-start gap-6">
                <Input
                  type="radio"
                  label="Myself"
                  checked
                  {...field}
                  value={'owner'}
                />
              </ul>
            );
          }}
        />
      </menu>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${
          watch('name_owner') === 'other' ? 'flex' : 'hidden'
        } flex-col gap-5`}
      >
        <section className={`flex-col gap-4 w-full`}>
          <menu className="flex items-start w-full gap-5">
            <Controller
              name="document_type"
              rules={{ required: 'Select document type' }}
              defaultValue={owner_details?.document_type || 'nid'}
              control={control}
              render={({ field }) => {
                const options = [
                  { value: 'nid', label: 'National ID' },
                  { label: 'Passport', value: 'passport' },
                ];
                return (
                  <label className={`flex flex-col gap-1 w-[49%] items-start`}>
                    <Select
                      options={options}
                      label="Document Type"
                      defaultValue={owner_details?.document_type}
                      required
                      {...field}
                      placeholder="Select document type"
                      onChange={(e) => {
                        reset({
                          document_type: e,
                          documentNumber: '',
                          first_name: '',
                          middle_name: '',
                          last_name: '',
                          name_owner: watch('name_owner'),
                          phone: '',
                          gender: '',
                        });
                        field.onChange(e);
                        setSearchMember({
                          ...searchMember,
                          data: null,
                        });
                      }}
                    />
                  </label>
                );
              }}
            />
            {watch('document_type') === 'nid' && (
              <Controller
                control={control}
                defaultValue={owner_details?.documentNumber}
                name="documentNumber"
                rules={{
                  required:
                    watch('document_type') === 'nid'
                      ? 'Document number is required'
                      : false,
                  validate: (value) => {
                    return (
                      validateInputs(value, 'nid') ||
                      'Document number must be 16 characters'
                    );
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-2 items-start w-[49%]">
                      <Input
                        required
                        suffixIcon={faSearch}
                        defaultValue={owner_details?.documentNumber}
                        suffixIconHandler={async (e) => {
                          e.preventDefault();
                          setSearchMember({
                            ...searchMember,
                            data: null,
                            loading: true,
                            error: false,
                          });
                          setTimeout(() => {
                            const randomNumber = Math.floor(Math.random() * 10);
                            const userDetails = userData[randomNumber];

                            if (field?.value !== String(validNationalID)) {
                              setSearchMember({
                                ...searchMember,
                                data: null,
                                loading: false,
                                error: true,
                              });
                              setError('documentNumber', {
                                type: 'manual',
                                message: 'Document number not found',
                              });
                            } else {
                              clearErrors('documentNumber');
                              setSearchMember({
                                ...searchMember,
                                data: userDetails,
                                loading: false,
                                error: false,
                              });
                              setValue('first_name', userDetails?.first_name);
                              setValue('middle_name', userDetails?.middle_name);
                              setValue('last_name', userDetails?.last_name);
                              setValue('gender', userDetails?.data?.gender);
                            }
                          }, 700);
                        }}
                        label="ID Document No"
                        suffixIconPrimary
                        placeholder="1 XXXX X XXXXXXX X XX"
                        {...field}
                        onChange={async (e) => {
                          field.onChange(e);
                          setSearchMember({
                            ...searchMember,
                            data: null,
                          });
                          await trigger('documentNumber');
                        }}
                      />
                      {searchMember?.loading && (
                        <p className="text-[13px] flex items-center gap-1">
                          <Loader size={4} /> Searching...
                        </p>
                      )}
                      {errors?.documentNumber && (
                        <p className="text-red-500 text-[13px]">
                          {String(errors?.documentNumber?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
          </menu>
          <section
            className={`${
              (watch('document_type') === 'nid' && searchMember?.data) ||
              watch('document_type') === 'passport'
                ? 'flex'
                : 'hidden'
            } flex w-full gap-5 flex-wrap items-start mt-4`}
          >
            <Controller
              name="first_name"
              control={control}
              defaultValue={
                owner_details?.first_name || searchMember?.data?.first_name
              }
              rules={{
                required: 'First name is required',
              }}
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      required
                      readOnly={watch('document_type') === 'nid'}
                      defaultValue={
                        owner_details?.first_name ||
                        searchMember?.data?.first_name
                      }
                      placeholder="First name"
                      label="First name"
                      {...field}
                    />
                    {errors?.first_name && (
                      <span className="text-sm text-red-500">
                        {String(errors?.first_name?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="middle_name"
              control={control}
              defaultValue={
                owner_details?.middle_name || searchMember?.data?.middle_name
              }
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch('document_type') === 'nid'}
                      defaultValue={
                        owner_details?.middle_name ||
                        searchMember?.data?.middle_name
                      }
                      placeholder="Middle name"
                      label="Middle name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="last_name"
              control={control}
              defaultValue={
                owner_details?.last_name || searchMember?.data?.last_name
              }
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1 items-start">
                    <Input
                      readOnly={watch('document_type') === 'nid'}
                      defaultValue={
                        owner_details?.last_name || searchMember?.last_name
                      }
                      placeholder="Last name"
                      label="Last name"
                      {...field}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="gender"
              control={control}
              defaultValue={owner_details?.gender || searchMember?.data?.gender}
              rules={{
                required:
                  watch('document_type') === 'passport'
                    ? 'Select gender'
                    : false,
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-2 items-start w-[49%]">
                    <p className="flex items-center gap-1 text-[15px]">
                      Gender<span className="text-red-500">*</span>
                    </p>
                    {watch('document_type') === 'nid' ? (
                      <p className="px-2 py-1 rounded-md bg-background">
                        {searchMember?.data?.gender || watch('gender')}
                      </p>
                    ) : (
                      <menu className="flex items-center gap-4 mt-2">
                        <Input
                          type="radio"
                          defaultChecked={
                            searchMember?.data?.gender === 'Female' ||
                            watch('gender') === 'Male'
                          }
                          label="Male"
                          name={field?.name}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            if (e.target.checked) {
                              setValue('gender', 'Male');
                            }
                          }}
                        />
                        <Input
                          type="radio"
                          defaultChecked={
                            searchMember?.data?.gender === 'Female' ||
                            watch('gender') === 'Female'
                          }
                          label="Female"
                          name={field?.name}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            if (e.target.checked) {
                              setValue('gender', 'Female');
                            }
                          }}
                        />
                      </menu>
                    )}

                    {errors?.gender && (
                      <span className="text-red-500 text-[13px]">
                        {String(errors?.gender?.message)}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            {watch('document_type') === 'passport' && (
              <Controller
                name="country"
                control={control}
                rules={{
                  required:
                    watch('document_type') === 'passport'
                      ? 'Country is required'
                      : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1 items-start">
                      <Select
                        placeholder="Select country"
                        {...field}
                        required
                        label="Country"
                        options={countriesList
                          ?.filter((country) => country?.code != 'RW')
                          ?.map((country) => {
                            return {
                              ...country,
                              label: country.name,
                              value: country?.code,
                            };
                          })}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.country && (
                        <p className="text-sm text-red-500">
                          {String(errors?.country?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch('document_type') === 'passport' && (
              <Controller
                name="date_of_birth"
                control={control}
                defaultValue={owner_details?.date_of_birth}
                rules={{
                  required:
                    watch('document_type') === 'passport'
                      ? 'Select date of birth'
                      : false,
                  validate: (value) => {
                    if (moment(value).format() > moment(new Date()).format()) {
                      return 'Select a valid date of birth';
                    }
                    return true;
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col items-start w-[49%] gap-1">
                      <Input
                        required
                        defaultValue={owner_details?.date_of_birth}
                        type="date"
                        label="Date of birth"
                        {...field}
                      />
                      {errors?.date_of_birth && (
                        <p className="text-sm text-red-500">
                          {String(errors?.date_of_birth?.message)}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            )}
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Phone number is required',
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col w-[49%] gap-1">
                    {watch('document_type') === 'passport' ? (
                      <Input
                        label="Phone number"
                        required
                        defaultValue={owner_details?.phone}
                        type="tel"
                        {...field}
                      />
                    ) : (
                      <Select
                        label="Phone number"
                        required
                        options={userData?.slice(0, 3)?.map((user) => {
                          return {
                            ...user,
                            label: `(+250) ${maskPhoneDigits(user?.phone)}`,
                            value: user?.phone,
                          };
                        })}
                        placeholder="Select phone number"
                        {...field}
                      />
                    )}
                    {errors?.phone && (
                      <p className="text-sm text-red-500">
                        {String(errors?.phone?.message)}
                      </p>
                    )}
                  </label>
                );
              }}
            />
            {watch('document_type') === 'nid' && (
              <Controller
                control={control}
                name="street_name"
                render={({ field }) => {
                  return (
                    <label className="w-[49%] flex flex-col gap-1">
                      <Input
                        label="Street Name"
                        placeholder="Street name"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
            )}
            <Controller
              control={control}
              name="po_box"
              render={({ field }) => {
                return (
                  <label className="w-[49%] flex flex-col gap-1">
                    <Input
                      label="PO Box"
                      placeholder="Postal code"
                      {...field}
                    />
                  </label>
                );
              }}
            />
          </section>
        </section>
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              navigate('/services');
            }}
          />
          <Button value={isLoading ? <Loader /> : 'Submit'} primary submit />
        </menu>
      </form>
      <menu
        className={`${
          watch('name_owner') === 'other' ? 'hidden' : 'flex'
        } items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          onClick={(e) => {
            e.preventDefault();
            navigate('/services');
          }}
        />
        <Button
          primary
          value={isLoading ? <Loader /> : 'Submit'}
          disabled={searchMember?.loading || Object.keys(errors).length > 0}
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              dispatch(setNameReservationActiveTab('name_reservation'));
              dispatch(setNameReservationActiveStep('name_reservation'));
              dispatch(setNameReservationCompletedStep('owner_details'));
              dispatch(
                setNameReservationOwnerDetails({
                  name_owner: 'owner',
                  step: 'owner_details',
                })
              );
            }, 1000);
          }}
        />
      </menu>
    </section>
  );
};

export default OwnerDetails;
