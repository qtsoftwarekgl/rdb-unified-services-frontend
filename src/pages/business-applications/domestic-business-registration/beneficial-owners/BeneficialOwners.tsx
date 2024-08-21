import {
  fetchFoundersWithSharePercentagesThunk,
  setFounderWithSharesDetailsModal,
  setSelectedFounderDetailWithShares,
} from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FounderDetailsWithShares from '../capital-information/FounderDetailsWithSharesTable';
import { FounderDetail } from '@/types/models/personDetail';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '@/components/inputs/Select';
import Input from '@/components/inputs/Input';
import Button from '@/components/inputs/Button';
import moment from 'moment';
import { genderOptions } from '@/constants/inputs.constants';
import { countriesList } from '@/constants/countries';
import validateInputs from '@/helpers/validations';
import {
  beneficialOwnerControlMeans,
  beneficialOwnerControlType,
  beneficialOwnerTypes,
} from '@/constants/business.constants';
import {
  capitalizeString,
  formatDate,
  maskPhoneDigits,
} from '@/helpers/strings';
import TextArea from '@/components/inputs/TextArea';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getUserInformationThunk } from '@/states/features/businessPeopleSlice';
import Loader from '@/components/Loader';
import { useCreateBeneficialOwnerMutation } from '@/states/api/businessRegApiSlice';
import {
  addToBeneficialOwnersList,
  fetchBeneficialOwnersThunk,
} from '@/states/features/beneficialOwnerSlice';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'react-router-dom';
import BeneficialOwnersTable from './BeneficialOwnersTable';

interface BeneficialOwnersProps {
  businessId: businessId;
  applicationStatus?: string;
}

const BeneficialOwners = ({ businessId }: BeneficialOwnersProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    founderDetailsList,
    selectedFounderDetailWithShares,
    founderWithSharesDetailsModal,
  } = useSelector((state: RootState) => state.founderDetail);
  const {
    userInformationIsFetching,
    userInformationIsSuccess,
    userInformation,
  } = useSelector((state: RootState) => state.businessPeople);
  const {
    beneficialOwnersList,
    beneficialOwnersIsFetching,
    beneficialOwnersIsSuccess,
  } = useSelector((state: RootState) => state.beneficialOwner);
  const [scrollSlides, setScrollSlides] = useState(0);
  const [addNewBeneficialOwner, setAddNewBeneficialOwner] = useState(false);

  // REACT HOOK FORM
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm();

  // FETCH FOUNDER DETAILS WITH SHARE PERCENTAGES
  useEffect(() => {
    dispatch(
      fetchFoundersWithSharePercentagesThunk({
        businessId: businessId,
      })
    );
  }, [dispatch, businessId]);

  // INITIALIZE CREATE BENEFICIAL OWNER MUTATION
  const [
    createBeneficialOwner,
    {
      data: createBeneficialOwnerData,
      error: createBeneficialOwnerError,
      isLoading: createBeneficialOwnerIsLoading,
      isSuccess: createBeneficialOwnerIsSuccess,
      isError: createBeneficialOwnerIsError,
    },
  ] = useCreateBeneficialOwnerMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createBeneficialOwner({
      ...data,
      businessId,
      dateOfBirth: formatDate(data?.dateOfBirth),
      registeredDate: formatDate(data?.registeredDate),
      extentOfShare: selectedFounderDetailWithShares?.shareQuantityPercentage
    });
  };

  // HANDLE CREATE BENEFICIAL OWNER RESPONSE
  useEffect(() => {
    if (createBeneficialOwnerIsSuccess && createBeneficialOwnerData) {
      toast.success('Beneficial owner created successfully');
      dispatch(addToBeneficialOwnersList(createBeneficialOwnerData?.data));
      setAddNewBeneficialOwner(false);
      dispatch(setSelectedFounderDetailWithShares(undefined));
    } else if (createBeneficialOwnerIsError && createBeneficialOwnerError) {
      const errorResponse = (createBeneficialOwnerError as ErrorResponse)?.data
        ?.message;
      toast.error(
        errorResponse ||
          'An error occurred while creating beneficial owner. Refresh and try again'
      );
    }
  }, [
    createBeneficialOwnerIsSuccess,
    createBeneficialOwnerData,
    dispatch,
    createBeneficialOwnerIsError,
    createBeneficialOwnerError,
  ]);

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
    if (selectedFounderDetailWithShares) {
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
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.personDocNo
      );
      setValue(
        'phoneNumber',
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.phoneNumber
      );
      setValue(
        'email',
        selectedFounderDetailWithShares?.founderDetail?.personDetail?.email
      );
      setValue(
        'nationality',
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.nationality
      );
      setValue(
        'persDocIssuePlace',
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.persDocIssuePlace
      );
      setValue(
        'dateOfBirth',
        selectedFounderDetailWithShares?.founderDetail?.personDetail
          ?.dateOfBirth
      );
      setValue(
        'gender',
        selectedFounderDetailWithShares?.founderDetail?.personDetail?.gender
      );
      setValue(
        'extentOfShare',
        selectedFounderDetailWithShares?.shareQuantityPercentage
      );
    }
  }, [selectedFounderDetailWithShares, setValue]);

  // FETCH EXISTING BENEFICIAL OWNERS
  useEffect(() => {
    dispatch(fetchBeneficialOwnersThunk({ businessId }));
  }, [businessId, dispatch]);

  return (
    <section className="w-full flex flex-col gap-4">
      {(selectedFounderDetailWithShares && !founderWithSharesDetailsModal) ||
      addNewBeneficialOwner ? null : (
        <FounderDetailsWithShares
          setAddNewBeneficialOwner={setAddNewBeneficialOwner}
          founderDetailsList={
            founderDetailsList as unknown as {
              founderDetail: FounderDetail;
              shareQuantityPercentage: number;
            }[]
          }
        />
      )}
      {beneficialOwnersIsFetching ? (
        <figure className="w-full flex items-center gap-3 justify-center min-h-[30vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        beneficialOwnersIsSuccess &&
        beneficialOwnersList?.length > 0 &&
        !addNewBeneficialOwner &&
        !selectedFounderDetailWithShares && (
          <BeneficialOwnersTable beneficialOwners={beneficialOwnersList} />
        )
      )}
      {((selectedFounderDetailWithShares && !founderWithSharesDetailsModal) ||
        addNewBeneficialOwner) && (
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex gap-4 items-start">
            {/* TIN NUMBER DETAILS */}
            <menu
              className={`${
                scrollSlides === 0 ? 'w-full' : 'w-0 invisible'
              } grid grid-cols-2 gap-4`}
            >
              <Controller
                name="hasTin"
                control={control}
                rules={{ required: 'Choose an option to continue' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <p className="mb-2">
                        Does the person have a Tax Identification Number?
                      </p>
                      <ul className="flex items-center gap-5">
                        <Input
                          type="radio"
                          label="Yes"
                          {...field}
                          value="yes"
                        />
                        <Input type="radio" {...field} label="No" value="no" />
                      </ul>
                      {errors?.hasTin && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.hasTin?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
              {watch('hasTin') === 'yes' && (
                <Controller
                  name="tinRwandan"
                  control={control}
                  rules={{ required: 'Choose at least one option to continue' }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <p className="mb-2">Is the TIN registered in Rwanda?</p>
                        <ul className="flex items-center gap-5">
                          <Input
                            type="radio"
                            label="Yes"
                            {...field}
                            value="yes"
                          />
                          <Input
                            type="radio"
                            label="No"
                            {...field}
                            value="no"
                          />
                        </ul>
                        {errors?.tinRwandan && (
                          <span className="text-red-500 text-[12px]">
                            {String(errors?.tinRwandan?.message)}
                          </span>
                        )}
                      </label>
                    );
                  }}
                />
              )}
              {watch('hasTin') === 'yes' && watch('tinRwandan') && (
                <Controller
                  name="tinNumber"
                  control={control}
                  rules={{ required: 'Enter TIN number to continue' }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          label="TIN Number"
                          required
                          suffixIcon={
                            watch('tinRwandan') === 'yes' ? faSearch : undefined
                          }
                          suffixIconPrimary
                          placeholder="Enter TIN number"
                          {...field}
                        />
                        {watch('tinRwandan') === 'yes' && (
                          <span className="text-[12px] text-gray-500">
                            Enter TIN number and click search to fetch details
                          </span>
                        )}
                        {errors?.tinNumber && (
                          <span className="text-red-500 text-[12px]">
                            {String(errors?.tinNumber?.message)}
                          </span>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            </menu>
            {/* PERSONAL IDENTIFICATION */}
            <menu
              className={`${
                scrollSlides === 1 ? 'w-full' : 'w-0 invisible'
              } grid grid-cols-2 gap-4`}
            >
              <Controller
                name="personIdentType"
                control={control}
                rules={{ required: 'Identification Type is required' }}
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
                rules={{ required: 'Document number is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Input
                        label="Identification Number"
                        required
                        readOnly={
                          selectedFounderDetailWithShares ? true : false
                        }
                        suffixIcon={
                          watch('personIdentType') === 'NID' &&
                          !selectedFounderDetailWithShares
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
                          userInformation || selectedFounderDetailWithShares
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
                          userInformation || selectedFounderDetailWithShares
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
                        defaultValue={moment()
                          .subtract(18, 'years')
                          .format('YYYY-MM-DD')}
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
                              userInformation || selectedFounderDetailWithShares
                                ? (
                                    userInformation ||
                                    selectedFounderDetailWithShares
                                      ?.founderDetail?.personDetail
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
                              userInformation || selectedFounderDetailWithShares
                                ? (
                                    userInformation ||
                                    selectedFounderDetailWithShares
                                      ?.founderDetail?.personDetail
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
                              userInformation || selectedFounderDetailWithShares
                                ? (
                                    userInformation ||
                                    selectedFounderDetailWithShares
                                      ?.founderDetail?.personDetail
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
                    return (
                      validateInputs(value, 'email') || 'Invalid email address'
                    );
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
                            selectedFounderDetailWithShares ? true : false
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
            </menu>
            {/* PROFESSIONAL INFORMATION */}
            <menu
              className={`${
                scrollSlides === 2 ? 'w-full' : 'w-0 invisible'
              } flex flex-col gap-2`}
            >
              <Controller
                name="noProAddress"
                control={control}
                rules={{ required: 'Select an option' }}
                defaultValue={'yes'}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1 my-4">
                      <Select
                        label="Is the professional address same as residential address?"
                        required
                        options={[
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' },
                        ]}
                        {...field}
                      />
                      {errors?.noProAddress && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.noProAddress?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
              {watch('noProAddress') === 'no' && (
                <menu className="grid grid-cols-2 gap-4 w-full">
                  <Controller
                    name="proCountry"
                    control={control}
                    rules={{ required: 'Professional country is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Select
                            label="Country"
                            required
                            options={countriesList?.map((country) => {
                              return {
                                label: country?.name,
                                value: country?.code,
                              };
                            })}
                            {...field}
                            placeholder="Select country"
                          />
                          {errors?.proCountry && (
                            <span className="text-red-500 text-[12px]">
                              {String(errors?.proCountry?.message)}
                            </span>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="proPhoneNumber"
                    control={control}
                    rules={{ required: 'Phone number is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            required
                            label="Phone Number"
                            placeholder="Phone Number"
                            type="tel"
                            {...field}
                          />
                          {errors?.proPhoneNumber && (
                            <span className="text-red-500 text-[12px]">
                              {String(errors?.proPhoneNumber?.message)}
                            </span>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="proEmail"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (!value) return true;
                        return (
                          validateInputs(value, 'email') ||
                          'Invalid email address'
                        );
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input label="Email" placeholder="Email" {...field} />
                          {errors?.proEmail && (
                            <span className="text-red-500 text-[12px]">
                              {String(errors?.proEmail?.message)}
                            </span>
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="proStreetNumber"
                    control={control}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            label="Street Number"
                            placeholder="Street Number"
                            {...field}
                          />
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="occupation"
                    control={control}
                    rules={{ required: 'Occupation is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            label="Occupation"
                            required
                            placeholder="Occupation"
                            {...field}
                          />
                          {errors?.occupation && (
                            <span className="text-red-500 text-[12px]">
                              {String(errors?.occupation?.message)}
                            </span>
                          )}
                        </label>
                      );
                    }}
                  />
                </menu>
              )}
            </menu>
            {/* BENEFICIAL OWNER INFORMATION */}
            <menu
              className={`${
                scrollSlides === 3 ? 'w-full' : 'w-0 invisible'
              } grid grid-cols-2 gap-4`}
            >
              <Controller
                name="registeredDate"
                control={control}
                rules={{ required: 'Date of registration is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Input
                        label="Date of becoming a beneficial owner"
                        required
                        type="date"
                        toDate={moment().toDate()}
                        {...field}
                      />
                      {errors?.registeredDate && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.registeredDate?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="beneficialOwnerType"
                control={control}
                defaultValue={'REGULAR_MANAGEMENT'}
                rules={{ required: 'Select beneficial owner type' }}
                render={({ field }) => {
                  return (
                    <Select
                      label="Beneficial Owner Type"
                      required
                      options={beneficialOwnerTypes?.map((ownerType) => {
                        return {
                          label: capitalizeString(ownerType),
                          value: ownerType,
                        };
                      })}
                      {...field}
                    />
                  );
                }}
              />
              <Controller
                name="controlType"
                control={control}
                rules={{ required: 'Control type is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Select
                        {...field}
                        label={'Control Type'}
                        required
                        options={beneficialOwnerControlType?.map(
                          (controlType) => {
                            return {
                              label: capitalizeString(controlType),
                              value: controlType,
                            };
                          }
                        )}
                      />
                      {errors?.controlType && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.controlType?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="significantInfluence"
                control={control}
                rules={{ required: 'Control means is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Select
                        {...field}
                        label={'Control Means'}
                        required
                        options={beneficialOwnerControlMeans?.map(
                          (controlMean) => {
                            return {
                              label: capitalizeString(controlMean),
                              value: controlMean,
                            };
                          }
                        )}
                      />
                      {errors?.significantInfluence && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.significantInfluence?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="extentOfShare"
                control={control}
                rules={{
                  required:
                    watch('controlType') === 'DIRECT'
                      ? 'Extent of shares'
                      : false,
                }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Input
                        label={`Extent of shares ${
                          watch('controlType') !== 'DIRECT' && '(optional)'
                        }`}
                        required={watch('controlType') === 'DIRECT'}
                        type="number"
                        placeholder="Extent of shares"
                        {...field}
                      />
                      {errors?.extentOfShare && (
                        <span className="text-red-500 text-[12px]">
                          {String(errors?.extentOfShare?.message)}
                        </span>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="extentOfVoting"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-1">
                      <Input
                        label="Extent of voting rights"
                        type="number"
                        placeholder="Extent of voting rights"
                        {...field}
                      />
                    </label>
                  );
                }}
              />
              {watch('beneficialOwnerType') === 'SENIOR_MANAGEMENT' && (
                <Controller
                  name="seniorManagementPosition"
                  rules={{
                    required: 'Senior management position is required',
                  }}
                  control={control}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          required
                          label="Senior Management Position"
                          placeholder="Senior Management Position"
                          {...field}
                        />
                        {errors?.seniorManagementPosition && (
                          <span className="text-red-500 text-[12px]">
                            {String(errors?.seniorManagementPosition?.message)}
                          </span>
                        )}
                      </label>
                    );
                  }}
                />
              )}
              {watch('significantInfluence') === 'OTHERS' && (
                <Controller
                  name="OtherControlMeansDesc"
                  control={control}
                  rules={{ required: 'Enter control means description' }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <TextArea
                          resize
                          required
                          label="Other Control Means Description"
                          placeholder="Enter control means description"
                          {...field}
                        />
                        {errors?.OtherControlMeansDesc && (
                          <span className="text-red-500 text-[12px]">
                            {String(errors?.OtherControlMeansDesc?.message)}
                          </span>
                        )}
                      </label>
                    );
                  }}
                />
              )}
            </menu>
          </fieldset>
          <menu className="flex items-center gap-3 justify-between">
            {scrollSlides > 0 ? (
              <Button
                value={'Back'}
                onClick={(e) => {
                  e.preventDefault();
                  scrollSlides >= 0 && setScrollSlides(scrollSlides - 1);
                }}
              />
            ) : (
              <Button
                value={'Cancel'}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setFounderWithSharesDetailsModal(false));
                  setAddNewBeneficialOwner(false);
                  dispatch(setSelectedFounderDetailWithShares(undefined));
                  reset();
                }}
              />
            )}
            {scrollSlides >= 3 ? (
              <Button
                value={createBeneficialOwnerIsLoading ? <Loader /> : 'Save'}
                primary
                submit
              />
            ) : (
              <Button
                value={'Next'}
                primary
                onClick={(e) => {
                  e.preventDefault();
                  scrollSlides <= 3 && setScrollSlides(scrollSlides + 1);
                }}
              />
            )}
          </menu>
        </form>
      )}
    </section>
  );
};

export default BeneficialOwners;
