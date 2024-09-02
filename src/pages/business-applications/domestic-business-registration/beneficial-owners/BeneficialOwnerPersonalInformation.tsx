import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import Loader from '@/components/Loader';
import { countriesList } from '@/constants/countries';
import { genderOptions } from '@/constants/inputs.constants';
import { capitalizeString, maskPhoneDigits } from '@/helpers/strings';
import validateInputs from '@/helpers/validations';
import { getUserInformationThunk } from '@/states/features/businessPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const BeneficialOwnerPersonalInformation = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedFounderDetailWithShares } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const { selectedBeneficialOwner } = useSelector(
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
  } = useForm();

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
    setValue(
      'firstName',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.firstName
    );
    setValue(
      'lastName',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.lastName
    );
    setValue(
      'personIdentType',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.personIdentType?.toUpperCase()
    );
    setValue(
      'personDocNo',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.personDocNo
    );
    setValue(
      'phoneNumber',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.phoneNumber
    );
    setValue(
      'email',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.email
    );
    setValue(
      'nationality',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.nationality
    );
    setValue(
      'persDocIssuePlace',
      selectedFounderDetailWithShares?.founderDetail?.personDetail
        ?.persDocIssuePlace
    );
    setValue(
      'dateOfBirth',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.dateOfBirth
    );
    setValue(
      'gender',
      selectedFounderDetailWithShares?.founderDetail?.personDetail?.gender
    );
    setValue(
      'extentOfShare',
      selectedFounderDetailWithShares?.shareQuantityPercentage
    );
  }, [selectedFounderDetailWithShares, setValue]);

  return (
    <section className="w-full flex flex-col gap-4">
      <fieldset className="grid grid-cols-2 gap-5 justify-between">
        <Controller
          name="personIdentType"
          control={control}
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
                        selectedBeneficialOwner?.controlType === 'DIRECT' &&
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
          rules={{ required: 'ID Document number is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Identification Number"
                  required
                  readOnly={
                    selectedFounderDetailWithShares &&
                    selectedBeneficialOwner?.controlType === 'DIRECT'
                      ? true
                      : false
                  }
                  suffixIcon={
                    watch('personIdentType') === 'NID' &&
                    !(
                      selectedFounderDetailWithShares &&
                      selectedBeneficialOwner?.controlType === 'DIRECT'
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
                      selectedBeneficialOwner?.controlType === 'DIRECT')
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
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Last Name"
                  required
                  readOnly={
                    userInformation ||
                    (selectedFounderDetailWithShares &&
                      selectedBeneficialOwner?.controlType === 'DIRECT')
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
          rules={{ required: 'Date of birth is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  label="Date of Birth"
                  required
                  readOnly={userInformation ? true : false}
                  toDate={moment().subtract(18, 'years').toDate()}
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
                          selectedBeneficialOwner?.controlType === 'DIRECT')
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
                          selectedBeneficialOwner?.controlType === 'DIRECT')
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
                          selectedBeneficialOwner?.controlType === 'DIRECT')
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
                      selectedBeneficialOwner?.controlType === 'DIRECT'
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
    </section>
  );
};

export default BeneficialOwnerPersonalInformation;
