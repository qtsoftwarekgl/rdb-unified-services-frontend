import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/inputs/Button';
import UserLayout from '../../../containers/UserLayout';
import {
  capitalizeString,
  formatDate,
  generateUUID,
} from '../../../helpers/strings';
import { AppDispatch, RootState } from '../../../states/store';
import Table from '../../../components/table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
  setDeleteApplicationModal,
} from '../../../states/features/businessRegistrationSlice';
import SelectReservedName from './SelectReservedName';
import { setSelectReservedNameModal } from '../../../states/features/nameReservationSlice';
import { setSelectedApplication } from '../../../states/features/userApplicationSlice';
import { UnknownAction } from '@reduxjs/toolkit';
import DeleteBusinessApplication from './DeleteBusinessApplication';

interface NewRegistrationProps {
  description: string;
  path: string;
  setActiveTab: (tab: string) => UnknownAction;
  setActiveStep: (string: string) => UnknownAction;
}

export const NewRegistration = ({
  description,
  path,
  setActiveStep,
  setActiveTab,
}: NewRegistrationProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const navigate = useNavigate();

  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  const applicationsInProgress = user_applications
    .filter(
      (app: any) =>
        app.status === 'in_progress' && app.type === 'business_registration'
    )
    .map((business: any) => {
      return {
        ...business,
        createdAt: formatDate(business?.createdAt),
        company_name: business?.company_details?.name,
        status: capitalizeString(business?.status),
        id:
          business?.id ||
          business?.entry_id ||
          Math.floor(Math.random() * 9000) + 1000,
        reg_number: `REG-${(
          business?.entry_id?.split('-')[0] || ''
        ).toUpperCase()}`,
        service_name: capitalizeString(business?.type),
        path: business?.path,
        active_tab: business?.active_tab,
        active_step: business?.active_step,
      };
    });

  function renderActionCell({
    row,
  }: {
    row: {
      original: {
        active_step: string;
        active_tab: string;
        path: string;
        entry_id: string;
      };
    };
  }) {
    return (
      <menu className="flex items-center gap-6 cursor-pointer">
        <Button
          value={
            <menu className="flex items-center gap-1 transition-all duration-200 hover:gap-2">
              <p className="text-[13px]">Resume</p>
              <FontAwesomeIcon className="text-[13px]" icon={faArrowRight} />
            </menu>
          }
          styled={false}
          className="!bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            if (row?.original?.active_step) {
              dispatch(setBusinessActiveStep(row?.original?.active_step));
            }
            if (row?.original?.active_tab) {
              dispatch(setBusinessActiveTab(row?.original?.active_tab));
            }
            navigate(row?.original?.path);
          }}
        />
        <Button
          value={
            <menu className="flex items-center gap-1 transition-all duration-200 hover:gap-2">
              <p className="text-[13px]">Discard</p>
              <FontAwesomeIcon className="text-[13px]" icon={faTrash} />
            </menu>
          }
          styled={false}
          className="!bg-transparent hover:!bg-transparent !text-red-600 hover:!text-red-600 !shadow-none !p-0"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedApplication(row?.original));
            dispatch(setDeleteApplicationModal(true));
          }}
        />
      </menu>
    );
  }

  const businessRegistrationApplicationColumns = [
    { header: 'Registration Number', accessorKey: 'reg_number' },
    { header: 'Company Name', accessorKey: 'company_name' },
    { header: 'Service Name', accessorKey: 'service_name' },
    {
      header: 'Progress',
      accessorKey: 'active_tab',
      cell: ({
        row,
      }: {
        row: {
          original: {
            active_step: string;
          };
        };
      }) => {
        return (
          <p className="text-[14px]">
            {capitalizeString(row?.original?.active_step)}
          </p>
        );
      },
    },
    { header: 'Date Added', accessorKey: 'createdAt' },
    {
      header: 'Action',
      accessorKey: 'actions',
      enableSorting: false,
      cell: renderActionCell,
    },
  ];

  const businessRegistrationAttachments = [
    {
      name: 'Article of association',
      required: true,
    },
    {
      name: 'Resolution',
      required: true,
    },
    {
      name: 'Shareholder attachments',
      required: false,
    },
    {
      name: 'Others',
      required: false,
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-8 px-8 py-12 bg-[#f2f2f2] rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full h-full gap-6 p-6 m-auto bg-white rounded-lg max-md:flex-col ">
          <h3 className="text-base  max-w-[70%]">{description}</h3>
          <img src="/busreg.png" className="h-52 w-52" />
        </menu>
        <section className="flex flex-col w-full gap-6">
          <section className="flex flex-col gap-4 max-md:w-full">
            <h1 className="px-1 text-base font-semibold uppercase">
              Required Attachments for this application
            </h1>
            <menu className="flex items-center justify-between gap-4 p-4 bg-white rounded-md">
              {businessRegistrationAttachments?.map((attachment, index) => {
                return (
                  <li key={index} className="flex items-center gap-2 w-fit">
                    <FontAwesomeIcon icon={faCircle} className="w-1 h-1" />
                    <p className="text-[14px] font-normal flex items-center gap-1">
                      {attachment.name}{' '}
                      <span className="text-[14px]">
                        {attachment.required ? '(Required)' : '(Optional)'}
                      </span>
                    </p>
                  </li>
                );
              })}
            </menu>
          </section>
          <section className="flex flex-col gap-8 max-md:w-full">
            {applicationsInProgress.length > 0 && (
              <menu className="flex flex-col gap-2 max-md:w-full">
                <h1 className="px-2 text-base font-semibold uppercase">
                  Applications in progress
                </h1>
                <Table
                  data={applicationsInProgress}
                  columns={businessRegistrationApplicationColumns}
                  showFilter={false}
                  showPagination={false}
                />
              </menu>
            )}
          </section>
        </section>
        <menu className="flex items-center justify-center">
          <Button
            value={
              <menu className="flex items-center gap-2">
                <p className="text-[14px]">Start Registration</p>
                <FontAwesomeIcon icon={faArrowRight} />
              </menu>
            }
            primary
            onClick={(e) => {
              e.preventDefault();
              if (
                user_applications?.filter(
                  (app: { type: string; status: string }) =>
                    app.type === 'name_reservation' && app.status === 'approved'
                )?.length > 0
              ) {
                dispatch(setSelectReservedNameModal(true));
              } else {
                navigate(path);
                dispatch(setActiveStep('company_details'));
                dispatch(setActiveTab('general_information'));
              }
            }}
          />
        </menu>
      </main>
      <SelectReservedName
        path={path}
        application_type="Business Registration"
        setActiveStep={setActiveStep}
        setActiveTab={setActiveTab}
      />
      <DeleteBusinessApplication />
    </UserLayout>
  );
};

const NewBusinessRegistration = () => {
  return (
    <NewRegistration
      description="You are going to start a business registration process which
      involves 6 steps. Below you will find a list of all documents you will be required to submit during the application process. Feel free to pause the process and
      resume whenever is convenient for you. Your progress will be saved automatically."
      path={`/business-registration?entry_id=${generateUUID()}`}
      setActiveStep={setBusinessActiveStep}
      setActiveTab={setBusinessActiveTab}
    />
  );
};

export default NewBusinessRegistration;
