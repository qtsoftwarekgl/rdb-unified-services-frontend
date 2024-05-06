import UserLayout from '../../containers/UserLayout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/Accordion';
import { RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/table/Table';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setViewedCompany } from '../../states/features/userCompaniesSlice';
import { capitalizeString } from '../../helpers/strings';
import { countriesList } from '../../constants/countries';
import Button from '../../components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { provicesList } from '../../constants/provinces';
import { districtsList } from '../../constants/districts';
import { sectorsList } from '../../constants/sectors';
import { cellsList } from '../../constants/cells';
import { villagesList } from '../../constants/villages';
import { business_company_details } from '../business-registration/general-information/CompanyDetails';
import { business_shareholders } from '../business-registration/capital-information/ShareHolders';

const CompanyDetails = () => {
  const { id } = useParams();
  const { viewedCompany } = useSelector(
    (state: RootState) => state.userCompanies
  );
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(
        setViewedCompany(
          user_applications?.find(
            (business: { entry_id: string }) => business.entry_id === id
          )
        )
      );
    }

    return () => {
      dispatch(setViewedCompany(null));
    };
  }, [id, dispatch, user_applications]);

  const companyInfo: business_company_details =
    viewedCompany?.company_details ||
    viewedCompany?.foreign_company_details ||
    null;
  const companyAddress =
    viewedCompany?.company_address ||
    viewedCompany?.office_address ||
    viewedCompany?.foreign_company_address ||
    null;
  const businessActivities =
    viewedCompany?.company_activities ||
    viewedCompany?.foreign_company_activities ||
    null;
  const companyManagementMembers =
    viewedCompany?.senior_management ||
    viewedCompany?.foreign_senior_management ||
    [];
  const employment_info =
    viewedCompany?.employment_info ||
    viewedCompany?.foreign_employment_info ||
    null;
  const share_details = viewedCompany?.share_details || null;
  const shareholders = viewedCompany?.shareholders || [];
  const beneficial_owners =
    viewedCompany?.beneficial_owners ||
    viewedCompany?.foreign_beneficial_owners ||
    [];
  const border_of_directors =
    viewedCompany?.foreign_board_of_directors ||
    viewedCompany?.board_of_directors ||
    [];

  const managementMemberColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
  ];

  const beneficialOwnersColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Phone number',
      accessorKey: 'phone',
    },
    {
      header: 'Control type',
      accessorKey: 'control_type',
    },
    {
      header: 'Ownership type',
      accessorKey: 'ownership_type',
    },
  ];

  const shareholdersColumns = [
    {
      header: 'Shareholder',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Phone number',
      accessorKey: 'phone',
    },
    {
      header: 'Country',
      accessorKey: 'country',
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-center text-black ">
            {t('company details')}
          </h1>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              navigate('/user-applications');
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBackward} />
                Back
              </menu>
            }
          />
        </menu>
        {companyInfo && (
          <Accordion type="single" collapsible className="p-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                General Information
              </AccordionTrigger>
              <AccordionContent
                underlineHeader
                className="relative border-none"
              >
                {Object?.entries(companyInfo)
                  ?.filter(([key]) => key !== 'step')
                  ?.map(([key, value], index: number) => {
                    return (
                      <p key={index} className="flex items-center gap-4 mb-4">
                        <span className="font-semibold">
                          {capitalizeString(key)}:
                        </span>{' '}
                        <span className="font-normal">
                          {String(
                            typeof value === 'object' &&
                              value !== null &&
                              !Array.isArray(value)
                              ? capitalizeString(value?.name)
                              : capitalizeString(value) ?? ''
                          )}
                        </span>
                      </p>
                    );
                  })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {companyAddress && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Office Address
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                {Object?.entries(companyAddress)
                  ?.filter(([key]) => key !== 'step')
                  ?.map(([key, value], index: number) => {
                    return (
                      <p key={index} className="flex items-center gap-4 mb-4">
                        <span className="font-semibold">
                          {capitalizeString(key)}:
                        </span>{' '}
                        <span className="font-normal">
                          {String(
                            provicesList.find(
                              (province) => province.code === value
                            )?.name ||
                              districtsList.find(
                                (district) => district.code === value
                              )?.name ||
                              sectorsList.find(
                                (sector) => sector.code === value
                              )?.name ||
                              cellsList.find((cell) => cell.code === value)
                                ?.name ||
                              villagesList.find(
                                (village) => village.code === value
                              )?.name ||
                              value
                          ) ?? ''}
                        </span>
                      </p>
                    );
                  })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {businessActivities && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Business Activity & VAT Request
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <menu className="flex gap-20 max-sm:flex-col max-sm:gap-8">
                  <menu>
                    <p className="font-semibold">
                      Register for VAT:{' '}
                      <span className="font-normal">
                        {businessActivities.vat &&
                          capitalizeString(businessActivities.vat)}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Annual turnover:{' '}
                      <span className="font-normal">
                        {businessActivities?.turnover
                          ? capitalizeString(
                              String(businessActivities?.turnover)
                            )
                          : 'N/A'}
                      </span>
                    </p>
                  </menu>
                  <menu className="flex flex-col gap-3">
                    <h3 className="font-semibold underline text-md">
                      Business lines:{' '}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {businessActivities?.business_lines?.map(
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
                </menu>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {companyManagementMembers.length > 0 && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Management
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <Table
                  showFilter={false}
                  showPagination={false}
                  columns={managementMemberColumns}
                  data={companyManagementMembers.map((member) => {
                    return {
                      ...member,
                      name:
                        member?.first_name + ' ' + (member?.last_name || '') ||
                        '',
                    };
                  })}
                  className="bg-white"
                  header="Management Members"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {employment_info && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Employment Information
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <menu className="flex flex-col gap-2">
                  <p className="font-semibold">
                    Company has employees:{' '}
                    <span className="font-normal">
                      {employment_info?.has_employees &&
                        capitalizeString(employment_info?.has_employees)}
                    </span>
                  </p>
                  {employment_info?.has_employees !== 'no' && (
                    <p className="font-semibold">
                      Number of employees:{' '}
                      <span className="font-normal">
                        {employment_info?.employees_no}
                      </span>
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">
                      Account reference date:{' '}
                      <span className="font-normal">
                        {employment_info?.reference_date || 'N/A'}
                      </span>
                    </span>
                  </p>
                </menu>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {share_details && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Capital Details
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <menu className="flex flex-col gap-2">
                  <p className="font-semibold">
                    Total business capital:{' '}
                    <span className="font-normal">
                      RWF {share_details?.company_capital}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Total assignable shares:{' '}
                    <span className="font-normal">
                      {share_details?.total_shares}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Total assignable shares' values:{' '}
                    <span className="font-normal">
                      RWF {share_details?.total_value}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Remaining capital:{' '}
                    <span className="font-normal">
                      RWF{' '}
                      {Number(share_details?.company_capital) -
                        Number(share_details?.total_value)}
                    </span>
                  </p>
                </menu>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {shareholders.length > 0 && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                ShareHolders
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <Table
                  showFilter={false}
                  showPagination={false}
                  columns={shareholdersColumns}
                  data={shareholders?.map((shareholder: business_shareholders) => {
                    return {
                      ...shareholder,
                      name: shareholder?.company_name
                        ? shareholder?.company_name
                        : `${shareholder?.first_name || ''} ${
                            shareholder?.last_name || ''
                          }`,
                      type:
                        shareholder?.shareholder_type &&
                        capitalizeString(shareholder?.shareholder_type),
                      phone: shareholder?.phone || shareholder?.company_phone,
                      country: countriesList?.find(
                        (country) =>
                          country?.code ===
                          (shareholder?.country ||
                            shareholder?.incorporation_country)
                      )?.name,
                    };
                  })}
                  className="bg-white"
                  header="shareholders"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {border_of_directors.length > 0 && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Board of Directors
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <Table
                  showFilter={false}
                  showPagination={false}
                  columns={managementMemberColumns}
                  data={border_of_directors.map((member) => {
                    return {
                      ...member,
                      name:
                        member?.first_name + ' ' + (member?.last_name || ''),
                    };
                  })}
                  className="bg-white"
                  header="Management Members"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {beneficial_owners.length > 0 && (
          <Accordion type="single" collapsible className="px-8 py-8 bg-white">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-bold ">
                Beneficial owners
              </AccordionTrigger>
              <AccordionContent underlineHeader className="border-none">
                <Table
                  showFilter={false}
                  showPagination={false}
                  columns={beneficialOwnersColumns}
                  data={beneficial_owners?.map((owner) => {
                    return {
                      ...owner,
                      name: owner?.company_name
                        ? owner?.company_name
                        : `${owner?.first_name || ''} ${
                            owner?.last_name || ''
                          }`,
                      phone: owner?.phone || owner?.company_phone,
                      control_type: capitalizeString(owner?.control_type),
                      ownership_type: capitalizeString(owner?.ownership_type),
                    };
                  })}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </main>
    </UserLayout>
  );
};

export default CompanyDetails;
