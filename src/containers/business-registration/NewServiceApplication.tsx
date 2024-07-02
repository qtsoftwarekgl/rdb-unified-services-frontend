import Loader from '@/components/Loader';
import Button from '@/components/inputs/Button';
import Table from '@/components/table/Table';
import UserLayout from '@/containers/UserLayout';
import { capitalizeString, formatDate } from '@/helpers/strings';
import DeleteBusinessApplication from '@/pages/business-applications/containers/DeleteBusinessApplication';
import {
  useCreateBusinessMutation,
  useLazyFetchBusinessesQuery,
} from '@/states/api/businessRegApiSlice';
import { useLazyGetServiceQuery } from '@/states/api/coreApiSlice';
import {
  setBusinessesList,
  setBusinessPage,
  setBusinessSize,
  setBusinessTotalElements,
  setBusinessTotalPages,
  setDeleteBusinessModal,
  setSelectedBusiness,
} from '@/states/features/businessSlice';
import { setService } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Business } from '@/types/models/business';
import { faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewServiceApplication = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { service } = useSelector((state: RootState) => state.service);
  const { businessesList, page, size } = useSelector(
    (state: RootState) => state.business
  );

  // GET PARAM FROM PATH
  const { id } = useParams();

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE GET SERVICE QUERY
  const [
    getService,
    {
      data: serviceData,
      isLoading: serviceIsLoading,
      error: serviceError,
      isError: serviceIsError,
      isSuccess: serviceIsSuccess,
    },
  ] = useLazyGetServiceQuery();

  // INITIATE CREATE BUSINESS MUTATION
  const [
    createBusiness,
    {
      isLoading: businessIsLoading,
      data: businessData,
      isError: businessIsError,
      error: businessError,
      isSuccess: businessIsSuccess,
    },
  ] = useCreateBusinessMutation();

  // HANDLE CREATE BUSINESS RESPONSE
  useEffect(() => {
    if (businessIsError) {
      if ((businessError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((businessError as ErrorResponse)?.data?.message);
      }
    } else if (businessIsSuccess) {
      navigate(`${service?.path}?businessId=${businessData?.data?.id}`);
    }
  }, [
    businessData,
    businessError,
    businessIsError,
    businessIsSuccess,
    navigate,
    service?.path,
  ]);

  // INITIALIZE FETCH IN PROGRESS APPLICATIONS QUERY
  const [
    fetchBusinesses,
    {
      data: businessesData,
      isLoading: businessesIsLoading,
      error: businessesError,
      isError: businessesIsError,
      isSuccess: businessesIsSuccess,
    },
  ] = useLazyFetchBusinessesQuery();

  // GET APPLICATIONS IN PROGRESS
  useEffect(() => {
    fetchBusinesses({
      serviceId: id,
      applicationStatus: 'IN_PROGRESS',
      page,
      size,
    });
  }, [fetchBusinesses, id, page, size]);

  // HANDLE APPLICATIONS IN PROGRESS RESPONSE
  useEffect(() => {
    if (businessesIsError) {
      if ((businessesError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((businessesError as ErrorResponse)?.data?.message);
      }
    } else if (businessesIsSuccess) {
      dispatch(setBusinessesList(businessesData?.data?.data));
      dispatch(setBusinessTotalPages(businessesData?.data?.totalPages));
      dispatch(setBusinessTotalElements(businessesData?.data?.totalElements));
    }
  }, [
    businessesData,
    businessesError,
    businessesIsError,
    businessesIsSuccess,
    dispatch,
  ]);

  // FETCH SERVICE
  useEffect(() => {
    if (id) {
      getService({ id });
    }
  }, [getService, id]);

  // HANDLE SERVICE RESPONSE
  useEffect(() => {
    if (serviceIsError) {
      if ((serviceError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((serviceError as ErrorResponse)?.data?.message);
      }
    } else if (serviceIsSuccess) {
      dispatch(setService(serviceData?.data));
    }
  }, [dispatch, serviceData, serviceError, serviceIsError, serviceIsSuccess]);

  // APPLICATIONS IN PROGRESS COLUMNS
  const applicationsInProgressColumns = [
    { header: 'No', accessorKey: 'no' },
    { header: 'Registration Number', accessorKey: 'applicationReferenceId' },
    { header: 'Company Name', accessorKey: 'companyName' },
    {
      header: 'Service Name',
      accessorKey: 'serviceName',
      cell: () => capitalizeString(service?.name),
    },
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
      cell: ({ row }: { row: Row<Business> }) => {
        return (
          <menu className="flex flex-col items-center gap-2 cursor-pointer">
            <Button
              value={
                <menu className="flex bg-primary p-1 px-3 rounded-md items-center gap-1 transition-all duration-200 hover:gap-2">
                  <p className="text-white text-[12px]">Resume</p>
                  <FontAwesomeIcon
                    className="text-[12px] text-white"
                    icon={faArrowRight}
                  />
                </menu>
              }
              onClick={(e) => {
                e.preventDefault();
                navigate(`${service?.path}?businessId=${row.original.id}`);
              }}
              styled={false}
              className="!bg-transparent"
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBusiness(row.original));
                dispatch(setDeleteBusinessModal(true));
              }}
              value={
                <menu className="flex p-1 px-3 bg-red-600 rounded-md items-center gap-1 transition-all duration-200 hover:gap-2">
                  <p className="text-[12px] text-white">Discard</p>
                  <FontAwesomeIcon
                    className="text-[12px] text-white"
                    icon={faTrash}
                  />
                </menu>
              }
              styled={false}
              className="!bg-transparent hover:!bg-transparent !text-red-600 hover:!text-red-600 !shadow-none !p-0"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      {serviceIsLoading && (
        <figure className="min-h-[40vh] flex items-center justify-center bg-white">
          <Loader />
        </figure>
      )}
      {serviceIsSuccess && (
        <main className="flex min-h-[40vh] flex-col w-full gap-8 px-8 py-6 bg-white rounded-md shadow-sm">
          <menu className="flex items-center justify-between w-full h-full gap-6 p-6 m-auto rounded-lg max-md:flex-col ">
            <h3 className="text-center w-full uppercase font-bold">
              {capitalizeString(service?.name)}
            </h3>
          </menu>
          <section className="flex flex-col w-full gap-6">
            <section className="flex flex-col gap-8 max-md:w-full">
              {businessesIsLoading ? (
                <figure className="min-h-[40vh] flex items-center justify-center bg-white">
                  <Loader />
                </figure>
              ) : (
                businessesList &&
                businessesList?.length > 0 && (
                  <menu className="flex flex-col gap-2 max-md:w-full">
                    <h1 className="px-2 text-primary text-base font-semibold uppercase">
                      Applications in progress
                    </h1>
                    <Table
                      setPage={setBusinessPage}
                      setSize={setBusinessSize}
                      data={businessesList?.map(
                        (application: Business, index) => {
                          return {
                            ...application,
                            no: index + 1,
                            service,
                            createdAt: formatDate(
                              application.createdAt
                            ) as unknown as Date,
                            companyName:
                              application?.companyName ||
                              application?.enterpriseBusinessName ||
                              application?.enterpriseName ||
                              'N/A',
                          };
                        }
                      )}
                      columns={applicationsInProgressColumns as ColumnDef<Business>[]}
                      showFilter={false}
                      showPagination={false}
                    />
                  </menu>
                )
              )}
            </section>
          </section>
          <menu className="flex items-center gap-4 justify-center">
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                createBusiness({
                  isForeign: service?.path === '/foreign-company-registration',
                  serviceId: service?.id,
                });
              }}
              value={
                !businessIsLoading ? (
                  <menu className="flex items-center gap-2">
                    <p className="text-[14px]">Start Application</p>
                    <FontAwesomeIcon
                      className="text-[14px]"
                      icon={faArrowRight}
                    />
                  </menu>
                ) : (
                  <Loader />
                )
              }
            />
          </menu>
        </main>
      )}
      <DeleteBusinessApplication />
    </UserLayout>
  );
};

export default NewServiceApplication;
