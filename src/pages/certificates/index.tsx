import useCompanyCertificate from "./hooks/useCompanyCertificate";
import ListCompanyCertificates from "./ListCompanyCertificates";
import SelectBusiness from "./SelectBusiness";

const BusinessCertificates = () => {
   const {slideIndex, handleBack, handleContinue} = useCompanyCertificate();
      
  return (
    <>
   {slideIndex === 0 &&
    <SelectBusiness handleBack={handleBack} handleContinue={handleContinue} />
   }
   {slideIndex === 1 && 
    <ListCompanyCertificates handleBack={handleBack} handleContinue={handleContinue} />
   }
  </>
  );
}

export default BusinessCertificates;