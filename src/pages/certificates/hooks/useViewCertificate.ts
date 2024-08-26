import { ECertificateType } from "@/helpers/certificate/enums";
import { generateBusAmendmentCertificatePdf } from "@/helpers/certificate/templates/busAmendment";
import { generateBusRegistrationCertificatePdf } from "@/helpers/certificate/templates/busRegistration";
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
      console.log("loading a regular certificate")
      fetchBusinessCertificateById({id: certificate.id});      
   }

   const loadFullCertificate = (certificate: Certificate) => {
      console.log("loading full certificate")
      // fetchFullBusinessCertificateById({id: certificate.id});
   }

   // const url = generateBusRegistrationCertificatePdf(certificate);
   //    setPdfUrl(url);

   useEffect(() => {
      if(isSuccessCertificateDetails && isSuccessCertificateDetails){

         console.log("certificateDetails", certificateDetails);

       if(
         certificateDetails?.data?.certificateType === ECertificateType.DISSOLUTION_DOMESTIC 
         || certificateDetails?.data?.certificateType === ECertificateType.DISSOLUTION_FOREIGN
         || certificateDetails?.data?.certificateType === ECertificateType.CONFIRMATION_OF_DORMANCY_DOMESTIC
         || certificateDetails?.data?.certificateType === ECertificateType.CONFIRMATION_OF_DORMANCY_FOREIGN
         || certificateDetails?.data?.certificateType === ECertificateType.CONFIRMATION_OF_DORMANCY_ENTERPRISE
         || certificateDetails?.data?.certificateType === ECertificateType.CESSATION_OF_DORMANCY_DOMESTIC
         || certificateDetails?.data?.certificateType === ECertificateType.CESSATION_OF_DORMANCY_FOREIGN
      
      ){
         console.log("====== Printing Dissolution Certificate=====");
         const url = generateBusAmendmentCertificatePdf(certificateDetails?.data);
         setPdfUrl(url);
       }
       else{
         console.log("====== Printing Registration Certificate=====");
         const url = generateBusRegistrationCertificatePdf(certificateDetails?.data, false);
         setPdfUrl(url);

      }
   }
     
   },[certificateDetails, isSuccessCertificateDetails]);

   useEffect(() => {
      if(isSuccessFullCertificateDetails && isSuccessFullCertificateDetails){
         const url = generateBusRegistrationCertificatePdf(fullCertificateDetails?.data, true);
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