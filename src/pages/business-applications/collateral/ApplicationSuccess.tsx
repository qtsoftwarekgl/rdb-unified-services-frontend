import Modal from "@/components/Modal";
import Button from "@/components/inputs/Button";
import { setCollateralApplications } from "@/states/features/collateralRegistrationSlice";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { FC } from "react";
import { useDispatch } from "react-redux";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resubmit?: boolean;
  isAOMADownloaded?: boolean;
  entry_id: string | null;
};

const ApplicationSuccess: FC<ModalProps> = ({
  isOpen,
  onClose,
  isAOMADownloaded = false,
  entry_id,
}) => {
  const dispatch = useDispatch();
  const handleDownload = () => {
    // Path or URL of the PDF file
    const pdfPath = "/public/BusinessCrt_202104051447207533.pdf";

    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "collateral_aoma_document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    dispatch(
      setCollateralApplications({
        entry_id,
        isAOMADownloaded: true,
        createdAt: moment(Date.now()).format("DD/MM/YYYY"),
        status: "Pending Notarized AOMA and Payment Receipt",
      })
    );
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className="flex flex-col gap-8 p-8">
        <h1 className="text-5xl font-bold text-center">Success!!</h1>
        {!isAOMADownloaded ? (
          <>
            <p>
              Application has been recorded, please click{" "}
              <span className="mr-1 font-semibold">
                the button below to download the AOMA.
              </span>
              After downloading it, please notarize the{" "}
              <span className="mr-1 font-semibold">AOMA</span>
              and perform the payment to submit{" "}
              <span className="mr-1 font-semibold">
                the notarized AOMA
              </span>{" "}
              under the attachments section.
            </p>
            <menu className="flex justify-center gap-4">
              <Button
                primary
                value={
                  <menu className="flex items-center gap-2">
                    <span>Download</span>

                    <FontAwesomeIcon icon={faDownload} />
                  </menu>
                }
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload();
                }}
              />
            </menu>
          </>
        ) : (
          <p>
            Application has been successfully submitted to RDB for review
            process. You will be notified once the application is approved.
          </p>
        )}
      </section>
    </Modal>
  );
};

export default ApplicationSuccess;
