import Table from '@/components/table/Table';
import { PersonAttachment } from '@/types/models/personAttachment';

type BusinessPeopleAttachmentsProps = {
  attachments: PersonAttachment[];
};

const BusinessPeopleAttachments = ({
  attachments,
}: BusinessPeopleAttachmentsProps) => {
  // ATTACHMENT COLUMNS
  const attachmentColumns = [
    {
      header: 'File Name',
      accessorKey: 'fileName',
    },
    {
      header: 'Attachment Type',
      accessorKey: 'attachmentType',
    },
    {
      header: 'Attachment URL',
      accessorKey: 'attachmentUrl',
    },
    {
      header: 'Attachment Size',
      accessorKey: 'size',
    },
  ];

  if (!attachments.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2 my-4">
      <h1 className="uppercase text-primary text-center font-medium">
        Attachment files
      </h1>
      <Table
        showFilter={false}
        showPagination={false}
        columns={attachmentColumns}
        data={attachments?.map((attachment: PersonAttachment) => {
          return {
            ...attachment,
            fileName: attachment?.fileName || attachment?.name,
            attachmentType: attachment?.attachmentType || attachment?.type,
            attachmentUrl: attachment?.attachmentUrl || attachment?.name,
            size: attachment?.size
              ? `${(attachment.size / (1024 * 1024)).toFixed(2)} MB`
              : 'N/A',
          };
        })}
      />
    </section>
  );
};

export default BusinessPeopleAttachments;
