import {
    faCircleInfo,
    faEllipsisVertical,
    faPlus,
    faDownload
  } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import Table from '@/components/table/Table';
  import UserLayout from '@/containers/UserLayout';
  import Button from '@/components/inputs/Button';
  import { useSelector } from 'react-redux';
  import { RootState } from '@/states/store';
  import { Link } from 'react-router-dom';
  import { ColumnDef, Row } from '@tanstack/react-table';
  import {
    setBusinessPage,
    setBusinessSize,
  } from '@/states/features/businessSlice';
  import Loader from '@/components/Loader';
  import CustomPopover from '@/components/inputs/CustomPopover';
  import { certificateColumns } from '@/constants/certificate.constants';
  import useViewCertificate from './hooks/useViewCertificate';
  import ViewCertificate from './ViewCertificate';
  import useRequestCertificate from './hooks/useRequestCertificate';
  import RequestCertificate from './RequestCertificate';
  import { Certificate } from '@/types/models/certificate';
  
  interface Props {
    handleBack: () => void;
    handleContinue?: () => void;
  }

  const ListCompanyCertificates = ({handleBack}: Props) => {
    const { page, size, totalElements, totalPages, businessCertificates } = useSelector(
      (state: RootState) => state.business
    );

    const {showCertificate, setShowCertificate, showFullCertificate, setShowFullCertificate, certificate, setCertificate} = useViewCertificate();
    const {showRequestCertificate, setShowRequestCertificate} = useRequestCertificate()

    const businessesIsFetching = false;
  
    const businessCertificateColumns = [
      ...certificateColumns,
      {
        id: 'action',
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row }: { row: Row<Certificate> }) => {
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
              <menu className="bg-white flex flex-col gap-3 p-0 rounded-md">
                <Link
                  className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    // setShowFullCertificate(false);
                    setCertificate(row.original as any);
                    setShowCertificate(true)
                  }}
                  to={'#'}
                >
                  <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                  View certificate
                </Link>
                {row.original?.businessCertificateType?.includes("REGISTRATION") && 
                <Link
                  className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFullCertificate(true);
                    // setShowCertificate(false);
                    setCertificate(row.original as any);
                    setShowCertificate(true)
                  }}
                  to={'#'}
                >
                  <FontAwesomeIcon className="text-primary" icon={faCircleInfo} />
                  Full certificate
                </Link>
                }
                <Link
                  className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  to={'#'}
                >
                  <FontAwesomeIcon className="text-primary" icon={faDownload} />
                  Download
                </Link>
                
              </menu>
            </CustomPopover>
          );
        },
      },
    ];
  
    return (
      <UserLayout>
        <section className="flex flex-col w-full gap-6 p-8 bg-white rounded-md">
          <menu className="flex items-center justify-between w-full gap-3">
            <h1 className="pl-2 text-lg font-semibold uppercase w-fit text-primary">
              Certificates
            </h1>
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                setShowRequestCertificate(true);
              }
              }
              value={
                <menu className="flex text-[13px] items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  Request Certificate
                </menu>
              }
            />
          </menu>
          {businessesIsFetching ? (
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
              columns={businessCertificateColumns as ColumnDef<Certificate>[]}
              data={businessCertificates?.map((certificate) => {
                return {
                  ...certificate,
                };
              })}
            />
          )}

        <menu className={`flex items-center gap-3 w-full mx-auto justify-between max-sm:flex-col-reverse`}>
            <Button
              value="Back"
              onClick={(e) => {
                e.preventDefault();
                handleBack();
              }}
            />
          </menu>
        </section>
        <ViewCertificate showFullCertificate={showFullCertificate} showCertificate={showCertificate} setShowCertificate={setShowCertificate} certificate={certificate as Certificate} />
        <RequestCertificate showRequestCertificate={showRequestCertificate} setShowRequestCertificate={setShowRequestCertificate} />
      </UserLayout>
    );
  };
  
  export default ListCompanyCertificates;
  