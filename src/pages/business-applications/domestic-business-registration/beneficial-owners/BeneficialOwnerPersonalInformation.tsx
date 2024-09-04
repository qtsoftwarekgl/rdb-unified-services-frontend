import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import Loader from '@/components/Loader';
import { countriesList } from '@/constants/countries';
import { genderOptions } from '@/constants/inputs.constants';
import {
  capitalizeString,
  formatDate,
  maskPhoneDigits,
} from '@/helpers/strings';
import validateInputs from '@/helpers/validations';
import { useUpdateBeneficialOwnerPersonalInfoMutation } from '@/states/api/businessRegApiSlice';
import {
  setActiveBeneficialOwnerNavigationStep,
  setCompleteBeneficialOwnerNavigationStep,
  setNewBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { getUserInformationThunk } from '@/states/features/businessPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { queryParam } from '@/types/models/business';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

interface BeneficialOwnerPersonalInformationProps {
  beneficialOwnerId: queryParam;
}

const BeneficialOwnerPersonalInformation = ({
  beneficialOwnerId,
}: BeneficialOwnerPersonalInformationProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedFounderDetailWithShares } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const { newBeneficialOwner } = useSelector(
    (state: RootState) => state.beneficialOwner
  );
  const {
    userInformationIsFetching,
    userInformationIsSuccess,
    userInformation,
  } = useSelector((state: RootState) => state.businessPeople);

  // REACT HOOK FORM
  const {
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // INITIALIZE UPDATE PERSONAL INFORMATION MUTATION
  const [
    updateBeneficialOwnerPersonalInformation,
    {
      isLoading: updateBeneficialOwnerPersonalInformationIsLoading,
      isSuccess: updateBeneficialOwnerPersonalInformationIsSuccess,
      isError: updateBeneficialOwnerPersonalInformationIsError,
      error: updateBeneficialOwnerPersonalInformationError,
      reset: updateBeneficialOwnerPersonalInformationReset,
      data: updateBeneficialOwnerPersonalInformationData,
    },
  ] = useUpdateBeneficialOwnerPersonalInfoMutation();

  const { personIdentType } = watch();

  // SET USER INFORMATION VALUES
  useEffect(() => {
    if (userInformationIsSuccess && userInformation) {
      setValue('firstName', userInformation?.foreName);
      setValue('lastName', userInformation?.surnames);
      setValue(
        'dateOfBirth',
        moment(userInformation?.dateOfBirth, 'DD/MM/YYYY').toDate()
      );
      setValue('gender', userInformation?.gender);
      setValue('nationality', userInformation?.nationality);
      setValue('persDocIssuePlace', userInformation?.nationality);
    }
  }, [userInformationIsSuccess, userInformation, setValue]);

  // SET FOUNDER DETAILS VALUES
  useEffect(() => {
    setValue('founderId', selectedFounderDetailWithShares?.founderDetail?.id);
    setValue('firstName', newBeneficialOwner?.personDetail?.firstName);
    setValue('lastName', newBeneficialOwner?.personDetail?.lastName);
    setValue(
      'personIdentType',
      newBeneficialOwner?.personDetail?.personIdentType?.toUpperCase()
    );
    setValue('personDocNo', newBeneficialOwner?.personDetail?.personDocNo);
    setValue('phoneNumber', newBeneficialOwner?.personDetail?.phoneNumber);
    setValue('email', newBeneficialOwner?.personDetail?.email);
    setValue('nationality', newBeneficialOwner?.personDetail?.nationality);
    setValue(
      'persDocIssuePlace',
      selectedFounderDetailWithShares?.founderDetail?.personDetail
        ?.persDocIssuePlace
    );
    setValue('dateOfBirth', newBeneficialOwner?.personDetail?.dateOfBirth);
    setValue('gender', newBeneficialOwner?.personDetail?.gender);
    setValue(
      'extentOfShare',
      selectedFounderDetailWithShares?.shareQuantityPercentage
    );
  }, [
    newBeneficialOwner,
    selectedFounderDetailWithShares,
    setValue,
    watch,
  ]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateBeneficialOwnerPersonalInformation({
      id: beneficialOwnerId,
      firstName: data?.firstName,
      middleName: data?.middleName,
      lastName: data?.lastName,
      dateOfBirth: formatDate(data?.dateOfBirth),
      gender: data?.gender,
      personIdentType: data?.personIdentType?.toUpperCase(),
      personDocNo: data?.personDocNo,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      nationality: data?.nationality,
      persDocIssuePlace: data?.persDocIssuePlace,
    });
  };

  // HANDLE UPDATE PERSONAL INFORMATION RESPONSE
  useEffect(() => {
    if (updateBeneficialOwnerPersonalInformationIsSuccess) {
      dispatch(
        setNewBeneficialOwner(
          updateBeneficialOwnerPersonalInformationData?.data
        )
      );
      updateBeneficialOwnerPersonalInformationReset();
      dispatch(
        setCompleteBeneficialOwnerNavigationStep('personal_information')
      );
      dispatch(setActiveBeneficialOwnerNavigationStep('residential_address'));
    } else if (updateBeneficialOwnerPersonalInformationIsError) {
      const errorResponse =
        (updateBeneficialOwnerPersonalInformationError as ErrorResponse)?.data
          ?.message ||
        'An error occurred while updating beneficial owner personal information';
      toast.error(errorResponse);
    }
  }, [
    dispatch,
    updateBeneficialOwnerPersonalInformationData?.data,
    updateBeneficialOwnerPersonalInformationError,
    updateBeneficialOwnerPersonalInformationIsError,
    updateBeneficialOwnerPersonalInformationIsSuccess,
    updateBeneficialOwnerPersonalInformationReset,
  ]);

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className="grid grid-cols-2 gap-5 justify-between">
        <Controller
          name="personIdentType"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.personIdentType}
          rules={{ required: 'Identification document type is required' }}
          render={({ field }) => {
            const options = [
              { value: 'NID', label: 'National ID' },
              { value: 'PASSPORT', label: 'Passport' },
            ];
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  label="Identification Type"
                  required
                  options={options?.map((option) => {
                    return {
                      label: option?.label,
                      value: option?.value,
                      disabled:
                        selectedFounderDetailWithShares &&
                        newBeneficialOwner?.controlType === 'DIRECT' &&
                        selectedFounderDetailWithShares?.founderDetail?.personDetail?.personIdentType?.toUpperCase() !==
                          option?.value
                          ? true
                          : false,
                    };
                  })}
                  {...field}
                />
                {errors?.personIdentType && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.personIdentType?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="personDocNo"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.personDocNo}
          rules={{ required: 'ID Document number is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Identification Number"
                  required
                  readOnly={
                    selectedFounderDetailWithShares &&
                    newBeneficialOwner?.controlType === 'DIRECT'
                      ? true
                      : false
                  }
                  suffixIcon={
                    personIdentType === 'NID' &&
                    !(
                      selectedFounderDetailWithShares &&
                      newBeneficialOwner?.controlType === 'DIRECT'
                    )
                      ? faSearch
                      : undefined
                  }
                  suffixIconPrimary
                  suffixIconHandler={(e) => {
                    e.preventDefault();
                    dispatch(
                      getUserInformationThunk({
                        documentNumber: field.value,
                      })
                    );
                  }}
                  type="text"
                  placeholder="Document Number"
                  {...field}
                />
                {userInformationIsFetching && (
                  <figure className="text-[12px] flex items-center gap-3">
                    Fetching user information...
                    <Loader className="text-primary" />
                  </figure>
                )}
                {errors?.personDocNo && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.personDocNo?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="firstName"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.firstName}
          rules={{ required: 'First name is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="First Name"
                  required
                  readOnly={
                    userInformation ||
                    (selectedFounderDetailWithShares &&
                      newBeneficialOwner?.controlType === 'DIRECT')
                      ? true
                      : false
                  }
                  type="text"
                  placeholder="First Name"
                  {...field}
                />
                {errors?.firstName && (
                  <span className="text-red-500 text-[12px]">
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
          defaultValue={newBeneficialOwner?.personDetail?.lastName}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Last Name"
                  required
                  readOnly={
                    userInformation ||
                    (selectedFounderDetailWithShares &&
                      newBeneficialOwner?.controlType === 'DIRECT')
                      ? true
                      : false
                  }
                  type="text"
                  placeholder="Last Name"
                  {...field}
                />
              </label>
            );
          }}
        />
        <Controller
          name="dateOfBirth"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.dateOfBirth}
          rules={{ required: 'Date of birth is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Date of Birth"
                  required
                  toDate={moment().toDate()}
                  readOnly={userInformation ? true : false}
                  type="date"
                  {...field}
                />
                {errors?.dateOfBirth && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.dateOfBirth?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="gender"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.gender}
          rules={{ required: 'Sex is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  label={'Sex'}
                  required
                  options={genderOptions?.map((gender) => {
                    return {
                      label: capitalizeString(gender?.label),
                      value: gender?.value,
                      disabled:
                        userInformation ||
                        (selectedFounderDetailWithShares &&
                          newBeneficialOwner?.controlType === 'DIRECT')
                          ? (
                              userInformation ||
                              selectedFounderDetailWithShares?.founderDetail
                                ?.personDetail
                            )?.gender !== gender?.value
                          : false,
                    };
                  })}
                  {...field}
                />
                {errors?.gender && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.gender?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="nationality"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.nationality}
          rules={{ required: 'Nationality is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  options={countriesList?.map((country) => {
                    return {
                      label: country?.name,
                      value: country?.code,
                      disabled:
                        userInformation ||
                        (selectedFounderDetailWithShares &&
                          newBeneficialOwner?.controlType === 'DIRECT')
                          ? (
                              userInformation ||
                              selectedFounderDetailWithShares?.founderDetail
                                ?.personDetail
                            )?.nationality !== country?.code
                          : false,
                    };
                  })}
                  label="Nationality"
                  required
                  {...field}
                  placeholder="Select country of origin"
                />
                {errors?.nationality && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.nationality?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="persDocIssuePlace"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.persDocIssuePlace}
          rules={{
            required: 'Country of document issue is required',
          }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Select
                  label="Country of Document Issue"
                  required
                  {...field}
                  options={countriesList?.map((country) => {
                    return {
                      label: country?.name,
                      value: country?.code,
                      disabled:
                        userInformation ||
                        (selectedFounderDetailWithShares &&
                          newBeneficialOwner?.controlType === 'DIRECT')
                          ? (
                              userInformation ||
                              selectedFounderDetailWithShares?.founderDetail
                                ?.personDetail
                            )?.nationality !== country?.code
                          : false,
                    };
                  })}
                  placeholder="Select country of document issue"
                />
                {errors?.persDocIssuePlace && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.persDocIssuePlace?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.email}
          rules={{
            validate: (value) => {
              if (!value) return true;
              return validateInputs(value, 'email') || 'Invalid email address';
            },
          }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input label="Email" placeholder="Email" {...field} />
                {errors?.email && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.email?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue={newBeneficialOwner?.personDetail?.phoneNumber}
          rules={{ required: 'Phone number is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                {userInformation ? (
                  <Select
                    label={'Phone Number'}
                    required
                    {...field}
                    options={userInformation?.phones?.map((userPhone) => {
                      return {
                        label: maskPhoneDigits(userPhone?.msidn),
                        value: userPhone?.msidn,
                      };
                    })}
                  />
                ) : (
                  <Input
                    label="Phone Number"
                    placeholder="Phone Number"
                    readOnly={
                      selectedFounderDetailWithShares &&
                      newBeneficialOwner?.controlType === 'DIRECT'
                        ? true
                        : false
                    }
                    type="tel"
                    {...field}
                  />
                )}
                {errors?.phoneNumber && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.phoneNumber?.message)}
                  </span>
                )}
              </label>
            );
          }}
        />
      </fieldset>
      <menu className="w-full flex items-center gap-3 justify-between">
        <Button
          value={'Cancel'}
          onClick={(e) => {
            e.preventDefault();
            dispatch(setActiveBeneficialOwnerNavigationStep('tin_ownership'));
          }}
        />
        <Button
          value={
            updateBeneficialOwnerPersonalInformationIsLoading ? (
              <Loader />
            ) : (
              'Next'
            )
          }
          primary
          submit
        />
      </menu>
    </form>
  );
};

export default BeneficialOwnerPersonalInformation;
