/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLazyGetUserInformationQuery } from "@/states/api/businessExternalServiceApiSlice";
import { useReserveNameMutation } from "@/states/api/nameReservationApiSlice";
import { setNameReservationActiveStep, setNameReservationActiveTab } from "@/states/features/nameReservationSlice";
import { RootState } from "@/states/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface FormData {
    documentType?: string;
    documentNumber?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    gender?: string;
    phoneNumber?: string;
    nameOwner?: 'owner' | 'other';
    street?: string;
    poBox?: string;
    country?: string;
    dateOfBirth?: string;
    persDocIssueDate? : string;
    persDocExpiryDate?: string;
    name: string;
}
export default function useReserveForOther(){
    const dispatch = useDispatch();
    const {owner_details} = useSelector((state: RootState) => state.nameReservation);
    const [
        getUserInformation,
        {
          data: userInformationData,
          error: userInformationError,
          isFetching: userInformationIsFetching,
          isSuccess: userInformationIsSuccess,
          isError: userInformationIsError,
        },
      ] = useLazyGetUserInformationQuery();

      const [
        reserveName,
        {
          data: reserveNameData,
          error: reserveNameError,
          isLoading: reserveNameIsFetching,
          isSuccess: reserveNameIsSuccess,
          isError: reserveNameIsError,
          reset: resetReserveName,
        },
      ] = useReserveNameMutation();
     

    const handleSaveReservedName = async ({companyName}: {companyName: string}) => {
        const payload: FormData = {
            documentType: owner_details?.document_type,
            documentNumber: owner_details?.documentNumber,
            firstName: owner_details?.first_name,
            middleName: owner_details?.middle_name,
            lastName: owner_details?.last_name,
            gender: owner_details?.gender,
            phoneNumber: owner_details?.phone,
            street: owner_details?.street_name,
            poBox: owner_details?.po_box,
            name: companyName,
            nameOwner: owner_details?.name_owner || 'owner',
            country: owner_details?.country,
            dateOfBirth: owner_details?.date_of_birth,
            persDocIssueDate: owner_details?.persDocIssueDate,
            persDocExpiryDate: owner_details?.persDocExpiryDate,
        }

        const response: Record<string,any> = await reserveName(payload);
        console.log("submission response")
        console.log(response);
        if(response?.data?.status){
            dispatch(setNameReservationActiveStep('success'));
            dispatch(setNameReservationActiveTab('complete'));
        }
        else{
            toast.error((reserveNameError as Record<string,any>)?.data?.message || "An error occurred while reserving name");
        }
    }

    return {
        getUserInformation,
        userInformationData,
        userInformationError,
        userInformationIsFetching,
        userInformationIsSuccess,
        userInformationIsError,
        // Mutation variables
        reserveNameData,
        reserveNameError,
        reserveNameIsFetching,
        reserveNameIsSuccess,
        reserveNameIsError,
        handleSaveReservedName,
        resetReserveName
    }
}