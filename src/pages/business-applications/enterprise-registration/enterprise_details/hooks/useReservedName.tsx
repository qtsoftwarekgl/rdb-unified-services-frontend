import { useLazyFetchReservedNameByCodeQuery, useLazyFetchReservedNameQuery } from "@/states/api/nameReservationApiSlice";
import { setReservedNames } from "@/states/features/nameReservationSlice";
import { RootState } from "@/states/store";
import { setSelectedReservedName, setShowSelectReservedName, setSkipReservedName } from "@/states/ui/businessRegistrationUISlice";
import { Details } from "@/types/models/business";
import { ReservedName } from "@/types/models/reservedName";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFormContext, useForm } from "react-hook-form"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { z, ZodType } from "zod";

const schema: ZodType = z.object({
    code: z.string().min(1, {message: "Reservation code is required"})
})

export default function useReservedName(){
    // Parent form
    const methods = useFormContext()
    const dispatch = useDispatch();

    // Modal form
    const {register, handleSubmit, setValue, clearErrors ,setError, reset, formState: {errors}} = useForm<{code: string}>({
        resolver: zodResolver(schema)
    })

    const {skipReservedName, showSelectReservedName, selectedReservedName} = useSelector((state: RootState) => state.businessRegistrationUI)
    const {reservedNames, totalElements, totalPages, currentPage} = useSelector((state: RootState) => state.nameReservation)
    const { businessDetails } = useSelector(
        (state: RootState) => state.business
      );

    const [
        fetchReservedNames,
        {
            data: reservedNamesData,
            isSuccess: reservedNamesIsSuccess,
        }
    ] = useLazyFetchReservedNameQuery();

    // query reserved name by id
    // const [
    //     fetchReservedNameById,
    // ] = useLazyFetchReservedNameByIdQuery();

    // query reserved name by code
    const [
        fetchReservedNameByCode,
    ] = useLazyFetchReservedNameByCodeQuery();
    
    const enterpriseBusinessName = methods?.getValues()?.enterpriseBusinessName;

    useEffect(() => {
        if(businessDetails && businessDetails.reservationId){
            dispatch(setShowSelectReservedName(false))
        }
        else if(businessDetails !== undefined && businessDetails !== null && !enterpriseBusinessName && !skipReservedName && !businessDetails?.enterpriseBusinessName){
            dispatch(setShowSelectReservedName(true))
        } else {
            // dispatch(setShowSelectReservedName(false))
        }
    }, [enterpriseBusinessName, skipReservedName, dispatch, businessDetails])

    const setEnterpriseBusinessName = (name: ReservedName) => {
        dispatch(setSelectedReservedName(name))
        methods?.clearErrors('enterpriseBusinessName')
        methods?.setValue('enterpriseBusinessName', name.name)
        methods?.setValue('reservationId', name.id)
    }

    const handleSkip = () => {
        methods?.setValue('enterpriseBusinessName', '')
        methods?.setValue('reservationId', null)
        dispatch(setShowSelectReservedName(false))
        dispatch(setSelectedReservedName(null))
        dispatch(setSkipReservedName(true))
    }

    useEffect(() => {
        fetchReservedNames({status: 'APPROVED'})
    }
    , [])

    useEffect(() => {
        if(reservedNamesData && reservedNamesIsSuccess){
            dispatch(setReservedNames(reservedNamesData?.data || []))
        }
    }, [reservedNamesData, reservedNamesIsSuccess])


    const onSubmit =  async (data: {code: string}) => {
        const nameAlreadyFetched = reservedNames.find((name: ReservedName) => name.code === data.code)
        if(nameAlreadyFetched){
            setEnterpriseBusinessName(nameAlreadyFetched.name)
            return;
        }
        else {
        const response = await fetchReservedNameByCode({code: data.code})
        if(response.data?.data?.totalElements > 0){
            reset();
            // Get reserved names in the store and on the top of them add the new reserved name, secondly mark the new reserved name as selected
            const newReservedNames = [response.data.data.data[0], ...reservedNames]
            const payload = {
                totalPages,
                currentPage,
                totalElements,
                data: newReservedNames,
            }

            dispatch(setReservedNames(payload))
            // setEnterpriseBusinessName(response.data.data.data[0].name)
            setEnterpriseBusinessName(response.data.data.data[0].name)

        }
        else{
            setError('code', {message: "No reserved name found"})
        }
        }
    }

   const handleSetDefaultSelectedReservedName = (businessDetails: Details, reservedNames: ReservedName[]) => {
        if(businessDetails && reservedNames){
            if(!businessDetails?.reservationId) return;
            const selectedReservedName = reservedNames.find((name: ReservedName) => name.id === businessDetails.reservationId)
            if(selectedReservedName){
                setEnterpriseBusinessName(selectedReservedName)
            }
            // get reservation name by id and set it as selected also add it to the reserved names
            // fetchReservedNameById({id: businessDetails.reservationId})
            // .then((response) => {
            //     if(response.data?.data){
            //         const newReservedNames = [response.data.data, ...reservedNames]
            //         const payload = {
            //             totalPages,
            //             currentPage,
            //             totalElements: totalElements + 1,
            //             data: newReservedNames,
            //         }
            //         // dispatch(setReservedNames(payload))
            //     }
            // }
            // )
        }
   }

    return {
        showSelectReservedName,
        setShowSelectReservedName,
        setEnterpriseBusinessName,
        handleSkip,
        skipReservedName,
        reservedNames,
        register,
        handleSubmit,
        onSubmit,
        setValue,
        errors,
        clearErrors,
        selectedReservedName,
        handleSetDefaultSelectedReservedName
    }
}