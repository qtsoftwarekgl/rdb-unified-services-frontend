import Table from "@/components/table/Table";
import { capitalizeString } from "@/helpers/strings";
import { PersonDetail } from "@/types/models/personDetail";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "lucide-react";

type BusinessPeopleTableProps = {
  businessPeopleList: PersonDetail[];
  type: string;
  isLoading: boolean;
  setDeleteAction: (row: PersonDetail) => void;
};

const BusinessPeopleTable = ({
  businessPeopleList,
  type,
  isLoading,
  setDeleteAction,
}: BusinessPeopleTableProps) => {
  // MANAGEMENT PEOPLE COLUMNS
  const managementPeopleColumns = [
    {
      header: "No",
      accessorKey: "no",
    },
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
      cell: ({ row }) => {
        return (
          <menu className="flex items-center justify-center gap-6 w-fit">
            <FontAwesomeIcon
              className={`font-bold text-[16px] ease-in-out duration-300 hover:scale-[1.02] cursor-pointer text-red-600`}
              icon={faTrash}
              onClick={(e) => {
                // TODO: Implement delete functionality
                e.preventDefault();
                setDeleteAction(row?.original);
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
          data={businessPeopleList?.map(
            (person: PersonDetail, index: number) => {
              return {
                ...person,
                no: index + 1,
                position: capitalizeString(person?.roleDescription),
                gender: person?.gender && person?.gender[0],
                name: `${person.firstName} ${person.middleName || ""} ${
                  person.lastName || ""
                }`,
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

export default BusinessPeopleTable;
