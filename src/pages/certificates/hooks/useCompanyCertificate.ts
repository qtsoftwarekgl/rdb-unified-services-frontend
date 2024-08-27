import { useLazyFetchBusinessCertificateQuery } from "@/states/api/businessRegApiSlice";
import { fetchBusinessesThunk, setBusinessCertificates, setCertificatesCompany } from "@/states/features/businessSlice";
import { AppDispatch, RootState } from "@/states/store";
import { Certificate } from "@/types/models/certificate";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function useCompanyCertificate(){
    const navigate = useNavigate();
    const [slideIndex, setSlideIndex] = useState(0);

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue
      } = useForm();

      const {
        businessesList,
        businessesIsFetching,
      } = useSelector((state: RootState) => state.business);

    const dispatch: AppDispatch = useDispatch();

    const handleBack = () => {
        if(slideIndex === 0)
            return navigate("/services");
        else setSlideIndex(slideIndex - 1);
    };

    const handleContinue = () => {
        setSlideIndex(slideIndex + 1);
    }

    useEffect(() => {
    dispatch(
        fetchBusinessesThunk({
        page: 1,
        size: 100,
        // applicationStatus: "APPROVED",
        })
    );
    }, [dispatch]);

    // FETCH BUSINESS CERTIFICATES
    const [
        fetchBusinessCertificates,
        {
            data: certificateListsData,
            isError: certificateListsIsError,
            isFetching: certificateListsIsFetching,
            isSuccess: certificateListsIsSuccess,
            error: fetchError
        }
    ] = useLazyFetchBusinessCertificateQuery();



      const handleSelectBusinessCertificates = (businessId: string) => {
        setValue("businessId", businessId);
        fetchBusinessCertificates({
          id: businessId
        });

        const business = businessesList.find((business) => business.id === businessId);  
        dispatch(setCertificatesCompany(business));
      }

      
      useEffect(() => {
        if(certificateListsIsSuccess){
            dispatch(setBusinessCertificates(certificateListsData?.data?.data));
        }
      },[certificateListsData, certificateListsIsSuccess]);


       const businessCertificates : Certificate[] = certificateListsData;


        return {
            navigate,
            handleSubmit,
            control,
            setValue,
            errors,
            watch,
            businessesList,
            businessesIsFetching,
            slideIndex,
            handleBack,
            handleContinue,
            businessCertificates,
            handleSelectBusinessCertificates,
            certificateListsIsError,
            certificateListsIsFetching,
            fetchError
        }
}
