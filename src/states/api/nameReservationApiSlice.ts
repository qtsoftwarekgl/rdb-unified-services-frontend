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
        }
}
})

export const {
    useLazyFetchReservedNameQuery,
} = nameReservationApiSlice;


export default nameReservationApiSlice;