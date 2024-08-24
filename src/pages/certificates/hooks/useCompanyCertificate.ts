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
    // const { page, size, totalElements, totalPages } = useSelector(
    //     (state: RootState) => state.business
    //   );

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
        getValues
      } = useForm();
      const {
        businessesList,
        businessesIsFetching,
      } = useSelector((state: RootState) => state.business);

    const dispatch: AppDispatch = useDispatch();

    const {businessId} = getValues();

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
        applicationStatus: "APPROVED",
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

    useEffect(() => {
        if(!businessId) return;
        fetchBusinessCertificates({
          id: businessId
        });

        // filter from businessList where id === businessId and dispatch it to store by setCertificatesCompany
        const business = businessesList.find((business) => business.id === businessId);  
        dispatch(setCertificatesCompany(business));

      }, [businessId]);

      console.log("BusinessId:  "+businessId)
      console.log(watch("businessId"));
      console.log(getValues());

      useEffect(() => {
        if(certificateListsIsSuccess){
            dispatch(setBusinessCertificates(certificateListsData?.data?.data));
        }
      },[certificateListsData]);

      console.log(certificateListsData);
      console.log(certificateListsIsFetching);
        console.log(certificateListsIsSuccess);
        console.log(certificateListsIsError);
        console.log(fetchError);



       const businessCertificates : Certificate[] = certificateListsData;


        return {
            navigate,
            handleSubmit,
            control,
            errors,
            watch,
            businessesList,
            businessesIsFetching,
            slideIndex,
            handleBack,
            handleContinue,
            businessCertificates,
            
        }
}
