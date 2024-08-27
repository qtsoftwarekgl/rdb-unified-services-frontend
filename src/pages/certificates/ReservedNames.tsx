import {
    faCircleInfo,
    faEllipsisVertical,
  } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import Table from '@/components/table/Table';
  import { Link } from 'react-router-dom';
  import { ColumnDef, Row } from '@tanstack/react-table';
  import {
    setBusinessPage,
    setBusinessSize,
  } from '@/states/features/businessSlice';
  import Loader from '@/components/Loader';
  import CustomPopover from '@/components/inputs/CustomPopover';
  import useViewCertificate from './hooks/useViewCertificate';
import useReservedName from './hooks/useReservedName';
import { reservedNameColumns } from '@/constants/nameReservation.constants';
import { ReservedName } from '@/types/models/reservedName';
import ViewReservedName from './ViewReservedNameCertificate';

const ReservedNames = () => {
  
      const {showReservedName, setShowReservedName, setReservedName, reservedName} = useViewCertificate();
  
      const { page, size, totalElements, totalPages, data, reservedNamesIsFetching } = useReservedName();

      const columns = [
        ...reservedNameColumns,
        {
          id: 'action',
          header: 'Action',
          accessorKey: 'action',
          cell: ({ row }: { row: Row<ReservedName> }) => {
            return (
              <CustomPopover
                trigger={
                  <menu className="flex items-center justify-center w-full gap-2 text-[12px] cursor-pointer">
                    <FontAwesomeIcon
                      className="text-primary text-md p-0 transition-all duration-300 hover:scale-[.98]"
                      icon={faEllipsisVertical}
                    />
                  </menu>
                }
              >
                <menu className="flex flex-col gap-3 p-0 rounded-md">
                  <Link
                    className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      // setShowFullCertificate(false);
                      setReservedName(row.original as ReservedName);
                      setShowReservedName(true)
                    }}
                    to={'#'}
                  >
                    <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                    View certificate
                  </Link>
                </menu>
              </CustomPopover>
            );
          },
        },
      ];
  
      
    return (
        <div className="px-14 py-8">
            <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
              Reserved Names
            </h1>
            
            <section>
            <>
            <section className="flex flex-col w-full gap-6">
            <menu className="flex items-center justify-between w-full gap-3">
            </menu>
            {reservedNamesIsFetching ? (
                <figure className="w-full flex justify-center min-h-[30vh]">
                <Loader className="text-primary" />
                </figure>
            ) : (
                <Table
                totalElements={totalElements}
                totalPages={totalPages}
                page={page}
                size={size}
                setPage={setBusinessPage}
                setSize={setBusinessSize}
                columns={columns as ColumnDef<ReservedName>[]}
                data={data?.map((reservedName: ReservedName) => {
                    return {
                    ...reservedName,
                    };
                })}
                />
            )}
            </section>

            <ViewReservedName showReservedName={showReservedName} setShowReservedName={setShowReservedName} reservedName={reservedName as ReservedName} />
            </>
            </section>
        </div>
    )
}

export default ReservedNames;