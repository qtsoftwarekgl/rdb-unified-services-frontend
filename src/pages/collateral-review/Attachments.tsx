import { FC, useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

type AttachementsProps = {
  loan_attachments: object[];
};

const Attachements: FC<AttachementsProps> = ({ loan_attachments }) => {
  const [attachments, setAttachments] = useState<object[]>();
  const [activeAttachment, setActiveAttachment] = useState({});

  useEffect(() => {
    setActiveAttachment(loan_attachments[0]);
    setAttachments(loan_attachments);
  }, []);

  return (
    <section className="flex  bg-[#f2f2f2]">
      <menu className="flex flex-col w-[30%] gap-2 p-2 ">
        {attachments &&
          attachments.map((attachment, index) => {
            return (
              <button
                key={attachment.id}
                className={`p-2 text-left text-[14px] hover:bg-primary hover:text-white rounded truncate ${
                  attachment.active ? "bg-primary text-white" : "bg-white"
                }`}
                onClick={() => {
                  const updatedAttachments = attachments.map((att) => {
                    if (att.id === attachment.id) {
                      setActiveAttachment(att);
                      return {
                        ...att,
                        active: !att.active,
                      };
                    }
                    return { ...att, active: false };
                  });
                  setAttachments(updatedAttachments);
                }}
              >
                {attachment?.name || `Attachment-${index + 1}`}
              </button>
            );
          })}
      </menu>
      <menu className="w-[80%]">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={activeAttachment.url} />
        </Worker>
      </menu>
    </section>
  );
};

export default Attachements;
