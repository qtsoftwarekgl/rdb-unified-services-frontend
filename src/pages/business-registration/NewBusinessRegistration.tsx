import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/inputs/Button";
import UserLayout from "../../containers/UserLayout";
import { formatCompanyData, generateUUID } from "../../helpers/Strings";
import { RootState } from "../../states/store";
import Table from "../../components/table/Table";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { removeFromReservedNames } from "../../states/features/nameReservationSlice";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setUserApplications } from "../../states/features/userApplicationSlice";
import {
  setBusinessActiveStep,
  setBusinessActiveTab,
} from "../../states/features/businessRegistrationSlice";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";

interface NewRegistrationProps {
  description: string;
  path: string;
}

export const NewRegistration = ({
  description,
  path,
}: NewRegistrationProps) => {
  const { reservedNames } = useSelector(
    (state: RootState) => state.nameReservation
  );

  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  console.log(user_applications);

  const applicationsInProgress = user_applications
    .filter(
      (app) =>
        app.status === "in_progress" &&
        path.split("?")[0] === app.path.split("?")[0]
    )
    .map(formatCompanyData);

  const [useReservedNames, setUseReservedNames] = useState(false);
  const [reservedName, setReservedName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reservedNamesCols = [
    {
      header: "Registration Number",
      accessorKey: "registration_number",
    },
    {
      header: "Reserved Name",
      accessorKey: "name",
    },
    {
      header: "Submission Date",
      accessorKey: "created_at",
      cell: ({ row }: { row: any }) => {
        return (
          <span>{moment(row.original.created_at).format("DD/MM/YY")}</span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: { row: any }) => {
        return (
          <menu className="flex items-center gap-2 cursor-pointer">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                setReservedName(row?.original?.name);
                setUseReservedNames(true);
              }}
              icon={faCheck}
              className="text-primary"
            />
          </menu>
        );
      },
    },
  ];

  function renderActionCell({ row }) {
    return (
      <menu className="flex items-center gap-2 cursor-pointer">
        <Button
          value="Resume"
          styled={false}
          className="!bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            if (row?.original?.active_step) {
              dispatch(setBusinessActiveStep(row?.original?.active_step));
            }
            if (row?.original?.active_tab) {
              dispatch(setBusinessActiveTab(row?.original?.active_tab));
            }
            navigate(row?.original?.path);
          }}
        />
      </menu>
    );
  }

  const applicationsInprogressColumns = [
    { header: "Registration Number", accessorKey: "reg_number" },
    { header: "Company Name", accessorKey: "company_name" },
    { header: "Service Name", accessorKey: "service_name" },
    { header: "Submission Date", accessorKey: "submission_date" },
    {
      header: "Action",
      accessorKey: "actions",
      enableSorting: false,
      cell: renderActionCell,
    },
  ];

  const requiredAttachments = [
    {
      name: "Attachment 1",
      description: "Attach a document that shows your business plan",
      max_size: "200kb",
    },
    {
      name: "Attachment 2",
      description: "Attach a document that shows ownership structure",
      max_size: "500kb",
    },
    {
      name: "Attachment 3",
      description: "Attach a document that shows your business plan",
      max_size: "200kb",
    },
    {
      name: "Attachment 4",
      description: "Other documents",
      max_size: "800kb",
    },
  ];


  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-8 px-8 py-12 bg-[#f2f2f2] rounded-md shadow-sm">
        <menu className="flex items-center justify-between w-full h-full gap-6 p-6 m-auto bg-white rounded-lg max-md:flex-col ">
          <h3 className="text-base  max-w-[70%]">{description}</h3>
          <img src="/busreg.png" className="h-52 w-52" />
        </menu>
        <menu className="flex justify-end">
          <Button value="Continue" primary route={path} />
        </menu>
        <section className="flex w-full gap-12 max-md:flex-col">
          <section className="flex flex-col w-1/2 gap-8 max-md:w-full">
            {reservedNames?.length > 0 && (
              <menu className="flex flex-col gap-2 max-md:w-full">
                <h1 className="text-base font-bold">Your Reserved Names</h1>
                <Table
                  data={reservedNames}
                  columns={reservedNamesCols}
                  showFilter={false}
                  showPagination={false}
                  headerClassName="bg-primary text-white"
                  className="bg-white rounded-2xl "
                />
              </menu>
            )}
            {applicationsInProgress.length > 0 && (
              <menu className="flex flex-col gap-2 max-md:w-full">
                <h1 className="pl-2 text-base font-bold">
                  Applications in progress
                </h1>
                <Table
                  data={applicationsInProgress}
                  columns={applicationsInprogressColumns}
                  showFilter={false}
                  showPagination={false}
                  headerClassName="bg-primary text-white"
                  className="bg-white rounded-2xl "
                />
              </menu>
            )}
          </section>
          <section className="flex flex-col w-1/2 gap-4 max-md:w-full">
            <h1 className="text-base font-bold">
              Required Attachments for this application
            </h1>
            <menu className="flex flex-col gap-4 p-8 bg-white rounded-md flex-s">
              {requiredAttachments.map((attachment, index) => {
                return (
                  <menu
                    key={index}
                    className="border flex flex-col gap-4 p-2 rounded-md border-[#f1f1f1]"
                  >
                    <menu className="flex items-center gap-4">
                      <menu className="px-4 py-2 bg-[#ebf9f5] rounded-lg ">
                        <FontAwesomeIcon
                          icon={faFile}
                          className="text-[#4bbe69]"
                        />
                      </menu>
                      <menu>
                        <h3 className="font-semibold">{attachment.name}</h3>
                        <menu className="flex gap-4">
                          <p className="text-[#808080] font-light">
                            {attachment.description}
                          </p>
                          <span>Max size {attachment.max_size}</span>
                        </menu>
                      </menu>
                    </menu>
                  </menu>
                );
              })}
            </menu>
          </section>
        </section>
      </main>
      {useReservedNames && (
        <ConfirmModal
          onClose={() => setUseReservedNames(false)}
          isOpen={!!reservedName}
          onConfirm={(e) => {
            e.preventDefault();
            dispatch(
              setUserApplications({
                entry_id: path?.split("=")[1],
                company_details: {
                  name: reservedName,
                },
              })
            );
            dispatch(removeFromReservedNames(reservedName));
            navigate(path);
            setUseReservedNames(false);
          }}
          description="You are about to use a reserved name for this application"
          message=" Are you sure you want to use this name?"
        >
          <h1 className="text-2xl font-bold">
            Use Reserved Name{" "}
            <span className="text-primary"> ( {reservedName} )</span>
          </h1>
        </ConfirmModal>
      )}
    </UserLayout>
  );
};

const NewBusinessRegistration = () => {
  return (
    <NewRegistration
      description="You are going to start a business registration process which
      involves 6 steps. You may be required to provide documents that you
      do not have at this moment. Feel free to pause the process and
      resume whenever is convenient for you. Your progress will be saved."
      path={`/business-registration?entry_id=${generateUUID()}`}
    />
  );
};

export default NewBusinessRegistration;
