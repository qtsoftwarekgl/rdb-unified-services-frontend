import CustomTooltip from "@/components/inputs/CustomTooltip";
import Table from "@/components/table/Table";
import { countriesList } from "@/constants/countries";
import { genderOptions } from "@/constants/inputs.constants";
import { capitalizeString } from "@/helpers/strings";
import {
  setDeleteBusinessPersonModal,
  setSelectedBusinessPerson,
} from "@/states/features/businessPeopleSlice";
import { setBusinessPersonDetailsModal } from "@/states/features/businessPeopleSlice";
import { AppDispatch } from "@/states/store";
import { PersonDetail } from "@/types/models/personDetail";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { useDispatch } from "react-redux";

type BusinessPeopleTableProps = {
  businessPeopleList: PersonDetail[];
  type: string;
  isLoading: boolean;
};

const BusinessPeopleTable = ({
  businessPeopleList,
  type,
  isLoading,
}: BusinessPeopleTableProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // MANAGEMENT PEOPLE COLUMNS
  const managementPeopleColumns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Document No",
      accessorKey: "personDocNo",
    },
    {
      header: "Sex",
      accessorKey: "gender",
    },
    {
      header: "Nationality",
      accessorKey: "nationality",
    },
    {
      header: "Position",
      accessorKey: "roleDescription",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: { row: Row<PersonDetail> }) => {
        return (
          <menu className="flex items-center justify-center gap-6 w-fit">
            <CustomTooltip label=" view details">
              <FontAwesomeIcon
                className={`font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02] cursor-pointer text-primary`}
                icon={faEye}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedBusinessPerson(row?.original));
                  dispatch(setBusinessPersonDetailsModal(true));
                }}
              />
            </CustomTooltip>
            <CustomTooltip label="Delete">
              <FontAwesomeIcon
                className={`font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02] cursor-pointer text-red-600`}
                icon={faTrash}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedBusinessPerson(row?.original));
                  dispatch(setDeleteBusinessPersonModal(true));
                }}
              />
            </CustomTooltip>
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
      {!isLoading && businessPeopleList?.length <= 0 && (
        <p className="text-sm text-center text-gray-500">
          No {type === "executiveManagement" ? "management" : "board"} people
          found
        </p>
      )}
      {isLoading && (
        <figure className="flex items-center justify-center">
          <Loader />
        </figure>
      )}
      {!isLoading && (
        <Table
          data={businessPeopleList?.map((person: PersonDetail) => {
            return {
              ...person,
              roleDescription: capitalizeString(person?.roleDescription),
              gender: genderOptions?.find((g) => g?.value === person?.gender)
                ?.label,
              nationality: countriesList?.find(
                (country) => country?.code === person?.nationality
              )?.name,
              name: `${person.firstName} ${person.middleName || ""} ${
                person.lastName || ""
              }`,
            };
          })}
          columns={
            managementPeopleColumns as ColumnDef<Row<PersonDetail>, unknown>[]
          }
          showFilter={false}
        />
      )}
    </section>
  );
};

export default BusinessPeopleTable;
