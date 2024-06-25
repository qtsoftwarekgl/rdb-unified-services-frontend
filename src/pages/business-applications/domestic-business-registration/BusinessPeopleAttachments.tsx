import Button from "@/components/inputs/Button";
import Table from "@/components/table/Table";
import ViewDocument from "@/pages/user-company-details/ViewDocument";
import {
  BusinessAttachment,
  PersonAttachment,
} from "@/types/models/personAttachment";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type BusinessPeopleAttachmentsProps = {
  attachments: PersonAttachment[] | BusinessAttachment[];
};

const BusinessPeopleAttachments = ({
  attachments,
}: BusinessPeopleAttachmentsProps) => {
  const [previewAttachmentUrl, setPreviewAttachmentUrl] = useState("");
  // ATTACHMENT COLUMNS
  const attachmentColumns = [
    {
      header: "File Name",
      accessorKey: "fileName",
    },
    {
      header: "Attachment Type",
      accessorKey: "attachmentType",
    },
    // {
    //   header: "Attachment URL",
    //   accessorKey: "attachmentUrl",
    // },
    {
      header: "Attachment Size",
      accessorKey: "size",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
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
        columns={attachmentColumns}
        data={attachments?.map(
          (attachment: PersonAttachment | BusinessAttachment) => {
            return {
              ...attachment,
              fileName: attachment?.fileName || attachment?.name,
              attachmentType: attachment?.attachmentType || attachment?.type,
              attachmentUrl: attachment?.attachmentUrl || attachment?.name,
              size: attachment?.fileSize
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
    </section>
  );
};

export default BusinessPeopleAttachments;
