import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import { attachmentColumns } from "@/constants/business.constants";
import DeleteBusinessAttachment from "@/containers/business-registration/DeleteBusinessAttachment";
import ViewDocument from "@/pages/user-company-details/ViewDocument";
import {
  setDeleteBusinessAttachmentModal,
  setSelectedBusinessAttachment,
} from "@/states/features/businessSlice";
import { AppDispatch } from "@/states/store";
import {
  BusinessAttachment,
  PersonAttachment,
} from "@/types/models/attachment";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useDispatch } from "react-redux";

type BusinessPeopleAttachmentsProps = {
  attachments: PersonAttachment[] | BusinessAttachment[];
};

const BusinessPeopleAttachments = ({
  attachments,
}: BusinessPeopleAttachmentsProps) => {
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState("");

  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // ATTACHMENT COLUMNS
  const attachmentExtendedColumns = [
    attachmentColumns,
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }: { row: Row<PersonAttachment | BusinessAttachment> }) => {
        return (
          <menu className="flex items-center gap-4">
            <Button
              onClick={(e) => {
                e.preventDefault();
                setPreviewAttachmentUrl(row?.original?.attachmentUrl);
              }}
              value="View"
              styled={false}
              className="cursor-pointer text-primary"
            />
            <FontAwesomeIcon
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setDeleteBusinessAttachmentModal(true));
                dispatch(setSelectedBusinessAttachment(row?.original));
              }}
              className="text-white bg-red-600 p-2 px-[8.5px] text-[13px] rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            />
          </menu>
        );
      },
    },
  ];

  if (!attachments.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 my-4">
      <h1 className="font-medium text-center uppercase text-primary">
        Attachment files
      </h1>
      <Table
        showFilter={false}
        showPagination={false}
        columns={
          attachmentExtendedColumns as ColumnDef<
            PersonAttachment | BusinessAttachment
          >[]
        }
        data={attachments?.map(
          (attachment: PersonAttachment | BusinessAttachment) => {
            return {
              ...attachment,
              fileName: String(attachment?.fileName || attachment?.name),
              attachmentType: String(
                attachment?.attachmentType || attachment?.type
              ),
              attachmentUrl: String(
                attachment?.attachmentUrl || attachment?.name
              ),
              size: String(attachment?.fileSize)
                ? `${(+attachment.fileSize / (1024 * 1024)).toFixed(2)} MB`
                : "N/A",
            };
          }
        )}
      />
      {previewAttachmentUrl && (
        <ViewDocument
          documentUrl={previewAttachmentUrl}
          setDocumentUrl={setPreviewAttachmentUrl}
        />
      )}
      <DeleteBusinessAttachment />
    </section>
  );
};

export default BusinessPeopleAttachments;
