import { generateCertificatePdf } from "@/helpers/certificate/generateTemplate";
import { useLazyFetchBusinessCertificateByIdQuery, useLazyFetchFullBusinessCertificateByIdQuery } from "@/states/api/businessRegApiSlice";
import { Certificate } from "@/types/models/certificate";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function useViewCertificate(){
   const [showCertificate, setShowCertificate] = useState(false);
   const [certificate, setCertificate] = useState<Certificate>();
   const [showFullCertificate, setShowFullCertificate] = useState(false);
   const [pdfUrl, setPdfUrl] = useState<string>();

   const [
      fetchBusinessCertificateById,
      {
          data: certificateDetails,
          isError: isFetchingCertificateDetailsError,
          isFetching: isFetchingCertificateDetails,
          isSuccess: isSuccessCertificateDetails,
          error: fetchError
      }
  ] = useLazyFetchBusinessCertificateByIdQuery();

  // fetch full certificate 
  const [
   fetchFullBusinessCertificateById,
   {
       data: fullCertificateDetails,
       isError: isFetchingFullCertificateDetailsError,
       isFetching: isFetchingFullCertificateDetails,
       isSuccess: isSuccessFullCertificateDetails,
       error: fetchFullError
   }
] = useLazyFetchFullBusinessCertificateByIdQuery();

   const loadCertificate = (certificate: Certificate) => {
      fetchBusinessCertificateById({id: certificate.id});      
   }

   const loadFullCertificate = (certificate: Certificate) => {
      fetchFullBusinessCertificateById({id: certificate.id});
   }

   // const url = generateCertificatePdf(certificate);
   //    setPdfUrl(url);

   useEffect(() => {
      if(isSuccessCertificateDetails && isSuccessCertificateDetails){
         const url = generateCertificatePdf(certificateDetails?.data, false);
         setPdfUrl(url);
      }
     
   },[certificateDetails, isSuccessCertificateDetails]);

   useEffect(() => {
      if(isSuccessFullCertificateDetails && isSuccessFullCertificateDetails){
         const url = generateCertificatePdf(fullCertificateDetails?.data, true);
         setPdfUrl(url);
      }
     
   },[fullCertificateDetails, isSuccessFullCertificateDetails]);

   console.log("Certificate Details", certificateDetails);

   return {
    showCertificate,
    setShowCertificate,
    certificate,
    setCertificate,
    loadCertificate,
    loadFullCertificate,
    certificatePdfUrl: pdfUrl,
    isLoading: isFetchingCertificateDetails,
    showFullCertificate,
    setShowFullCertificate
   }
}