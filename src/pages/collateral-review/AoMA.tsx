import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { FC } from "react";

type AoMAProps = {
  documentUrl: string;
};

const AoMA: FC<AoMAProps> = ({ documentUrl }) => {
  return (
    <section>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={documentUrl} />
      </Worker>
    </section>
  );
};

export default AoMA;
