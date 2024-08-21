import CustomPopover from '@/components/inputs/CustomPopover';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Table from '@/components/table/Table';
import { founderDetailColumns } from '@/constants/founders.constants';
import { capitalizeString } from '@/helpers/strings';
import { FounderDetail } from '@/types/models/personDetail';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import { setFounderDetailsModal, setSelectedFounderDetail } from '@/states/features/founderDetailSlice';
import FounderDetails from './BusinessFounderDetails';

type FounderDetailsTableProps = {
  founderDetailsList: FounderDetail[];
};

const FounderDetailsTable = ({
  founderDetailsList,
}: FounderDetailsTableProps) => {

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // FOUNDER DETAILS COLUMNS
  const founderDetailsExtendedColumns = [
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<FounderDetail> }) => {
        return (
          <CustomPopover
            trigger={
              <menu className="w-full flex items-center justify-center cursor-pointer">
                <CustomTooltip label="Click to view actions">
                  <FontAwesomeIcon
                    className="text-primary cursor-pointer"
                    icon={faEllipsisVertical}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="bg-white flex flex-col gap-1 p-0 rounded-md">
              <Link
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedFounderDetail(row?.original));
                  dispatch(setFounderDetailsModal(true));
                }}
                to={'#'}
              >
                View Details
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
    ...founderDetailColumns,
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      {founderDetailsList?.length <= 0 ? (
        <section className="w-full flex items-center justify-center gap-2">
          <p className="text-primary">No founder details available</p>
        </section>
      ) : (
        <Table
          data={founderDetailsList?.map((founder: FounderDetail) => {
            return {
              ...founder,
              name: `${
                founder?.personDetail?.firstName ||
                founder?.personDetail?.organization?.organizationName ||
                ''
              } ${founder?.personDetail?.middleName || ''} ${
                founder?.personDetail?.lastName || ''
              }`,
              shareHolderType: capitalizeString(founder?.shareHolderType),
              personDocNo: founder?.personDetail?.personDocNo || '-',
              phoneNumber:
                founder?.personDetail?.phoneNumber ||
                founder?.personDetail?.organization?.phone ||
                '-',
            };
          })}
          columns={founderDetailsExtendedColumns as ColumnDef<FounderDetail>[]}
        />
      )}
      <FounderDetails />
    </section>
  );
};

export default FounderDetailsTable;
