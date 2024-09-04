import {
  fetchFoundersWithSharePercentagesThunk,
  setSelectedFounderDetailWithShares,
} from '@/states/features/founderDetailSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import FounderDetailsWithShares from '../capital-information/FounderDetailsWithSharesTable';
import { FounderDetail } from '@/types/models/personDetail';
import Button from '@/components/inputs/Button';
import { capitalizeString } from '@/helpers/strings';
import Loader from '@/components/Loader';
import {
  fetchBeneficialOwnersThunk,
  setActiveBeneficialOwnerNavigationStep,
  setNewBeneficialOwner,
  setSelectedBeneficialOwner,
} from '@/states/features/beneficialOwnerSlice';
import { ErrorResponse, Link, useLocation } from 'react-router-dom';
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
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import BeneficialOwnershipInformation from './BeneficialOwnershipInformation';
import BeneficialOwnerTinOwnership from './BeneficialOwnerTinOwnership';
import BeneficialOwnerPersonalInformation from './BeneficialOwnerPersonalInformation';
import { useLazyGetBeneficialOwnerQuery } from '@/states/api/businessRegApiSlice';
import queryString, { ParsedQuery } from 'query-string';
import { toast } from 'react-toastify';

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
    beneficialOwnerNavigationSteps,
  } = useSelector((state: RootState) => state.beneficialOwner);
  const [addNewBeneficialOwner, setAddNewBeneficialOwner] = useState(false);
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const [activeBeneficialOwnerStep, setActiveBeneficialOwnerStep] = useState(
    beneficialOwnerNavigationSteps?.find((step) => step.active)
  );
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INITIALIZE GET BENEFICIAL OWNER QUERY
  const [
    getBeneficialOwner,
    {
      data: beneficialOwnerData,
      error: beneficialOwnerError,
      isFetching: beneficialOwnerIsFetching,
      isSuccess: beneficialOwnerIsSuccess,
      isError: beneficialOwnerIsError,
    },
  ] = useLazyGetBeneficialOwnerQuery();

  // FETCH BENEFICIAL OWNER
  useEffect(() => {
    if (queryParams?.beneficialOwnerId) {
      getBeneficialOwner({
        id: queryParams?.beneficialOwnerId,
      });
    }
  }, [queryParams, dispatch, getBeneficialOwner]);

  // HANDLE BENEFICIAL OWNER FETCHING
  useEffect(() => {
    if (beneficialOwnerIsSuccess) {
      setAddNewBeneficialOwner(true);
      dispatch(setNewBeneficialOwner(beneficialOwnerData?.data));
    } else if (beneficialOwnerIsError) {
      const errorResponse =
        (beneficialOwnerError as ErrorResponse)?.data?.message ||
        'Failed to fetch beneficial owner';
      toast.error(errorResponse);
      setAddNewBeneficialOwner(false);
      dispatch(setSelectedBeneficialOwner(undefined));
      dispatch(setSelectedFounderDetailWithShares(undefined));
      dispatch(setNewBeneficialOwner(undefined));
    }
  }, [
    beneficialOwnerData,
    beneficialOwnerData?.data,
    beneficialOwnerError,
    beneficialOwnerIsError,
    beneficialOwnerIsSuccess,
    dispatch,
  ]);

  // CHANGE ACTIVE BENEFICIAL OWNER STEP
  useEffect(() => {
    setActiveBeneficialOwnerStep(
      beneficialOwnerNavigationSteps?.find((step) => step.active)
    );
  }, [beneficialOwnerNavigationSteps]);

  // FETCH FOUNDER DETAILS WITH SHARE PERCENTAGES
  useEffect(() => {
    dispatch(
      fetchFoundersWithSharePercentagesThunk({
        businessId: businessId,
      })
    );
  }, [dispatch, businessId]);

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
        <section className="w-full flex flex-col gap-4 p-0 relative">
          {beneficialOwnerIsFetching && (
            <figure className="absolute top-0 bottom-0 right-0 left-0 h-full w-full flex items-center justify-center bg-background bg-opacity-20">
              <Loader className="text-primary" />
            </figure>
          )}
          <nav className="w-full grid grid-cols-5 gap-2 my-3">
            {beneficialOwnerNavigationSteps?.map((step, index: number) => {
              return (
                <Link
                  to={'#'}
                  key={index}
                  className={`bg-background text-black hover:bg-primary hover:text-white ${
                    step?.active && `bg-primary text-white`
                  } text-center p-[6px] px-2 rounded-md text-[13px] flex items-center gap-3 justify-center`}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setActiveBeneficialOwnerNavigationStep(step.name));
                  }}
                >
                  {step?.completed && (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-[14px] bg-primary rounded-full text-background"
                    />
                  )}
                  {capitalizeString(step.name)}
                </Link>
              );
            })}
          </nav>
          <menu className="flex flex-col gap-1 items-start w-full">
            {/* TIN NUMBER DETAILS */}
            <menu
              className={`${
                activeBeneficialOwnerStep?.name === 'tin_ownership'
                  ? 'w-full'
                  : 'w-0 h-0 invisible'
              } flex flex-col gap-2 justify-between`}
            >
              <BeneficialOwnerTinOwnership
                setAddNewBeneficialOwner={setAddNewBeneficialOwner}
                beneficialOwnerId={queryParams?.beneficialOwnerId}
              />
            </menu>
            {/* PERSONAL IDENTIFICATION */}
            <menu
              className={`${
                activeBeneficialOwnerStep?.name === 'personal_information'
                  ? 'w-full'
                  : 'w-0 h-0 invisible'
              } w-full flex flex-col gap-3 justify-between`}
            >
              <BeneficialOwnerPersonalInformation
                beneficialOwnerId={queryParams?.beneficialOwnerId}
              />
            </menu>
            {/* PROFESSIONAL INFORMATION */}
            <menu
              className={`${
                activeBeneficialOwnerStep?.name === 'residential_address'
                  ? 'w-full'
                  : 'w-0 h-0 invisible'
              } flex flex-col gap-4 justify-between`}
            >
              <BeneficialOwnerResidentialAddress
                beneficialOwnerId={queryParams?.beneficialOwnerId}
              />
            </menu>
            <menu
              className={`${
                activeBeneficialOwnerStep?.name === 'professional_address'
                  ? 'w-full'
                  : 'w-0 h-0 invisible'
              } flex flex-col gap-4 justify-between`}
            >
              <BeneficialOwnerProfessionalAddress
                beneficialOwnerId={queryParams?.beneficialOwnerId}
              />
            </menu>
            {/* BENEFICIAL OWNER INFORMATION */}
            <menu
              className={`${
                activeBeneficialOwnerStep?.name === 'ownership_information'
                  ? 'w-full'
                  : 'w-0 h-0 invisible'
              } flex flex-col gap-4`}
            >
              <BeneficialOwnershipInformation
                beneficialOwnerId={queryParams?.beneficialOwnerId}
              />
            </menu>
          </menu>
        </section>
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
