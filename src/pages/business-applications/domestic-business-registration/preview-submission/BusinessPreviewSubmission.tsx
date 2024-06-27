import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import PreviewCard from '../../../../components/business-registration/PreviewCard';
import {
  removeBusinessRegistrationTabs,
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../../../states/features/businessRegistrationSlice';
import Button from '../../../../components/inputs/Button';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';
import ViewDocument from '../../../user-company-details/ViewDocument';
import { BusinessActivity, businessId } from '@/types/models/business';
import {
  useLazyFetchBusinessActivitiesQuery,
  useLazyFetchBusinessAddressQuery,
  useLazyFetchBusinessDetailsQuery,
  useLazyFetchBusinessEmploymentInfoQuery,
  useLazyFetchShareholdersQuery,
  useUpdateBusinessMutation,
} from '@/states/api/businessRegApiSlice';
import { capitalizeString } from '@/helpers/strings';
import BusinessPeople from '../management/BusinessPeople';
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table';
import { FounderDetail } from '@/types/models/personDetail';
import Table from '@/components/table/Table';
import { toast } from 'react-toastify';
import { setFounderDetailsList } from '@/states/features/founderDetailSlice';
import BusinessPeopleAttachments from '../BusinessPeopleAttachments';
import { useLazyFetchBusinessAttachmentsQuery } from '@/states/api/coreApiSlice';
import { setBusinessAttachments } from '@/states/features/businessPeopleSlice';

interface PreviewSubmissionProps {
  businessId: businessId;
  applicationStatus?: string;
}

const PreviewSubmission: FC<PreviewSubmissionProps> = ({
  applicationStatus,
  businessId,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { founderDetailsList } = useSelector(
    (state: RootState) => state.founderDetail
  );
  const [attachmentPreview, setAttachmentPreview] = useState<string>('');
  const { businessAttachments } = useSelector(
    (state: RootState) => state.businessPeople
  );

  // NAVIGATION
  const navigate = useNavigate();

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

  // INITIALIZE FETCH FOUNDER DETAILS QUERY
  const [
    fetchShareholders,
    {
      data: shareholdersData,
      isLoading: shareholdersIsLoading,
      error: shareholdersError,
      isError: shareholdersIsError,
      isSuccess: shareholdersIsSuccess,
    },
  ] = useLazyFetchShareholdersQuery();

  // FETCH SHAREHOLDERS
  useEffect(() => {
    if (businessId) {
      fetchShareholders({ businessId });
    }
  }, [businessId, fetchShareholders]);

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
      dispatch(setBusinessActiveStep('company_details'));
      dispatch(setBusinessActiveTab('general_information'));
      dispatch(removeBusinessRegistrationTabs());
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

  // INITIALIZE FETCHING BUSINESS EMPLOYMENT INFO
  const [
    fetchBusinessEmploymentInfo,
    {
      data: businessEmploymentInfoData,
      error: businessEmploymentInfoError,
      isError: businessEmploymentInfoIsError,
      isLoading: businessEmploymentInfoIsLoading,
      isSuccess: businessEmploymentInfoIsSuccess,
    },
  ] = useLazyFetchBusinessEmploymentInfoQuery();

  // FETCH BUSINESS ADDRESS
  useEffect(() => {
    if (businessId) {
      fetchBusinessEmploymentInfo({ businessId });
    }
  }, [businessId, fetchBusinessEmploymentInfo]);

  // FETCH BUSINESS ACTIVITIES
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

  // FETCH BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      fetchBusinessDetails({ businessId });
    }
  }, [businessId, fetchBusinessDetails]);

  // TABLE COLUMNS
  const founderDetailsColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'shareHolderType',
    },
    {
      header: 'Number of shares',
      accessorKey: 'shareQuantity',
    },
    {
      header: 'Total value',
      accessorKey: 'totalQuantity',
    },
  ];

  // HANDLE FETCH SHAREHOLDERS RESPONSE
  useEffect(() => {
    if (shareholdersIsError) {
      if ((shareholdersError as ErrorResponse).status === 500) {
        toast.error('An error occurred while fetching shareholders');
      } else {
        toast.error(
          (shareholdersError as ErrorResponse).data?.message ??
            'An error occurred while fetching shareholders'
        );
      }
    } else if (shareholdersIsSuccess) {
      dispatch(setFounderDetailsList(shareholdersData?.data));
    }
  }, [
    dispatch,
    shareholdersData,
    shareholdersError,
    shareholdersIsError,
    shareholdersIsSuccess,
  ]);

  // INITIALIZE FETCH BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isFetching: businessAttachmentsIsFetching,
      error: businessAttachmentsError,
      isSuccess: businessAttachmentsIsSuccess,
      isError: businessAttachmentsIsError,
    },
  ] = useLazyFetchBusinessAttachmentsQuery();

  // FETCH BUSINESS ATTACHMENTS
  useEffect(() => {
    if (businessId) {
      fetchBusinessAttachments({ businessId });
    }
  }, [businessId, fetchBusinessAttachments]);

  // HANDLE FETCH BUSINESS ATTACHMENTS RESPONSE
  useEffect(() => {
    if (businessAttachmentsIsError) {
      const errorMessage =
        (businessAttachmentsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching business attachments. Please try again later.';
      toast.error(errorMessage);
    } else if (businessAttachmentsIsSuccess) {
      dispatch(setBusinessAttachments(businessAttachmentsData?.data));
    }
  }, [
    businessAttachmentsData,
    businessAttachmentsError,
    businessAttachmentsIsError,
    businessAttachmentsIsSuccess,
    dispatch,
  ]);

  return (
    <section className="flex flex-col w-full h-full gap-6 overflow-y-scroll">
      {/* COMPANY DETAILS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Company Details"
        tabName="general_information"
        stepName="company_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        {businessDetailsIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessDetailsIsSuccess && (
            <menu className="flex flex-col gap-2">
              {businessDetailsData?.data ? (
                Object?.entries(businessDetailsData?.data)?.map(
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
                )
              ) : (
                <p>No data</p>
              )}
            </menu>
          )
        )}
      </PreviewCard>

      {/* COMPANY ADDRESS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Company Address"
        tabName="general_information"
        stepName="company_address"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        {businessAddressIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessAddressIsSuccess && (
            <menu className="flex flex-col gap-2">
              {businessAddressData?.data ? (
                Object?.entries(businessAddressData?.data)?.map(
                  ([key, value], index: number) => {
                    if (key === 'id' || value === null) return null;
                    if (key === 'location')
                      return (
                        <ul key={index} className="flex flex-col gap-2">
                          {Object?.entries(value)?.map(
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
                )
              ) : (
                <p>No data</p>
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
        tabName="general_information"
        stepName="business_activity_vat"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
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

      {/*  BOARD OF DIRECTORS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Board of Directors"
        tabName="management"
        stepName="board_of_directors"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <BusinessPeople type="board-member" businessId={businessId} />
      </PreviewCard>

      {/*  EXECUTIVE MANAGEMENT */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Executive Management"
        tabName="management"
        stepName="executive_management"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <BusinessPeople type="executiveManagement" businessId={businessId} />
      </PreviewCard>

      {/* EMPLOYMENT INFO */}
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Employment Information"
        tabName="management"
        stepName="employment_info"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        {businessEmploymentInfoIsLoading ? (
          <figure className="flex items-center justify-center w-full h-full">
            <Loader />
          </figure>
        ) : (
          businessEmploymentInfoIsSuccess && (
            <menu className="flex flex-col gap-2">
              <p>
                Working Start Time:{' '}
                {businessEmploymentInfoData?.data?.workingStartTime}
              </p>
              <p>
                Working End Time:{' '}
                {businessEmploymentInfoData?.data?.workingEndTime}
              </p>
              <p>
                Number Of Employees:{' '}
                {businessEmploymentInfoData?.data?.numberOfEmployees}
              </p>
              <p>
                Hiring Date:{' '}
                {new Date(
                  businessEmploymentInfoData?.data?.hiringDate
                ).toLocaleDateString()}
              </p>
              <p>
                Employment Declaration Date:{' '}
                {new Date(
                  businessEmploymentInfoData?.data?.employmentDeclarationDate
                ).toLocaleDateString()}
              </p>
              <p>
                Financial Year Start Date:{' '}
                {moment(
                  businessEmploymentInfoData?.data?.financialYearStartDate
                ).format('MMMM DD')}
              </p>
              <p>
                Financial Year End Date:{' '}
                {moment(businessEmploymentInfoData?.data?.financialYearEndDate)
                  .subtract(1, 'day')
                  .format('MMMM DD')}
              </p>
            </menu>
          )
        )}
      </PreviewCard>
      <PreviewCard
        applicationStatus={applicationStatus}
        businessId={businessId}
        header="Shareholders"
        tabName="capital_information"
        stepName="shareholders"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          data={founderDetailsList?.map(
            (founder: FounderDetail, index: number) => {
              return {
                ...founder,
                no: index + 1,
                name: `${founder?.firstName || founder?.companyName || ''} ${
                  founder?.middleName || ''
                } ${founder?.lastName || ''}`,
                shareHolderType: capitalizeString(founder?.shareHolderType),
              };
            }
          )}
          columns={
            founderDetailsColumns as unknown as ColumnDef<FounderDetail>[]
          }
        />
      </PreviewCard>

      {/* ATTACHMENTS */}
      <PreviewCard
        applicationStatus={applicationStatus}
        tabName="attachments"
        stepName="attachments"
        header="Attachments"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        {businessAttachmentsIsFetching ? (
          <figure className="flex items-center gap-3 w-full min-h-[20vh]">
            <Loader className="text-primary" />
            Fetching business attachments...
          </figure>
        ) : (
          businessAttachments?.length > 0 && (
            <BusinessPeopleAttachments attachments={businessAttachments} />
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
              dispatch(setBusinessActiveStep('attachments'));
              dispatch(setBusinessActiveTab('attachments'));
            }}
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              updateBusiness({ businessId, status: 'SUBMITTED' });
            }}
            value={updateBusinessIsLoading ? <Loader /> : 'Submit'}
            primary
          />
        </menu>
      )}
      {attachmentPreview && (
        <ViewDocument
          documentUrl={attachmentPreview}
          setDocumentUrl={setAttachmentPreview}
        />
      )}
    </section>
  );
};

export default PreviewSubmission;
