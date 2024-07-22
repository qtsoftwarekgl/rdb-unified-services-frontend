import { useDispatch } from 'react-redux';
import {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
} from '../../../states/features/enterpriseRegistrationSlice';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { Address, BusinessActivity, businessId } from '@/types/models/business';
import PreviewCard from '@/components/business-registration/PreviewCard';
import Loader from '@/components/Loader';
import { capitalizeString } from '@/helpers/strings';
import {
  useLazyFetchBusinessActivitiesQuery,
  useLazyFetchBusinessAddressQuery,
  useLazyFetchBusinessDetailsQuery,
  useUpdateBusinessMutation,
} from '@/states/api/businessRegApiSlice';
import { useEffect } from 'react';
import Button from '@/components/inputs/Button';
import { toast } from 'react-toastify';
import { findNavigationFlowMassIdByStepName } from '@/helpers/business.helpers';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';

type EnterprisePreviewSubmissionProps = {
  businessId: businessId;
  applicationStatus?: string;
};

const EnterprisePreviewSubmission = ({
  businessId,
  applicationStatus,
}: EnterprisePreviewSubmissionProps) => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE UPDATE BUSINESS MUTATION
  const [
    updateBusiness,
    {
      data: updateBusinessData,
      error: updateBusinessError,
      isLoading: updateBusinessIsLoading,
      isSuccess: updateBusinessIsSuccess,
      isError: updateBusinessIsError,
    },
  ] = useUpdateBusinessMutation();

  // INITIALIZE FETCHING COMPANY DETAILS QUERY
  const [
    fetchBusinessDetails,
    {
      data: businessDetailsData,
      error: businessDetailsError,
      isError: businessDetailsIsError,
      isLoading: businessDetailsIsLoading,
      isSuccess: businessDetailsIsSuccess,
    },
  ] = useLazyFetchBusinessDetailsQuery();

  // INITIALIZE FETCHING BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      error: businessActivitiesError,
      isError: businessActivitiesIsError,
      isLoading: businessActivitiesIsLoading,
      isSuccess: businessActivitiesIsSuccess,
    },
  ] = useLazyFetchBusinessActivitiesQuery();

  // INITIALIZE FETCHING BUSINESS ADDRESS QUERY
  const [
    fetchBusinessAddress,
    {
      data: businessAddressData,
      error: businessAddressError,
      isError: businessAddressIsError,
      isLoading: businessAddressIsLoading,
      isSuccess: businessAddressIsSuccess,
    },
  ] = useLazyFetchBusinessAddressQuery();

  // FETCH BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails({ businessId });
    }
  }, [businessId, fetchBusinessDetails]);

  // FETCH BUSINESS ADDRESS
  useEffect(() => {
    if (businessId) {
      fetchBusinessActivities({ businessId });
    }
  }, [businessId, fetchBusinessActivities]);
  // FETCH BUSINESS ADDRESS
  useEffect(() => {
    if (businessId) {
      fetchBusinessAddress({ businessId });
    }
  }, [businessId, fetchBusinessAddress]);

  // HANDLE UPDATE BUSINESS RESPONSE
  useEffect(() => {
    if (updateBusinessIsError) {
      if ((updateBusinessError as ErrorResponse).status === 500) {
        toast.error('An error occurred while updating business');
      } else {
        toast.error(
          (updateBusinessError as ErrorResponse).data?.message ??
            'An error occurred while updating business'
        );
      }
    } else if (updateBusinessIsSuccess) {
      toast.success('Business updated successfully');
      dispatch(setEnterpriseActiveStep('company_details'));
      dispatch(setEnterpriseActiveTab('general_information'));
      navigate('/success', {
        state: { redirectUrl: '/services' },
      });
    }
  }, [
    dispatch,
    navigate,
    updateBusinessData,
    updateBusinessError,
    updateBusinessIsError,
    updateBusinessIsSuccess,
  ]);

  return (
    <section className="flex flex-col gap-6">
      {/* ENTERPRISE DETAILS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Enterprise Details"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Enterprise Details'
        )}
      >
        {businessDetailsIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader className="text-primary" />
          </figure>
        ) : (
          businessDetailsIsSuccess && (
            <menu className="flex flex-col gap-2">
              {Object?.entries(businessDetailsData?.data ?? {})?.map(
                ([key, value], index: number) => {
                  if (key === 'id' || value === null) return null;
                  return (
                    <li key={index}>
                      <p className="flex text-[14px] items-center gap-2">
                        {capitalizeString(key)}:{' '}
                        {capitalizeString(String(value))}
                      </p>
                    </li>
                  );
                }
              )}
            </menu>
          )
        )}
      </PreviewCard>
      {/* COMPANY ADDRESS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Enterprise Address"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Enterprise Address'
        )}
      >
        {businessAddressIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessAddressIsSuccess && (
            <menu className="flex flex-col gap-2">
              {Object?.entries(businessAddressData?.data ?? {})?.map(
                ([key, value], index: number) => {
                  if (key === 'id' || value === null) return null;
                  if (key === 'location')
                    return (
                      <ul key={index} className="flex flex-col gap-2">
                        {Object?.entries(value as Address)?.map(
                          ([key, value], index: number) => {
                            if (key === 'id' || value === null) return null;
                            return (
                              <li key={index}>
                                <p className="flex text-[14px] items-center gap-2">
                                  {capitalizeString(key)}:{' '}
                                  {capitalizeString(String(value))}
                                </p>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    );
                  return (
                    <li key={index}>
                      <p className="flex text-[14px] items-center gap-2">
                        {capitalizeString(key)}:{' '}
                        {capitalizeString(String(value))}
                      </p>
                    </li>
                  );
                }
              )}
            </menu>
          )
        )}
      </PreviewCard>

      {/* BUSINESS ACTIVITIES & VAT */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Business Activities & VAT"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Business Activity & VAT'
        )}
      >
        {businessActivitiesIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessActivitiesIsSuccess && (
            <menu className="flex flex-col gap-2">
              <p className="flex text-[14px] items-center gap-2">
                Main business activity:{' '}
                {capitalizeString(
                  businessActivitiesData?.data?.mainBusinessActivity
                )}
              </p>
              <ul className="flex flex-col gap-2">
                {businessActivitiesData?.data?.businessLine?.map(
                  (activity: BusinessActivity, index: number) => {
                    return (
                      <li key={index}>
                        <p className="flex text-[14px] items-center gap-2">
                          {activity?.code} -{' '}
                          {capitalizeString(activity?.description)}
                        </p>
                      </li>
                    );
                  }
                )}
              </ul>
            </menu>
          )
        )}
      </PreviewCard>

      {['IN_PROGRESS', 'ACTION_REQUIRED', 'IN_PREVIEW', 'IS_AMENDING'].includes(
        String(applicationStatus)
      ) && (
        <menu
          className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
        >
          <Button
            value="Back"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setEnterpriseActiveStep('attachments'));
              dispatch(setEnterpriseActiveTab('attachments'));
            }}
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (
                !Object?.values(navigationFlowMassList ?? {})
                  ?.flat()
                  ?.every((navigationStep) => {
                    return businessNavigationFlowsList?.find(
                      (businessStep) =>
                        businessStep?.navigationFlowMass?.stepName ===
                          navigationStep?.stepName && businessStep?.completed
                    );
                  })
              ) {
                toast.error('All steps must be completed before submission');
                return;
              }
              updateBusiness({ businessId, applicationStatus: 'SUBMITTED' });
            }}
            value={updateBusinessIsLoading ? <Loader /> : 'Submit'}
            primary
          />
        </menu>
      )}
    </section>
  );
};

export default EnterprisePreviewSubmission;
