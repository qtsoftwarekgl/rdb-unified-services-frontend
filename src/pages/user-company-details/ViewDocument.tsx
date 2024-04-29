import { Dispatch, SetStateAction } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Modal from "../../components/Modal";

interface ViewDocumentProps {
  documentUrl: string;
  setDocumentUrl: Dispatch<SetStateAction<string>> | Dispatch<SetStateAction<string | null>>;
}

const ViewDocument = ({ documentUrl, setDocumentUrl }: ViewDocumentProps) => {
  return (
    <Modal
      className="overflow-auto "
      isOpen={documentUrl !== ""}
      onClose={() => setDocumentUrl("")}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={documentUrl} />
      </Worker>
    </Modal>
  );
};

export default ViewDocument;
