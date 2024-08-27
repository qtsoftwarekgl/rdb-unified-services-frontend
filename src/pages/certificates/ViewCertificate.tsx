import Modal from "@/components/Modal"
import { Certificate } from "@/types/models/certificate";
import useViewCertificate from "./hooks/useViewCertificate";
import { useEffect } from "react";

interface Props {
    showCertificate: boolean;
    showFullCertificate: boolean;
    setShowCertificate: (show: boolean) => void;
    certificate: Certificate;

}
const ViewCertificate = ({showCertificate, showFullCertificate, setShowCertificate, certificate}: Props) => {
    const {loadCertificate, loadFullCertificate, certificatePdfUrl} = useViewCertificate();
    useEffect(() => {
        if(showCertificate){
            if(showFullCertificate){
                loadFullCertificate(certificate)
            }
            else{
                loadCertificate(certificate);
            }
        }
    }, [certificate, showCertificate, showFullCertificate]);
    return (
        <Modal 
         isOpen={showCertificate}
         onClose={() => setShowCertificate(false)}
         className="min-w-[70%]"
        >
          {certificatePdfUrl && (
          <iframe
            src={certificatePdfUrl}
            title="Certificate"
            width="100%"
            height="500px"
          ></iframe>
        )}
        </Modal>
    );
}

export default ViewCertificate;