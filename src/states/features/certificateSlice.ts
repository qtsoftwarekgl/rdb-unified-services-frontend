import { TabType } from "@/types/navigationTypes";
import { createSlice } from "@reduxjs/toolkit";

export const certificateSlice = createSlice({
    name: "certificate",
    initialState: {
        certificate_tabs: JSON.parse(
            String(localStorage.getItem("certificate_tabs"))
        ) || [
            {
                no: 1,
                label: "Business",
                name: "business_certificates",
                active: true,
                steps: []
            },
            {
                no: 2,
                label: "Name Reservation",
                name: "name_reservation_certificate",
                active: false,
                steps: []
            },
        ],
        certificate_active_tab: JSON.parse(
            String(localStorage.getItem("certificate_active_tab"))
        ) || {
            label: "Business",
            name: "business_certificates",
        },
    },
    reducers: {
        setCertificateActiveTab: (state, action) => {
            state.certificate_tabs.forEach((tab: TabType) => {
                tab.active = tab.name === action.payload.name;
            });
            state.certificate_active_tab = action.payload;
            localStorage.setItem(
                "certificate_tabs",
                JSON.stringify(state.certificate_tabs)
            );
            localStorage.setItem(
                "certificate_active_tab",
                JSON.stringify(state.certificate_active_tab)
            );
        },
    },
});

export const { setCertificateActiveTab } = certificateSlice.actions;
export default certificateSlice.reducer;