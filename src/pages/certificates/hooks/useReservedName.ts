import { useLazyFetchReservedNameQuery } from "@/states/api/nameReservationApiSlice";
import { setReservedNames } from "@/states/features/nameReservationSlice";
import { RootState } from "@/states/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useReservedName() {

const dispatch = useDispatch();

const { page, size, totalElements, totalPages, reservedNames:data } = useSelector(
  (state: RootState) => state.nameReservation
);

const [
    fetchReservedNames,
    {
        data: reservedNamesData,
        isError: reservedNamesIsError,
        isFetching: reservedNamesIsFetching,
        isSuccess: reservedNamesIsSuccess,
        error: fetchError
    }
] = useLazyFetchReservedNameQuery();

  useEffect(() => {
    fetchReservedNames({status: "APPROVED"});
  },[]);


  useEffect(() => {
   if(reservedNamesData?.status){
    dispatch(setReservedNames(reservedNamesData.data));
   }
  },[reservedNamesData]);
    
  return {
    data,
    page,
    size,
    totalElements,
    totalPages,
    reservedNamesIsFetching,
    reservedNamesIsError,
    reservedNamesIsSuccess,
    fetchError
  };
}