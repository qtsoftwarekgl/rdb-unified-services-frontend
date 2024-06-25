import { useTranslation } from "react-i18next";
import UserLayout from "../../containers/UserLayout";
import Table from "../../components/table/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { companyDocuments } from "../../constants/dashboard";
import { useEffect, useState } from "react";
import ViewDocument from "./ViewDocument";
import { faBackward, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../states/store";
import Button from "@/components/inputs/Button";

const CompanyDocuments = () => {
  const { t } = useTranslation();
  const [documentToView, setDocumentToView] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );
  const navigate = useNavigate();

  const columns = [
    {
      header: "Document Type",
      accessorKey: "documentType",
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
                setDocumentToView(row?.original?.document_url);
              }}
              icon={faEye}
              className="text-primary"
            />
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                window.open(row?.original?.document_url, "_blank");
              }}
              icon={faDownload}
              className="text-white bg-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-2 text-[14px] flex items-center justify-center rounded-full "
            />
          </menu>
        );
      },
    },
  ];

  useEffect(() => {
    return () => {
      dispatch(setViewedCompany(null));
    };
  }, [id, dispatch, user_applications]);

  return (
    <UserLayout>
      <main className="flex flex-col w-full gap-6 p-4 md:px-32 md:py-16 bg-[#f2f2f2] rounded-md">
        <menu className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-center text-black ">
            {t("company documents")}
          </h1>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              navigate("/user-applications");
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBackward} />
                Back
              </menu>
            }
          />
        </menu>
        <section className="p-2">
          <Table
            data={companyDocuments}
            columns={columns}
            rowClickHandler={undefined}
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
