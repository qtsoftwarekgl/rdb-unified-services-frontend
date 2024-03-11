import { useTranslation } from "react-i18next";
import UserLayout from "../../containers/UserLayout";
import Table from "../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { companyDocuments } from "../../constants/Dashboard";
import { useState } from "react";
import ViewDocument from "./ViewDocument";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import CreateAmendment from "./CreateAmendment";

const CompanyDocuments = () => {
  const { t } = useTranslation();
  const [documentToView, setDocumentToView] = useState("");

  const columns = [
    {
      header: "Document Type",
      accessorKey: "documentType",
      filter: true,
    },
    {
      header: "Document Name",
      accessorKey: "documentName",
    },
    {
      header: "Date",
      accessorKey: "issuedDate",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2 cursor-pointer">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                setDocumentToView(row?.original?.documentUrl);
              }}
              icon={faEye}
              className="text-primary"
            />
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                window.open(row?.original?.documentUrl, "_blank");
              }}
              icon={faDownload}
              className="text-white bg-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full "
            />
          </menu>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex justify-between">
          <h1 className="mb-8 text-2xl font-medium text-center text-black ">
            {t("company documents")}
          </h1>
          <CreateAmendment />
        </menu>
        <section className="p-2">
          <Table
            data={companyDocuments}
            columns={columns}
            className="bg-white rounded-t-2xl"
          />
        </section>
        {documentToView && (
          <ViewDocument
            documentUrl={documentToView}
            setDocumentUrl={setDocumentToView}
          />
        )}
      </main>
    </UserLayout>
  );
};

export default CompanyDocuments;
