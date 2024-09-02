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
import { FieldValues, useForm } from 'react-hook-form';
import Button from '@/components/inputs/Button';
import { formatDate } from '@/helpers/strings';
import Loader from '@/components/Loader';
import { useCreateBeneficialOwnerMutation } from '@/states/api/businessRegApiSlice';
import {
  addToBeneficialOwnersList,
  fetchBeneficialOwnersThunk,
} from '@/states/features/beneficialOwnerSlice';
import { toast } from 'react-toastify';
import { ErrorResponse } from 'react-router-dom';
import BeneficialOwnersTable from './BeneficialOwnersTable';
import {
  completeNavigationFlowThunk,
  createNavigationFlowThunk,
} from '@/states/features/navigationFlowSlice';
import {
  findNavigationFlowByStepName,
  findNavigationFlowMassIdByStepName,
} from '@/helpers/business.helpers';
import BeneficialOwnerResidentialAddress from './BeneficialOwnerResidentialAddress';
import BeneficialOwnerProfessionalAddress from './BeneficialOwnerProfessionalAddress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import BeneficialOwnershipInformation from './BeneficialOwnershipInformation';
import BeneficialOwnerTinOwnership from './BeneficialOwnerTinOwnership';
import BeneficialOwnerPersonalInformation from './BeneficialOwnerPersonalInformation';

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
    beneficialOwnersList,
    beneficialOwnersIsFetching,
    beneficialOwnersIsSuccess,
  } = useSelector((state: RootState) => state.beneficialOwner);
  const [scrollSlides, setScrollSlides] = useState(0);
  const [addNewBeneficialOwner, setAddNewBeneficialOwner] = useState(false);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // REACT HOOK FORM
  const {
    formState: { errors },
    handleSubmit,
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
    if (data?.founderId) {
      createBeneficialOwner({
        ...data,
        businessId,
        dateOfBirth: formatDate(data?.dateOfBirth),
        registeredDate: formatDate(data?.registeredDate),
        extentOfShare: selectedFounderDetailWithShares?.shareQuantityPercentage,
      });
    }
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
          <>
            <BeneficialOwnersTable beneficialOwners={beneficialOwnersList} />
          </>
        )
      )}
      {((selectedFounderDetailWithShares && !founderWithSharesDetailsModal) ||
        addNewBeneficialOwner) && (
        <form
          className="w-full flex flex-col gap-4 p-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex flex-col gap-4 items-start w-full">
            {/* TIN NUMBER DETAILS */}
            <menu
              className={`${
                scrollSlides === 0 ? 'w-full' : 'w-0 h-0 invisible'
              } flex flex-col gap-8 justify-between`}
            >
              <BeneficialOwnerTinOwnership />
            </menu>
            {/* PERSONAL IDENTIFICATION */}
            <menu
              className={`${
                scrollSlides === 1 ? 'w-full' : 'w-0 h-0 invisible'
              } w-full flex flex-col gap-3 justify-between`}
            >
              <BeneficialOwnerPersonalInformation />
            </menu>
            {/* PROFESSIONAL INFORMATION */}
            <menu
              className={`${
                scrollSlides === 2 ? 'w-full' : 'w-0 h-0 invisible'
              } flex flex-col gap-4 justify-between`}
            >
              <BeneficialOwnerResidentialAddress />
              <BeneficialOwnerProfessionalAddress />
            </menu>
            {/* BENEFICIAL OWNER INFORMATION */}
            <menu
              className={`${
                scrollSlides === 3 ? 'w-full' : 'w-0 h-0 invisible'
              } flex flex-col gap-4`}
            >
              <BeneficialOwnershipInformation />
            </menu>
          </fieldset>
          {Object.keys(errors)?.length > 0 && (
            <article className="w-full flex flex-col gap-3 my-4">
              <h3 className="text-red-600 text-[15px]">
                The form cannot be submitted because there are required fields
                that are not filled. Check the messages below and try again
              </h3>
              <ol className="flex flex-col items-start gap-3 flex-wrap">
                {Object.entries(errors).map(([key, value]) => {
                  return (
                    <li key={key} className="flex items-center gap-2">
                      <FontAwesomeIcon
                        className="text-red-600 text-[7px] bg-red-600 rounded-full"
                        icon={faCircle}
                      />
                      <p className="text-red-600 text-[14px]">
                        {String(value?.message)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </article>
          )}
          <menu className="w-full flex items-center gap-3 justify-between">
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
      {!addNewBeneficialOwner && !selectedFounderDetailWithShares && (
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            value={'Back'}
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                createNavigationFlowThunk({
                  businessId,
                  massId: findNavigationFlowMassIdByStepName(
                    navigationFlowMassList,
                    'Employment Info'
                  ),
                  isActive: true,
                })
              );
            }}
          />
          <Button
            value={'Save & Continue'}
            primary
            disabled={beneficialOwnersList?.length <= 0}
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                completeNavigationFlowThunk({
                  isCompleted: true,
                  navigationFlowId: findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Beneficial Owners'
                  )?.id,
                })
              );
              dispatch(
                createNavigationFlowThunk({
                  businessId,
                  massId: findNavigationFlowMassIdByStepName(
                    navigationFlowMassList,
                    'Attachments'
                  ),
                  isActive: true,
                })
              );
            }}
          />
        </menu>
      )}
    </section>
  );
};

export default BeneficialOwners;
