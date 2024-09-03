import { createApi } from "@reduxjs/toolkit/query/react";
import { businessBaseQueryWithReauth } from "./rootApiSlice"

export const nameReservationApiSlice = createApi({
    reducerPath: "nameReservationApi",
    baseQuery: businessBaseQueryWithReauth,
    endpoints: (builder) => {
        return {
            fetchReservedName: builder.query({
                query: ({page, size, status}) => {
                    return {
                        url: `name-reservations/my-reservations?status=${status}`,
                        method: "GET",
                    }
                },
            }),
            fetchReservedNameByCode: builder.query({
                query: ({code}) => {
                    return {
                        url: `name-reservations/all?code=${code}&status=APPROVED`,
                        method: "GET",
                    }
                },
            }),
            fetchReservedNameById: builder.query({
                query: ({id}) => {
                    return {
                        url: `name-reservations/${id}`,
                        method: "GET",
                    }
                },
            }),
        }
}
})

export const {
    useLazyFetchReservedNameQuery,
    useLazyFetchReservedNameByCodeQuery,
    useLazyFetchReservedNameByIdQuery,
} = nameReservationApiSlice;


export default nameReservationApiSlice;