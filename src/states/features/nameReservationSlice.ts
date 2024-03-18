import { createSlice } from "@reduxjs/toolkit";
import { Step, TabType } from "./types";

export const nameReservationSlice = createSlice({
  name: "nameReservation",
  initialState: {
    name_reservation_tabs: JSON.parse(
      String(localStorage.getItem("name_reservation_tabs"))
    ) || [
      {
        no: 1,
        label: "Owner Details",
        name: "owner_details",
        active: true,
        steps: [
          {
            label: "Owner Details",
            name: "owner_details",
            tab_name: "owner_details",
            active: true,
            completed: false,
          },
        ],
      },
      {
        no: 1,
        label: "Name Reservation",
        name: "name_reservation",
        active: false,
        steps: [
          {
            label: "Name Reservation",
            name: "name_reservation",
            tab_name: "name_reservation",
            active: true,
            completed: false,
          },
        ],
      },
    ],
    name_reservation_active_tab: JSON.parse(
      String(localStorage.getItem("name_reservation_active_tab"))
    ) || {
      label: "Name Reservation",
      name: "name_reservation",
    },
    name_reservation_active_step: JSON.parse(
      String(localStorage.getItem("name_reservation_active_step"))
    ) || {
      label: "Owner Details",
      name: "owner_details",
    },
    owner_details:
      JSON.parse(String(localStorage.getItem("owner_details"))) || null,
    name_reservation:
      JSON.parse(String(localStorage.getItem("name_reservation"))) || null,
  },

  reducers: {
    setNameReservationActiveTab: (state, action) => {
      const updatedTabs = state.name_reservation_tabs.map((tab: TabType) => {
        return {
          ...tab,
          active: false,
        };
      });
      const tabIndex = updatedTabs.findIndex(
        (tab: TabType) => tab.name === action.payload
      );
      updatedTabs[tabIndex].active = true;

      // SET ACTIVE TAB
      state.name_reservation_active_tab = updatedTabs[tabIndex];
      localStorage.setItem(
        "name_reservation_active_tab",
        JSON.stringify(updatedTabs[tabIndex])
      );

      // SET UPDATED TABS
      state.name_reservation_tabs = updatedTabs;
      localStorage.setItem(
        "name_reservation_tabs",
        JSON.stringify(updatedTabs)
      );
    },
    setNameReservationActiveStep: (state, action) => {
      const updatedTabs = state.name_reservation_tabs.map((tab: TabType) => {
        return {
          ...tab,
          steps: tab.steps.map((step: Step) => {
            return {
              ...step,
              active: false,
            };
          }),
        };
      });

      // FIND STEP
      const step = updatedTabs
        .flatMap((tab: TabType) => tab.steps)
        .find((step: Step) => step.name === action.payload);

      const tabIndex = updatedTabs.findIndex(
        (tab: TabType) => tab.name === step?.tab_name
      );

      const stepIndex = updatedTabs[tabIndex].steps.findIndex(
        (step: Step) => step.name === action.payload
      );

      updatedTabs[tabIndex].steps[stepIndex].active = true;

      // SET ACTIVE STEP
      state.name_reservation_active_step =
        updatedTabs[tabIndex].steps[stepIndex];
      localStorage.setItem(
        "name_reservation_active_step",
        JSON.stringify(updatedTabs[tabIndex].steps[stepIndex])
      );

      // SET UPDATED TABS
      state.name_reservation_tabs = updatedTabs;
      localStorage.setItem(
        "name_reservation_tabs",
        JSON.stringify(updatedTabs)
      );
    },
    setNameReservationCompletedStep: (state, action) => {
      const updatedTabs = state.name_reservation_tabs.map((tab: TabType) => {
        return {
          ...tab,
          steps: tab.steps.map((step: Step) => {
            return {
              ...step,
            };
          }),
        };
      });

      // FIND STEP
      const step = updatedTabs
        .flatMap((tab: TabType) => tab.steps)
        .find((step: Step) => step.name === action.payload);

      const tabIndex = updatedTabs.findIndex(
        (tab: TabType) => tab.name === step?.tab_name
      );

      const stepIndex = updatedTabs[tabIndex].steps.findIndex(
        (step: Step) => step.name === action.payload
      );

      updatedTabs[tabIndex].steps[stepIndex].completed = true;

      // SET UPDATED TABS
      state.name_reservation_tabs = updatedTabs;
      localStorage.setItem(
        "name_reservation_tabs",
        JSON.stringify(updatedTabs)
      );
    },
    setNameReservationOwnerDetails: (state, action) => {
      state.owner_details = action.payload;
      localStorage.setItem("owner_details", JSON.stringify(action.payload));
    },
    setNameReservation: (state, action) => {
      state.name_reservation = action.payload;
      localStorage.setItem("name_reservation", JSON.stringify(action.payload));
    },
    resetToInitialState: (state) => {
      state.name_reservation_tabs = [
        {
          no: 1,
          label: "Name Reservation",
          name: "name_reservation",
          active: true,
          steps: [
            {
              label: "Owner Details",
              name: "owner_details",
              tab_name: "name_reservation",
              active: true,
              completed: false,
            },
            {
              label: "Name Reservation",
              name: "name_reservation",
              tab_name: "name_reservation",
              active: false,
              completed: false,
            },
          ],
        },
      ];
      state.name_reservation_active_tab = {
        label: "Name Reservation",
        name: "name_reservation",
      };
      state.name_reservation_active_step = {
        label: "Owner Details",
        name: "owner_details",
      };
      state.owner_details = null;
      state.name_reservation = null;
      localStorage.removeItem("name_reservation_tabs");
      localStorage.removeItem("name_reservation_active_tab");
      localStorage.removeItem("name_reservation_active_step");
      localStorage.removeItem("owner_details");
      localStorage.removeItem("name_reservation");
    },
  },
});

export default nameReservationSlice.reducer;

export const {
  setNameReservationActiveTab,
  setNameReservationActiveStep,
  setNameReservationCompletedStep,
  setNameReservationOwnerDetails,
  setNameReservation,
  resetToInitialState,
} = nameReservationSlice.actions;
