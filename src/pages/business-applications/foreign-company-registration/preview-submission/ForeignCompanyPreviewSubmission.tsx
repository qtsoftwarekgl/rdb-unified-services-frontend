import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import PreviewCard from '../../../../components/business-registration/PreviewCard';
import {
  removeForeignCompanyRegistrationTabs,
  setForeignBusinessActiveStep,
  setForeignBusinessActiveTab,
} from '../../../../states/features/foreignCompanyRegistrationSlice';
import { capitalizeString, formatDate } from '../../../../helpers/strings';
import Table from '../../../../components/table/Table';
import { countriesList } from '../../../../constants/countries';
import Button from '../../../../components/inputs/Button';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';
import { BusinessActivity, businessId } from '@/types/models/business';
import {
  useLazyFetchBusinessActivitiesQuery,
  useLazyGetBusinessAddressQuery,
  useLazyGetBusinessDetailsQuery,
  useLazyGetEmploymentInfoQuery,
  useUpdateBusinessMutation,
} from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import {
  setBusinessAddress,
  setBusinessDetails,
  setEmploymentInfo,
} from '@/states/features/businessSlice';
import { useLazyFetchBusinessPeopleQuery } from '@/states/api/foreignCompanyRegistrationApiSlice';
import { setBoardOfDirectorsList } from '@/states/features/boardOfDirectorSlice';
import { setExecutiveManagersList } from '@/states/features/executiveManagerSlice';
import {
  setSelectedBusinessLinesList,
  setSelectedMainBusinessLine,
  setVatRegistred,
} from '@/states/features/businessActivitySlice';
import { useLazyFetchBusinessAttachmentsQuery } from '@/states/api/businessRegApiSlice';
import { setBusinessAttachments } from '@/states/features/businessSlice';
import BusinessPeopleAttachments from '../../domestic-business-registration/BusinessPeopleAttachments';
import { findNavigationFlowMassIdByStepName } from '@/helpers/business.helpers';

interface ForeignCompanyPreviewSubmissionProps {
  businessId: businessId;
  applicationStatus: string;
}

const ForeignCompanyPreviewSubmission = ({
  businessId,
  applicationStatus,
}: ForeignCompanyPreviewSubmissionProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessDetails, businessAddress } = useSelector(
    (state: RootState) => state.business
  );
  const { selectedBusinessLinesList, selectedMainBusinessLine, vatRegistred } =
    useSelector((state: RootState) => state.businessActivity);
  const { boardMemberList } = useSelector(
    (state: RootState) => state.boardOfDirector
  );
  const { executiveManagersList } = useSelector(
    (state: RootState) => state.executiveManager
  );
  const { employmentInfo } = useSelector((state: RootState) => state.business);
  const navigate = useNavigate();
  const { businessAttachments } = useSelector(
    (state: RootState) => state.business
  );
  const { navigationFlowMassList, businessNavigationFlowsList } = useSelector(
    (state: RootState) => state.navigationFlow
  );

  // GET BUSINESS DETAILS
  const [
    getBusinessDetails,
    {
      data: businessDetailsData,
      isLoading: businessIsLoading,
      error: businessError,
      isError: businessIsError,
      isSuccess: businessIsSuccess,
    },
  ] = useLazyGetBusinessDetailsQuery();

  // INITIALIZE GET BUSINESS QUERY
  const [
    getBusinessAddress,
    {
      data: businessAddressData,
      error: businessAddressError,
      isLoading: businessAddressIsLoading,
      isError: businessAddressIsError,
      isSuccess: businessAddressIsSuccess,
    },
  ] = useLazyGetBusinessAddressQuery();

  // INITIALIZE FETCH BOARD MEMEBER QUERY
  const [
    fetchBoardMembers,
    {
      data: boardMemberData,
      error: boardMemberError,
      isLoading: boardMemberIsLoading,
      isError: boardMemberIsError,
      isSuccess: boardMemberIsSuccess,
    },
  ] = useLazyFetchBusinessPeopleQuery();

  // INITIALIZE FETCH BUSINESS ACTIVITIES QUERY
  const [
    fetchBusinessActivities,
    {
      data: businessActivitiesData,
      isLoading: businessActivitiesIsLoading,
      isSuccess: businessActivitiesIsSuccess,
      isError: businessActivitiesIsError,
      error: businessActivitiesError,
    },
  ] = useLazyFetchBusinessActivitiesQuery();

  // INITIALIZE FETCH MANAGEMENT OR BOARD PEOPLE QUERY
  const [
    fetchManagementMember,
    {
      data: managementMemberData,
      error: managementMemberError,
      isLoading: managementMemberIsLoading,
      isError: managementMemberIsError,
      isSuccess: managementMemberIsSuccess,
    },
  ] = useLazyFetchBusinessPeopleQuery();

  // GET EMPLOYMENT INFO
  const [
    fetchEmploymentInfo,
    {
      data: employmentInfoData,
      isLoading: employmentInfoIsLoading,
      error: employmentInfoError,
      isSuccess: employmentInfoIsSuccess,
    },
  ] = useLazyGetEmploymentInfoQuery();

  // INITIALIZE FETC BUSINESS ATTACHMENTS
  const [
    fetchBusinessAttachments,
    {
      data: businessAttachmentsData,
      isLoading: businessAttachmentsIsLoading,
      error: businessAttachmentsError,
      isSuccess: businessAttachmentsIsSuccess,
      isError: businessAttachmentsIsError,
    },
  ] = useLazyFetchBusinessAttachmentsQuery();

  // GET BUSINESS
  useEffect(() => {
    if (businessId) {
      getBusinessDetails({ id: businessId });
      getBusinessAddress({ businessId });
      fetchBusinessActivities({ businessId });
      fetchBoardMembers({ businessId, route: 'board-member' });
      fetchManagementMember({
        businessId,
        route: 'management',
      });
      fetchEmploymentInfo({ id: businessId });
      fetchBusinessAttachments({ businessId });
    }
  }, [
    businessId,
    fetchBoardMembers,
    fetchBusinessActivities,
    fetchBusinessAttachments,
    fetchEmploymentInfo,
    fetchManagementMember,
    getBusinessAddress,
    getBusinessDetails,
  ]);

  // HANDLE BUSINESS DETAILS DATA RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching business details. Please try again later.'
        );
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess) {
      dispatch(setBusinessDetails(businessDetailsData?.data));
    }
  }, [
    businessDetailsData,
    businessError,
    businessIsError,
    businessIsSuccess,
    dispatch,
  ]);

  // HANDLE GET BUSINESS ADDRESS RESPONSE
  useEffect(() => {
    if (businessAddressIsError) {
      if ((businessAddressError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while fetching business data');
      } else {
        toast.error((businessAddressError as ErrorResponse)?.data?.message);
      }
    } else if (businessAddressIsSuccess) {
      dispatch(setBusinessAddress(businessAddressData?.data));
    }
  }, [
    businessAddressData,
    businessAddressError,
    businessAddressIsError,
    businessAddressIsSuccess,
    dispatch,
  ]);

  // FETCH BUSINESS ACTIVITIES
  useEffect(() => {
    fetchBusinessActivities({ businessId });
  }, [businessId, fetchBusinessActivities]);

  // HANDLE FETCH BUSINESS ACTIVITIES RESPONSE
  useEffect(() => {
    if (businessActivitiesIsError) {
      if ((businessActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching business activities. Please try again later.'
        );
      }
    } else if (businessActivitiesIsSuccess) {
      dispatch(
        setSelectedBusinessLinesList(businessActivitiesData?.data?.businessLine)
      );
      dispatch(setVatRegistred(businessActivitiesData?.data?.vatregistered));
      if (
        selectedMainBusinessLine === undefined ||
        Object.keys(selectedMainBusinessLine).length === 0
      ) {
        dispatch(
          setSelectedMainBusinessLine(
            businessActivitiesData?.data?.businessLine?.find(
              (activity: BusinessActivity) =>
                activity.description ===
                businessActivitiesData?.data?.mainBusinessActivity
            )
          )
        );
      }
    }
  }, [
    businessActivitiesData,
    businessActivitiesError,
    businessActivitiesIsError,
    businessActivitiesIsSuccess,
    dispatch,
    selectedMainBusinessLine,
  ]);

  // HANDLE FETCH BOARD MEMBERS RESPONSE
  useEffect(() => {
    if (boardMemberIsError) {
      if ((boardMemberError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while fetching board members');
      } else {
        toast.error((boardMemberError as ErrorResponse)?.data?.message);
      }
    } else if (boardMemberIsSuccess) {
      dispatch(setBoardOfDirectorsList(boardMemberData.data));
    }
  }, [
    boardMemberData,
    boardMemberError,
    boardMemberIsError,
    boardMemberIsSuccess,
    dispatch,
  ]);

  // HANDLE MANAGEMENT PEOPLE RESPONSE
  useEffect(() => {
    if (managementMemberIsError) {
      if ((managementMemberError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching people. Please try again later'
        );
      } else {
        toast.error((managementMemberError as ErrorResponse).data?.message);
      }
    } else if (managementMemberIsSuccess) {
      dispatch(setExecutiveManagersList(managementMemberData?.data));
    }
  }, [
    dispatch,
    managementMemberData?.data,
    managementMemberError,
    managementMemberIsSuccess,
    managementMemberIsError,
  ]);

  // HANDLE FETCH EMPLOYMENT INFO QUERY
  useEffect(() => {
    if (employmentInfoError) {
      if ((employmentInfoError as ErrorResponse)?.status === 500)
        toast.error(
          'An error occurred while fetching employment info. Please try again later.'
        );
      else toast.error((employmentInfoError as ErrorResponse)?.data?.message);
    } else dispatch(setEmploymentInfo(employmentInfoData?.data));
  }, [dispatch, employmentInfoData?.data, employmentInfoError]);

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
      dispatch(setForeignBusinessActiveStep('company_details'));
      dispatch(setForeignBusinessActiveTab('general_information'));
      dispatch(removeForeignCompanyRegistrationTabs());
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

  // HANDLE FETCH BUSINESS ATTACHMENTS RESPONSE
  useEffect(() => {
    if (businessAttachmentsIsError) {
      if ((businessAttachmentsError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching business attachments. Please try again later.'
        );
      } else {
        toast.error((businessAttachmentsError as ErrorResponse)?.data?.message);
      }
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

  // TABLE COLUMNS
  const managementColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Document Number (NID/Passport)',
      accessorKey: 'documentNumber',
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
    {
      header: 'Country',
      accessorKey: 'country',
    },
  ];

  return (
    <section className="flex flex-col w-full h-full gap-6">
      {employmentInfoIsLoading ||
        businessAddressIsLoading ||
        businessIsLoading ||
        businessActivitiesIsLoading ||
        boardMemberIsLoading ||
        employmentInfoIsSuccess ||
        businessAttachmentsIsLoading ||
        (managementMemberIsLoading && (
          <figure className="h-[40vh] flex items-center justify-center">
            <Loader />
          </figure>
        ))}
      <PreviewCard
        header="Company Details"
        businessId={businessId}
        applicationStatus={applicationStatus}
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Company Details'
        )}
      >
        {businessDetails &&
          Object?.entries(businessDetails)?.map(
            ([key, value], index: number) => {
              if (
                key === 'step' ||
                key === 'id' ||
                key === 'isForeign' ||
                value === null
              )
                return null;
              return (
                <p key={index} className="flex items-center gap-2">
                  <span className="">{capitalizeString(key)}:</span>{' '}
                  <span className="font-bold">
                    {String(value) && capitalizeString(String(value))}
                  </span>
                </p>
              );
            }
          )}
      </PreviewCard>
      {/* COMPANY ADDRESS */}
      <PreviewCard
        header="Company Address"
        businessId={businessId}
        applicationStatus={applicationStatus}
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Company Address'
        )}
      >
        {Object?.entries(businessAddress ?? {})
          ?.filter(
            ([key]) => key !== 'step' && key !== 'id' && key !== 'location'
          )
          ?.map(([key, value], index: number) => {
            return (
              <p key={index} className="flex items-center gap-2">
                <span className="">{capitalizeString(key)}:</span>{' '}
                <span className="font-bold">{String(value) ?? ''}</span>
              </p>
            );
          })}
      </PreviewCard>
      <PreviewCard
        header="Business Activities & VAT"
        businessId={businessId}
        applicationStatus={applicationStatus}
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Business Activity & VAT'
        )}
      >
        <p className="font-semibold">
          Register for VAT:{' '}
          <span className="font-normal">
            {capitalizeString(vatRegistred ? 'yes' : 'no')}
          </span>
        </p>
        <p className="font-semibold">
          Main business line:{' '}
          <span className="font-normal">
            {selectedMainBusinessLine.description}
          </span>
        </p>
        {/* <p className="font-semibold">
          Annual turnover:{" "}
          <span className="font-normal">
            {foreign_company_activities?.turnover
              ? String(capitalizeString(foreign_company_activities?.turnover))
              : "N/A"}
          </span>
        </p> */}
        <menu className="flex flex-col gap-3">
          <h3 className="font-semibold underline text-md">Business lines: </h3>
          <ul className="flex flex-col gap-2">
            {selectedBusinessLinesList?.map((line, index) => {
              return (
                <li key={index} className="flex items-center gap-1">
                  {line?.description}
                </li>
              );
            })}
          </ul>
        </menu>
      </PreviewCard>
      {/* BOARD OF DIRECTORS */}
      <PreviewCard
        header="Board of Directors"
        businessId={businessId}
        applicationStatus={applicationStatus}
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Board of Directors'
        )}
      >
        <Table
          rowClickHandler={undefined}
          showFilter={false}
          showPagination={false}
          columns={managementColumns}
          data={boardMemberList?.map((director) => {
            return {
              ...director,
              name: `${director?.firstName} ${director?.lastName}`,
              documentNumber: director?.personDocNo,
              position:
                director?.roleDescription &&
                capitalizeString(director?.roleDescription),
              country: countriesList?.find(
                (country) => country?.code === director?.nationality
              )?.name,
            };
          })}
        />
      </PreviewCard>
      {/* SENIOR MANAGEMENT */}
      <PreviewCard
        header="Executive Management"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Executive Management'
        )}
        businessId={businessId}
        applicationStatus={applicationStatus}
      >
        <Table
          rowClickHandler={undefined}
          showFilter={false}
          showPagination={false}
          columns={managementColumns}
          data={executiveManagersList?.map((director) => {
            return {
              ...director,
              name: `${director?.firstName} ${director?.lastName}`,
              documentNumber: director?.personDocNo,
              position:
                director?.roleDescription &&
                capitalizeString(director?.roleDescription),
              country: countriesList?.find(
                (country) => country?.code === director?.nationality
              )?.name,
            };
          })}
        />
      </PreviewCard>
      {/* EMPLOYMENT INFO */}
      <PreviewCard
        header="Employment Information"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Employment Info'
        )}
        businessId={businessId}
        applicationStatus={applicationStatus}
      >
        <p>
          Company has employees:{' '}
          <span className="font-semibold">
            {employmentInfo?.numberOfEmployees > 0 ? 'yes' : 'no'}
          </span>
        </p>
        {employmentInfo?.numberOfEmployees > 0 && (
          <p>
            Number of employees:{' '}
            <span className="font-semibold">
              {employmentInfo?.numberOfEmployees}
            </span>
          </p>
        )}
        <p>
          <span>
            Financial year start date:{' '}
            <span className="font-semibold">
              {formatDate(employmentInfo?.financialYearStartDate) || 'N/A'}
            </span>
          </span>
        </p>
        <p>
          <span>
            Financial year end date:{' '}
            <span className="font-semibold">
              {formatDate(employmentInfo?.financialYearEndDate) || 'N/A'}
            </span>
          </span>
        </p>
      </PreviewCard>
      {/* ATTACHMENTS */}
      <PreviewCard
        header="Attachments"
        navigationFlowMassId={findNavigationFlowMassIdByStepName(
          navigationFlowMassList,
          'Attachments'
        )}
        businessId={businessId}
        applicationStatus={applicationStatus}
      >
        {businessAttachments?.length > 0 && (
          <BusinessPeopleAttachments attachments={businessAttachments} />
        )}
      </PreviewCard>
      <menu
        className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}
      >
        <Button
          value="Back"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setForeignBusinessActiveStep('foreign_attachments'));
            dispatch(setForeignBusinessActiveTab('foreign_attachments'));
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
            updateBusiness({ businessId, status: 'SUBMITTED' });
          }}
          value={updateBusinessIsLoading ? <Loader /> : 'Submit'}
          primary
        />
      </menu>
    </section>
  );
};

export default ForeignCompanyPreviewSubmission;
