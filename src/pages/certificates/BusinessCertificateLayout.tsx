import useCompanyCertificate from "./hooks/useCompanyCertificate";
import ListCompanyCertificates from "./ListCompanyCertificates"
import SelectBusiness from "./SelectBusiness"

const BusinessCertificateLayout = () => {
   const {slideIndex, handleBack, handleContinue} = useCompanyCertificate();

   
    return (
       <section>
         {slideIndex === 0 &&
                <SelectBusiness handleBack={handleBack} handleContinue={handleContinue} />
            }
            {slideIndex === 1 && 
                <ListCompanyCertificates handleBack={handleBack} handleContinue={handleContinue} />
            }
       </section>
    )
}

export default BusinessCertificateLayout;