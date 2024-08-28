import { ECertificateType } from "@/helpers/certificate/enums";
import { generateBusAmendmentCertificatePdf } from "@/helpers/certificate/templates/busAmendment";
import { generateBusRegistrationDomesticCertificatePdf } from "@/helpers/certificate/templates/busRegistrationDomestic";
import { generateBusRegistrationForeignCertificatePdf } from "@/helpers/certificate/templates/busRegistrationForeign";
import { generateNameReservationCertificatePdf } from "@/helpers/certificate/templates/nameReservation";
import { useCreateCertificateRequestMutation, useLazyFetchBusinessCertificateByIdQuery, useLazyFetchFullBusinessCertificateByIdQuery } from "@/states/api/businessRegApiSlice";
import { Certificate } from "@/types/models/certificate";
import { ReservedName } from "@/types/models/reservedName";
import { useEffect, useState } from "react";


export default function useViewCertificate(){
   const [showCertificate, setShowCertificate] = useState(false);
   const [certificate, setCertificate] = useState<Certificate>();
   const [showFullCertificate, setShowFullCertificate] = useState(false);
   const [pdfUrl, setPdfUrl] = useState<string>();
   const [reservedName, setReservedName] = useState<ReservedName>();
   const [reservedNameCertificateUrl, setReservedNameCertificateUrl] = useState<string>();
   const [showReservedName, setShowReservedName] = useState(false);

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

const [
   createCertificateRequest,
   {
     isLoading: isRequesting,
     data: requestData,
     isError: requestError,
     error: requestErrorData,
     isSuccess: requestSuccess,
   },
 ] = useCreateCertificateRequestMutation();

   const loadCertificate = async (certificate: Certificate) => {
      const response = await fetchBusinessCertificateById({id: certificate.id});

      if(response?.data?.status){
         if(
            response?.data?.data?.certificateType === ECertificateType.DISSOLUTION_DOMESTIC 
            || response?.data?.data?.certificateType === ECertificateType.DISSOLUTION_FOREIGN
            || response?.data?.data?.certificateType === ECertificateType.CONFIRMATION_OF_DORMANCY_DOMESTIC
            || response?.data?.data?.certificateType === ECertificateType.CONFIRMATION_OF_DORMANCY_FOREIGN
            || response?.data?.data?.certificateType === ECertificateType.CONFIRMATION_OF_DORMANCY_ENTERPRISE
            || response?.data?.data?.certificateType === ECertificateType.CESSATION_OF_DORMANCY_DOMESTIC
            || response?.data?.data?.certificateType === ECertificateType.CESSATION_OF_DORMANCY_FOREIGN
         
         ){
            const url = generateBusAmendmentCertificatePdf(response?.data?.data);
            setPdfUrl(url);
          }
          else if(response?.data?.data?.certificateType === ECertificateType.FOREIGN_COMPANY_REGISTRATION){
            const url = generateBusRegistrationForeignCertificatePdf(response?.data?.data, false);
            setPdfUrl(url);
          }
          else{
            const url = generateBusRegistrationDomesticCertificatePdf(response?.data?.data, false);
            setPdfUrl(url);
      } 
   }
}

   const loadFullCertificate = async (certificate: Certificate) => {
      const response = await fetchFullBusinessCertificateById({id: certificate.id});
      if(response?.data?.status){
         if(response?.data?.data?.certificateType === ECertificateType.FOREIGN_COMPANY_REGISTRATION){
            const url = generateBusRegistrationForeignCertificatePdf(response?.data?.data, true);
            setPdfUrl(url);
         }
         else{
         const url = generateBusRegistrationDomesticCertificatePdf(response?.data?.data, true);
         setPdfUrl(url);
         }
      }
   }

   const loadReservedNameCertificate = (reservedName: ReservedName) => {
      createCertificateRequest({
         businessId: false,
         endpoint: 'name-reservation',
         reservationId: reservedName.id,
      })
   }

   useEffect(() => {
     if(requestSuccess && requestData){
     const url = generateNameReservationCertificatePdf(requestData?.data);
     setReservedNameCertificateUrl(url);
     }
   },[requestSuccess, requestData, requestError, requestErrorData]);

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
    setShowFullCertificate,
    reservedName,
    setReservedName,
    loadReservedNameCertificate,
    reservedNameCertificateUrl,
    showReservedName,
    setShowReservedName,
    certificateDetails,
    fullCertificateDetails,
    isRequesting,
    requestSuccess,
    requestError,
    requestErrorData,
    isFetchingFullCertificateDetailsError,
    isFetchingCertificateDetailsError,
    fetchError,
    isFetchingFullCertificateDetails,
    isSuccessFullCertificateDetails,
    isSuccessCertificateDetails,
    fetchFullError
   }
}