import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../states/store';
import PreviewCard from '../../../../components/business-registration/PreviewCard';
import {
  business_registration_tabs_initial_state,
  setBusinessActiveStep,
  setBusinessActiveTab,
  setBusinessCompletedStep,
  setBusinessPersonDetailsModal,
  setBusinessRegistrationTabs,
} from '../../../../states/features/businessRegistrationSlice';
import { capitalizeString, formatDate } from '../../../../helpers/strings';
import Table from '../../../../components/table/Table';
import { countriesList } from '../../../../constants/countries';
import Button from '../../../../components/inputs/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../../../components/Loader';
import {
  setApplicationReviewComments,
  setListReviewCommentsModal,
  setUserApplications,
} from '../../../../states/features/userApplicationSlice';
import moment from 'moment';
import { provicesList } from '../../../../constants/provinces';
import { districtsList } from '../../../../constants/districts';
import { sectorsList } from '../../../../constants/sectors';
import { cellsList } from '../../../../constants/cells';
import { villagesList } from '../../../../constants/villages';
import ViewDocument from '../../../user-company-details/ViewDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { previewUrl } from '../../../../constants/authentication';
import { setIsAmending } from '../../../../states/features/amendmentSlice';
import BusinessPersonDetails from '../BusinessPersonDetails';
import { ReviewComment } from '@/components/applications-review/AddReviewComments';
import { RDBAdminEmailPattern } from '@/constants/Users';
import { businessId } from '@/types/models/business';

interface PreviewSubmissionProps {
  businessId: businessId;
  status: string;
}

const PreviewSubmission: FC<PreviewSubmissionProps> = ({
  status,
  businessId,
}) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [attachmentPreview, setAttachmentPreview] = useState<string>('');

  // INITIALIZE FETCHING COMPANY DETAILS QUERY
  const [fetchCompanyDetails, setFetchCompanyDetails] = useState<boolean>(true);

  // NAVIGATION
  const navigate = useNavigate();

  return (
    <section className="flex flex-col w-full h-full gap-6 overflow-y-scroll">
      {/* COMPANY DETAILS */}
        <PreviewCard
          status={status}
          businessId={businessId}
          header="Company Details"
          tabName="general_information"
          stepName="company_details"
          setActiveStep={setBusinessActiveStep}
          setActiveTab={setBusinessActiveTab}
        >
          Checkk
        </PreviewCard>

        {/* <PreviewCard
          status={business_application.status}
          entryId={business_application?.entryId}
          header="Company Address"
          tabName="general_information"
          stepName="company_address"
          setActiveStep={setBusinessActiveStep}
          setActiveTab={setBusinessActiveTab}
        >
          {Object?.entries(business_application?.company_address)
            ?.filter(([key]) => key !== 'step')
            ?.map(([key, value], index: number) => {
              return (
                <p key={index} className="flex items-center gap-2">
                  <span className="">{capitalizeString(key)}:</span>{' '}
                  <span className="font-bold">
                    {String(
                      provicesList.find((province) => province.code === value)
                        ?.name ||
                        districtsList.find(
                          (district) => district.code === value
                        )?.name ||
                        sectorsList.find((sector) => sector.code === value)
                          ?.name ||
                        cellsList.find((cell) => cell.code === value)?.name ||
                        villagesList.find((village) => village.code === value)
                          ?.name ||
                        value
                    ) ?? ''}
                  </span>
                </p>
              );
            })}
        </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Business Activities & VAT"
        tabName="general_information"
        stepName="business_activity_vat"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Register for VAT:{' '}
          <span className="font-normal">
            {business_application?.company_activities?.vat &&
              capitalizeString(business_application?.company_activities?.vat)}
          </span>
        </p>
        <p className="font-semibold">
          Annual turnover:{' '}
          <span className="font-normal">
            {business_application?.company_activities?.turnover
              ? capitalizeString(
                  String(business_application?.company_activities?.turnover)
                )
              : 'N/A'}
          </span>
        </p>
        <menu className="flex flex-col gap-3">
          <h3 className="font-semibold underline text-md">Business lines: </h3>
          <ul className="flex flex-col gap-2">
            {business_application?.company_activities?.business_lines?.map(
              (line, index) => {
                return (
                  <li key={index} className="flex items-center gap-1">
                    {line?.name}
                  </li>
                );
              }
            )}
          </ul>
        </menu>
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Board of Directors"
        tabName="management"
        stepName="board_of_directors"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          columns={managementColumns}
          data={
            business_application?.board_of_directors?.length > 0
              ? business_application?.board_of_directors?.map((director) => {
                  return {
                    ...director,
                    name: `${director?.first_name || ''} ${
                      director?.last_name || ''
                    }`,
                    phone: director?.phone,
                    position:
                      director?.position &&
                      capitalizeString(director?.position),
                    country: countriesList?.find(
                      (country) => country?.code === director?.country
                    )?.name,
                  };
                })
              : []
          }
        />
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Senior Management"
        tabName="management"
        stepName="executive_management"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          showFilter={false}
          showPagination={false}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          columns={managementColumns}
          data={
            business_application?.executive_management?.length > 0
              ? business_application?.executive_management?.map((director) => {
                  return {
                    ...director,
                    name: `${director?.first_name || ''} ${
                      director?.last_name || ''
                    }`,
                    phone: director?.phone,
                    position:
                      director?.position &&
                      capitalizeString(director?.position),
                    country: countriesList?.find(
                      (country) => country?.code === director?.country
                    )?.name,
                  };
                })
              : []
          }
        />
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Employment Information"
        tabName="management"
        stepName="employment_info"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Company has employees:{' '}
          <span className="font-normal">
            {business_application?.employment_info?.has_employees &&
              capitalizeString(
                business_application?.employment_info?.has_employees
              )}
          </span>
        </p>
        {business_application?.employment_info?.has_employees !== 'no' && (
          <p className="font-semibold">
            Number of employees:{' '}
            <span className="font-normal">
              {business_application?.employment_info?.number_of_employees}
            </span>
          </p>
        )}
        <p>
          <span className="font-semibold">
            Account reference date:{' '}
            <span className="font-normal">
              {formatDate(
                business_application?.employment_info?.reference_date
              ) || 'N/A'}
            </span>
          </span>
        </p>
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Share Details"
        tabName="capital_information"
        stepName="share_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <p className="font-semibold">
          Total business capital:{' '}
          <span className="font-normal">
            RWF {business_application?.share_details?.company_capital}
          </span>
        </p>
        <p className="font-semibold">
          Total assignable shares:{' '}
          <span className="font-normal">
            {business_application?.share_details?.total_shares}
          </span>
        </p>
        <p className="font-semibold">
          Total assignable shares' values:{' '}
          <span className="font-normal">
            RWF {business_application?.share_details?.total_value}
          </span>
        </p>
        <p className="font-semibold">
          Remaining capital:{' '}
          <span className="font-normal">
            RWF{' '}
            {Number(business_application?.share_details?.company_capital) -
              Number(business_application?.share_details?.total_value)}
          </span>
        </p>
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Shareholders"
        tabName="capital_information"
        stepName="shareholders"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          data={
            business_application?.shareholders?.length > 0
              ? business_application?.shareholders?.map((shareholder) => {
                  return {
                    ...shareholder,
                    name: shareholder?.company_name
                      ? shareholder?.company_name
                      : `${shareholder?.first_name || ''} ${
                          shareholder?.last_name || ''
                        }`,
                    type:
                      shareholder?.type && capitalizeString(shareholder?.type),
                    phone: shareholder?.phone || shareholder?.company_phone,
                    country: countriesList?.find(
                      (country) =>
                        country?.code ===
                        (shareholder?.country ||
                          shareholder?.incorporation_country)
                    )?.name,
                  };
                })
              : []
          }
          columns={shareholdersColumns}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Capital Details"
        tabName="capital_information"
        stepName="capital_details"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(row?.original));
            setBusinessPersonDetails(row?.original);
          }}
          data={
            business_application?.capital_details?.length > 0
              ? business_application?.capital_details?.map((shareholder) => {
                  return {
                    ...shareholder,
                    name: shareholder?.company_name
                      ? shareholder?.company_name
                      : `${shareholder?.first_name || ''} ${
                          shareholder?.last_name || ''
                        }`,
                    type:
                      shareholder?.type && capitalizeString(shareholder?.type),
                    phone: shareholder?.phone || shareholder?.company_phone,
                    country: countriesList?.find(
                      (country) =>
                        country?.code ===
                        (shareholder?.country ||
                          shareholder?.incorporation_country)
                    )?.name,
                    total_shares: shareholder?.shares?.total_shares,
                    total_value: `RWF ${shareholder?.shares?.total_value}`,
                  };
                })
              : []
          }
          columns={capitalDetailsColumns}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Beneficial Owners"
        tabName="beneficial_owners"
        stepName="beneficial_owners"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <Table
          data={
            business_application?.beneficial_owners?.length > 0
              ? business_application?.beneficial_owners?.map((owner) => {
                  return {
                    ...owner,
                    name: owner?.company_name
                      ? owner?.company_name
                      : `${owner?.first_name || ''} ${owner?.last_name || ''}`,
                    phone: owner?.phone || owner?.company_phone,
                    control_type: capitalizeString(owner?.control_type),
                    ownership_type: capitalizeString(owner?.ownership_type),
                  };
                })
              : []
          }
          columns={beneficialOwnersColumns}
          rowClickHandler={(row) => {
            dispatch(setBusinessPersonDetailsModal(true));
            setBusinessPersonDetails(row?.original);
          }}
          showFilter={false}
          showPagination={false}
        />
      </PreviewCard>

      <PreviewCard
        status={business_application.status}
        entryId={business_application?.entryId}
        header="Attachments"
        tabName="attachments"
        stepName="attachments"
        setActiveStep={setBusinessActiveStep}
        setActiveTab={setBusinessActiveTab}
      >
        <section className="flex flex-col gap-5">
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Board of directors
            </h3>
            {business_application?.board_of_directors?.map(
              (director, index) => {
                if (director?.attachment?.name) {
                  return (
                    <p
                      key={index}
                      className="flex items-center justify-between w-full gap-6 font-normal"
                    >
                      {director?.first_name || ''} {director?.last_name || ''}:{' '}
                      <span className="flex items-center justify-end gap-2 font-semibold">
                        {director?.attachment?.name}
                        <FontAwesomeIcon
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachmentPreview(previewUrl);
                          }}
                          icon={faEye}
                          className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                        />
                      </span>
                    </p>
                  );
                }
              }
            )}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Senior management
            </h3>
            {business_application?.executive_management?.map((senior, index) => {
              if (senior?.attachment?.name) {
                return (
                  <p
                    key={index}
                    className="flex items-center justify-between w-full gap-6 font-normal"
                  >
                    {senior?.first_name || ''} {senior?.last_name || ''}:{' '}
                    <span className="flex items-center justify-end gap-2 font-semibold">
                      {senior?.attachment?.name}
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentPreview(previewUrl);
                        }}
                        icon={faEye}
                        className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      />
                    </span>
                  </p>
                );
              }
            })}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">Shareholders</h3>
            {business_application?.shareholders?.map(
              (shareholder: business_shareholders, index) => {
                if (shareholder?.attachment?.name) {
                  if (shareholder?.type === 'person') {
                    return (
                      <p
                        key={index}
                        className="flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {shareholder?.first_name || ''}{' '}
                        {shareholder?.last_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {shareholder?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        className="flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {shareholder?.company_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {shareholder?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  }
                }
              }
            )}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Beneficial owners
            </h3>
            {business_application?.beneficial_owners?.map(
              (beneficial_owner: business_beneficial_owners, index) => {
                if (beneficial_owner?.attachment?.name) {
                  if (beneficial_owner?.type === 'person') {
                    return (
                      <p
                        key={index}
                        className="cursor-pointer flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {beneficial_owner?.first_name || ''}{' '}
                        {beneficial_owner?.last_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {beneficial_owner?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        className="cursor-pointer flex items-center justify-between w-full gap-6 font-normal"
                      >
                        {beneficial_owner?.company_name || ''}:{' '}
                        <span className="flex items-center justify-end gap-2 font-semibold">
                          {beneficial_owner?.attachment?.name}
                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              setAttachmentPreview(previewUrl);
                            }}
                            icon={faEye}
                            className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                          />
                        </span>
                      </p>
                    );
                  }
                }
              }
            )}
          </menu>
          <menu className="flex flex-col gap-3">
            <h3 className="font-semibold uppercase text-md">
              Company Attachments
            </h3>
            {business_application?.company_attachments &&
              Object.keys(business_application?.company_attachments)?.length >
                0 && (
                <menu className="flex flex-col gap-3">
                  <p className="flex items-center justify-between w-full gap-6 font-normal">
                    Articles of association:{' '}
                    <span className="flex items-center justify-end gap-3 font-semibold text-end">
                      {
                        business_application?.company_attachments
                          ?.articles_of_association?.name
                      }
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentPreview(previewUrl);
                        }}
                        icon={faEye}
                        className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      />
                    </span>
                  </p>
                  <p className="flex items-center justify-between w-full gap-6 font-normal">
                    Resolution:{' '}
                    <ul
                      className={`${
                        business_application?.company_attachments?.resolution
                          ?.name
                          ? 'flex'
                          : 'hidden'
                      } text-end flex items-center gap-3 justify-end font-semibold`}
                    >
                      {
                        business_application?.company_attachments?.resolution
                          ?.name
                      }
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.preventDefault();
                          setAttachmentPreview(previewUrl);
                        }}
                        icon={faEye}
                        className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                      />
                    </ul>
                  </p>
                  <p className="flex items-start justify-between w-full gap-6 font-normal">
                    Shareholder attachments:{' '}
                    <span className="font-semibold">
                      {business_application?.company_attachments
                        ?.shareholder_attachments &&
                        business_application?.company_attachments?.shareholder_attachments?.map(
                          (attachment, index) => {
                            return (
                              <ul
                                key={index}
                                className="flex items-center justify-end gap-3 font-semibold text-end"
                              >
                                {attachment?.name}
                                <FontAwesomeIcon
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAttachmentPreview(previewUrl);
                                  }}
                                  icon={faEye}
                                  className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                />
                              </ul>
                            );
                          }
                        )}
                    </span>
                  </p>
                  <p className="flex items-start justify-between w-full gap-6 font-normal">
                    Others:{' '}
                    <span className="font-semibold">
                      {business_application?.company_attachments?.others &&
                        business_application?.company_attachments?.others?.map(
                          (attachment, index) => {
                            return (
                              <ul
                                key={index}
                                className="flex items-center justify-end gap-3 font-semibold text-end"
                              >
                                {attachment?.name}
                                <FontAwesomeIcon
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setAttachmentPreview(previewUrl);
                                  }}
                                  icon={faEye}
                                  className="text-primary text-[16px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                />
                              </ul>
                            );
                          }
                        )}
                    </span>
                  </p>
                </menu>
              )}
          </menu>
        </section>
      </PreviewCard> */}
      
      {['IN_PROGRESS', 'ACTION_REQUIRED', 'IN_PREVIEW', 'IS_AMENDING'].includes(
        status
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
            value={isLoading ? <Loader /> : 'Submit'}
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
      <BusinessPersonDetails personDetails={businessPersonDetails} />
    </section>
  );
};

export default PreviewSubmission;
