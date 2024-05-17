import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import Table from '../../components/table/Table';
import { RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from '../../states/features/businessRegistrationSlice';
import Button from '../../components/inputs/Button';
import { Row } from '@tanstack/react-table';
import RowSelectionCheckbox from '@/components/table/RowSelectionCheckbox';
import RegistrationApplicationCard from '@/components/cards/RegistrationApplicationCard';
import { capitalizeString } from '@/helpers/strings';
import {
  setApproveApplicationModal,
  setSelectedApplication,
} from '@/states/features/userApplicationSlice';
import ApproveApplication from './ApproveApplication';
import { useEffect, useState } from 'react';

type Props = {
  title: string;
  description: string;
  notDataMessage: string;
  actionIcon?: IconDefinition;
  handleClickAction: () => void;
  data: Array<object>;
};

const ApplicatinsList = ({
  title,
  description,
  notDataMessage,
  data,
  handleClickAction,
}: Props) => {
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  // RETURN A RANDOM VALUE BETWEEN 45 AND 150
  const randomValue = () => Math.floor(Math.random() * (150 - 45 + 1) + 45);

  // STATE VARIABLES
  const dispatch = useDispatch();
  const [selectedViewOption, setSelectedViewOption] = useState('mine');
  const [applicationValue, setApplicationValue] = useState(randomValue());

  // ALTER THE VALUE AS OPTION SELECTED CHANGES
  useEffect(() => {
    setApplicationValue(randomValue());
  }, [selectedViewOption]);

  // NAVIGATION
  const navigate = useNavigate();

  // Render status cell
  const renderStatusCell = ({ row }) => {
    const statusColors = {
      Verified: 'bg-[#82ffa3] text-[#0d7b3e]',
      Rejected: 'bg-[#eac3c3] text-red-500',
      approved: 'bg-[#e8ffef] text-[#409261]',
      'Action Required': 'bg-[#e4e4e4] text-[#6b6b6b]',
      Submitted: 'bg-[#e8ffef] text-black',
    };
    const statusColor = statusColors[row?.original?.status] || '';
    return (
      <span
        className={`px-3 py-1 rounded-full flex w-fit items-center ${statusColor}`}
      >
        <span className="w-[6px] h-[6px] rounded-full bg-current mr-2"></span>
        <span className="text-sm font-light">
          {capitalizeString(row?.original?.status)}
        </span>
      </span>
    );
  };

  const renderActionCell = ({ row }) => {
    return (
      <menu className="flex items-center gap-2">
        <Button
          onClick={(e) => {
            handleEditClick(e, row);
            handleClickAction();
          }}
          value="Review"
          styled={false}
          className="cursor-pointer text-primary"
        />
      </menu>
    );
  };

  // TABLE COLUMNS
  const columns = [
    {
      id: 'no',
      accessorKey: 'no',
      header: ({ table }) => {
        return <RowSelectionCheckbox isHeader table={table} />;
      },
      cell: ({
        row,
      }: {
        row: Row<{
          name: string;
          image: string;
        }>;
      }) => {
        return <RowSelectionCheckbox row={row} />;
      },
    },
    {
      header: 'Reference No',
      accessorKey: 'reference_no',
      id: 'reference_no',
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: 'company_name',
      header: 'Company/Enterprise Name',
      accessorKey: 'company_name',
      enableFiltering: true,
    },
    {
      id: 'service_name',
      header: 'Application Type',
      accessorKey: 'service_name',
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
      enableFiltering: true,
      cell: ({ row }) => {
        return (
          <p className="text-[13px]">
            {capitalizeString(row?.original?.service_name)}
          </p>
        );
      },
    },
    {
      id: 'status',
      header: 'Application Status',
      accessorKey: 'status',
      cell: renderStatusCell,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
      enableFiltering: true,
    },
    {
      id: 'assignee',
      header: 'Assignee',
      accessorKey: 'assignee',
      cell: () => `RDB Verifier`,
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
      enableFiltering: true,
    },
    {
      id: 'date',
      header: 'Registration Date',
      accessorKey: 'createdAt',
      filterFn: (row: Row<unknown>, id: string, value: string) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      header: 'Action',
      accessorKey: 'action',
      enableSorting: false,
      cell: renderActionCell,
    },
  ];

  // APPLICATIONS LIST
  const applicationsList = [
    {
      label: 'Pending for your action',
      value: 24,
      status: 'submitted',
    },
    {
      label: 'Submitted for approval',
      value: 38,
      status: 'pending_approval',
    },
    {
      label: 'Requested for action',
      value: 18,
      status: 'action_required',
    },
    {
      label: 'Completed',
      value: 90,
      status: 'approved',
    },
  ];

  const handleEditClick = (e, row) => {
    e.preventDefault();
    const company = user_applications?.find(
      (application) => application.entry_id === row?.original?.entry_id
    );

    if (!company) return;

    if (company?.type !== 'business_registration') {
      dispatch(setSelectedApplication(company));
      dispatch(setApproveApplicationModal(true));
      return;
    }
    dispatch(setBusinessActiveTab('preview_submission'));
    dispatch(setBusinessActiveStep('preview_submission'));

    navigate(row.original?.path);
  };

  // ASSIGNEE VIEW OPTIONS
  const assigneeViewOptions = [
    {
      label: 'Assigned to me',
      value: 'mine',
    },
    {
      label: 'All Applications',
      value: 'all',
    },
  ];

  return (
    <section className="flex flex-col gap-4 p-8 bg-white rounded-md">
      <h1 className="font-semibold uppercase text-primary">{title}</h1>
      <menu className="flex items-center gap-4 w-full">
        {assigneeViewOptions?.map((option, index) => {
          return (
            <Button
              className="w-full"
              key={index}
              value={option?.label}
              primary={option?.value === selectedViewOption}
              onClick={(e) => {
                e.preventDefault();
                setSelectedViewOption(option?.value);
              }}
            />
          );
        })}
      </menu>
      <section className="flex flex-col h-full rounded-md shadow-sm">
        <h1 className="font-semibold text-center">{description}</h1>
        <menu className="flex flex-wrap items-start gap-6">
          {applicationsList.map((application, index) => {
            return (
              <RegistrationApplicationCard
                label={application?.label}
                value={applicationValue}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`?status=${application?.status}`);
                }}
              />
            );
          })}
        </menu>
        {data.length > 0 ? (
          <Table
            showExport
            columns={columns}
            data={data}
            className="bg-white rounded-xl"
            showFilter={true}
            showPagination={true}
            columnsToExport={columns
              ?.map((column) => column?.accessorKey)
              ?.filter((column) => column !== 'action')}
          />
        ) : (
          <span className="flex items-center justify-center w-full min-h-[20vh]">
            <h1 className="uppercase text-primary font-semibold">
              {notDataMessage}
            </h1>
          </span>
        )}
      </section>
      <ApproveApplication />
    </section>
  );
};

export default ApplicatinsList;
