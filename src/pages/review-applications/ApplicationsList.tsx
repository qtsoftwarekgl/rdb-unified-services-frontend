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
  const dispatch = useDispatch();
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
        <span className="text-sm font-light">{row?.original?.status}</span>
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
    { header: 'Company Code', accessorKey: 'reg_number', id: 'company_code' },
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
      id: 'date',
      header: 'Registration Date',
      accessorKey: 'submission_date',
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

  const handleEditClick = (e, row) => {
    e.preventDefault();
    const company = user_applications?.find(
      (application) => application.entry_id === row?.original?.entry_id
    );

    if (!company) return;

    dispatch(setBusinessActiveTab('general_information'));
    dispatch(setBusinessActiveStep('company_details'));

    navigate(row.original?.path);
  };

  return (
    <section className="flex flex-col gap-4 bg-white p-8 rounded-md">
      <h1 className="uppercase text-primary font-semibold">
        {title}
      </h1>
      <section className="flex flex-col h-full rounded-md shadow-sm">
        <h1 className="font-semibold text-center">{description}</h1>
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
          <span className="flex items-center justify-start w-full">
            <h1 className="uppercase text-primary">{notDataMessage}</h1>
          </span>
        )}
      </section>
    </section>
  );
};

export default ApplicatinsList;
