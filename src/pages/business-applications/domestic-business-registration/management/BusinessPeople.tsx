import Loader from '@/components/Loader';
import Table from '@/components/table/Table';
import { countriesList } from '@/constants/countries';
import { genderOptions } from '@/constants/inputs.constants';
import { capitalizeString } from '@/helpers/strings';
import { useLazyFetchManagementOrBoardPeopleQuery } from '@/states/api/businessRegApiSlice';
import { setBusinessPeopleList } from '@/states/features/businessPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { businessId } from '@/types/models/business';
import { PersonDetail } from '@/types/models/personDetail';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

type BusinessPeopleProps = {
  type: string;
  businessId: businessId;
};

const BusinessPeople = ({ type, businessId }: BusinessPeopleProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessPeopleList } = useSelector(
    (state: RootState) => state.businessPeople
  );

  // INITIALIZE FETCH MANAGEMENT OR BOARD PEOPLE QUERY
  const [
    fetchBoardPeople,
    {
      data: managementPeopleData,
      error: managementPeopleError,
      isLoading: managementPeopleIsLoading,
      isError: managementPeopleIsError,
      isSuccess: managementPeopleIsSuccess,
    },
  ] = useLazyFetchManagementOrBoardPeopleQuery();

  // FETCH MANAGEMENT PEOPLE
  useEffect(() => {
    fetchBoardPeople({
      businessId,
      route: type === "executiveManagement" ? "management" : "board-member",
    });
  }, [businessId, fetchBoardPeople, type]);

  // HANDLE MANAGEMENT PEOPLE RESPONSE
  useEffect(() => {
    if (managementPeopleIsError) {
      if ((managementPeopleError as ErrorResponse).status === 500) {
        toast.error(
          "An error occured while fetching people. Please try again later"
        );
      } else {
        toast.error((managementPeopleError as ErrorResponse).data?.message);
      }
    } else if (managementPeopleIsSuccess) {
      dispatch(setBusinessPeopleList(managementPeopleData?.data));
    }
  }, [
    dispatch,
    managementPeopleData?.data,
    managementPeopleError,
    managementPeopleIsError,
    managementPeopleIsSuccess,
  ]);

  // MANAGEMENT PEOPLE COLUMNS
  const managementPeopleColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Document No',
      accessorKey: 'personDocNo',
    },
    {
      header: 'Sex',
      accessorKey: 'gender',
    },
    {
      header: "Nationality",
      accessorKey: "nationality",
    },
    {
      header: "Position",
      accessorKey: "position",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: () => {
        return (
          <menu className="flex items-center justify-center gap-6 w-fit">
            <FontAwesomeIcon
              className={`font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02]`}
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <section className="flex flex-col items-center w-full gap-2">
      <h1 className="font-medium uppercase text-primary">
        {type === "executiveManagement"
          ? "Executive Management List"
          : "Board of Directors List"}
      </h1>
      {managementPeopleIsLoading && (
        <figure className="min-h-[40vh] flex items-center justify-center">
          <Loader />
        </figure>
      )}
      {businessPeopleList?.length <= 0 && (
        <p className="text-sm text-center text-gray-500">
          No {type === "executiveManagement" ? "management" : "board"} people
          found
        </p>
      )}
      {managementPeopleIsSuccess && businessPeopleList?.length > 0 && (
        <Table
          data={businessPeopleList?.map(
            (person: PersonDetail) => {
              return {
                ...person,
                position: capitalizeString(person?.roleDescription),
                name: `${person.firstName} ${person.middleName || ""} ${
                  person.lastName || ""
                }`,
                nationality: countriesList?.find((country) => country?.code === person?.nationality)?.name,
                gender: genderOptions?.find((gender) => gender?.value === person?.gender)?.label,
              };
            }
          )}
          columns={managementPeopleColumns}
          showFilter={false}
        />
      )}
    </section>
  );
};

export default BusinessPeople;
