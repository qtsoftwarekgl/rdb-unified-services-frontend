import Modal from "@/components/Modal"
import useViewCertificate from "./hooks/useViewCertificate";
import { useEffect } from "react";
import { ReservedName } from "@/types/models/reservedName";

interface Props {
    showReservedName: boolean;
    reservedName: ReservedName;
    setShowReservedName: (show: boolean) => void;
}
const ViewReservedName = ({showReservedName, reservedName, setShowReservedName}: Props) => {
    const {loadReservedNameCertificate, reservedNameCertificateUrl} = useViewCertificate();
    useEffect(() => {
        if(showReservedName){
            loadReservedNameCertificate(reservedName);
        }
    }, [reservedName, showReservedName]);
    return (
        <Modal 
         isOpen={showReservedName}
         onClose={() => setShowReservedName(false)}
         className="min-w-[70%]"
        >
          {reservedNameCertificateUrl && (
          <iframe
            src={reservedNameCertificateUrl}
            title="Certificate"
            width="100%"
            height="500px"
          ></iframe>
        )}
        </Modal>
    );
}

export default ViewReservedName;