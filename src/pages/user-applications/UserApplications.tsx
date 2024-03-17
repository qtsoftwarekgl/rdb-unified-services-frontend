import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '../../components/table/Table';
import UserLayout from '../../containers/UserLayout';
import Button from '../../components/inputs/Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../states/store';
import { capitalizeString } from '../../helpers/Strings';
import { useNavigate } from 'react-router-dom';

const UserApplications = () => {
  // STATE VARIABLES
  const { user_applications } = useSelector(
    (state: RootState) => state.businessRegistration
  );

  // NAVIGATE
  const navigate = useNavigate();

  const colors = (status: string) => {
    if (status === 'verified') {
      return 'bg-[#82ffa3] text-[#0d7b3e]';
    }
    if (status === 'rejected') {
      return 'bg-[#eac3c3] text-red-500';
    }
    if (status === 'approved') {
      return 'bg-[#cfeaff] text-secondary';
    }
    if (status === 'request for action') {
      return 'bg-[#e4e4e4] text-[#6b6b6b]';
    }
    if (status === 'submitted') {
      return 'bg-[#e8ffef] text-black';
    }
  };
  const colums = [
    {
      header: 'Registration Number',
      accessorKey: 'regNumber',
    },
    {
      header: 'Service Name',
      accessorKey: 'serviceName',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        return (
          <span
            className={`px-3 py-1 rounded-full flex w-fit items-center ${colors(
              row?.original?.status?.toLowerCase()
            )}`}
          >
            <span className=" w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
            <span className="text-sm font-light ">{row?.original.status}</span>
          </span>
        );
      },
    },
    {
      header: 'Submission Date',
      accessorKey: 'submissionDate',
    },
    {
      header: 'Action',
      accessorKey: 'actions',
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2 cursor-pointer">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                navigate(`${row?.original.path}`);
              }}
              icon={faEye}
              className="text-primary"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <section className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between w-full gap-3">
          <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
            My Applications List
          </h1>
          <Button
            primary
            route="/business-registration/new"
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                New application
              </menu>
            }
          />
        </menu>
        {user_applications?.length > 0 ? (
          <Table
            showFilter={false}
            showPagination={false}
            columns={colums}
            data={user_applications?.map((application, index) => {
              return {
                ...application,
                regNumber: `REG-${application?.entry_id
                  ?.split('-')[0]
                  ?.toUpperCase()}`,
                serviceName: capitalizeString(application?.type),
                submissionDate: new Date().toLocaleDateString(),
                path: `/business-registration?entry_id=${application?.entry_id}`,
                status: 'Submitted',
              };
            })}
            className="bg-white rounded-2xl"
          />
        ) : (
          <span className="w-full flex items-center justify-start">
            <h1 className="uppercase text-primary ">
              You have no applications yet
            </h1>
          </span>
        )}
      </section>
    </UserLayout>
  );
};

export default UserApplications;
