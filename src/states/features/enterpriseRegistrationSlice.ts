import { createSlice } from "@reduxjs/toolkit";

export interface EnterpriseRegistrationStep {
  label: string;
  name: string;
  tab_name: string;
  active: boolean;
  completed: boolean;
}

export interface EnterpriseRegistrationTab {
  no: number;
  label: string;
  name: string;
  active: boolean;
  steps: Array<EnterpriseRegistrationStep>;
}

export const enterpriseRegistrationSlice = createSlice({
  name: "enterpriseRegistration",
  initialState: {
    enterprise_registration_tabs: JSON.parse(
      String(localStorage.getItem("enterprise_registration_tabs"))
    ) || [
      {
        no: 1,
        label: "Enterprise Details",
        name: "enterprise_details",
        completed: false,
        active: true,
        steps: [
          {
            label: "Enterprise Details",
            name: "enterprise_details",
            tab_name: "enterprise_details",
            active: true,
            completed: false,
          },
          {
            label: "Business Activity & VAT",
            name: "business_activity_vat",
            tab_name: "enterprise_details",
            active: false,
            completed: false,
          },
          {
            label: "Office Address",
            name: "office_address",
            tab_name: "enterprise_details",
            active: false,
            completed: false,
          },
        ],
      },
      {
        no: 2,
        label: "Attachments",
        name: "attachments",
        active: false,
        completed: false,
      },
      {
        no: 3,
        label: "Preview & Submission",
        name: "preview_submission",
        completed: false,
        active: false,
      },
    ],
    enterprise_registration_active_tab: JSON.parse(
      String(localStorage.getItem("enterprise_registration_active_tab"))
    ) || {
      label: "Enterprise Details",
      name: "enterprise_details",
    },
    enterprise_registration_active_step: JSON.parse(
      String(localStorage.getItem("enterprise_registration_active_step"))
    ) || {
      label: "Enterprise Details",
      name: "enterprise_details",
    },
    enterprise_details:
      JSON.parse(String(localStorage.getItem("enterprise_details"))) || null,
  },
  reducers: {
    setEnterpriseActiveTab: (state, action) => {
      const updatedRegistrationTabs = state.enterprise_registration_tabs.map(
        (tab: EnterpriseRegistrationTab) => {
          return {
            ...tab,
            active: false,
          };
        }
      );
      const tabIndex = updatedRegistrationTabs.findIndex(
        (tab: EnterpriseRegistrationTab) => tab.name === action.payload
      );

      updatedRegistrationTabs[tabIndex].active = true;

      // SET ACTIVE TAB TO STATE AND LOCAL STORAGE
      state.enterprise_registration_active_tab =
        updatedRegistrationTabs[tabIndex];
      localStorage.setItem(
        "enterprise_registration_active_tab",
        JSON.stringify(updatedRegistrationTabs[tabIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.enterprise_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "enterprise_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },
    setEnterpriseActiveStep: (state, action) => {
      const updatedRegistrationTabs = state.enterprise_registration_tabs?.map(
        (tab: EnterpriseRegistrationTab) => {
          return {
            ...tab,
            steps: tab?.steps?.map((step: EnterpriseRegistrationStep) => {
              return {
                ...step,
                active: false,
              };
            }),
          };
        }
      );

      // FIND STEP
      const step = updatedRegistrationTabs
        ?.flatMap((tab: EnterpriseRegistrationTab) => tab?.steps)
        .find(
          (step: EnterpriseRegistrationStep) => step?.name === action.payload
        );

      const tabIndex = updatedRegistrationTabs.findIndex(
        (tab: EnterpriseRegistrationTab) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: EnterpriseRegistrationStep) =>
          stepToFind?.name === step?.name
      );

      updatedRegistrationTabs[tabIndex].steps[stepIndex].active = true;

      // SET ACTIVE STEP TO STATE AND LOCAL STORAGE
      state.enterprise_registration_active_step =
        updatedRegistrationTabs[tabIndex].steps[stepIndex];

      localStorage.setItem(
        "enterprise_registration_active_step",
        JSON.stringify(updatedRegistrationTabs[tabIndex].steps[stepIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.enterprise_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "enterprise_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },
    setEnterpriseCompletedStep: (state, action) => {
      const updatedRegistrationTabs = state.enterprise_registration_tabs?.map(
        (tab: EnterpriseRegistrationTab) => {
          return {
            ...tab,
            steps: tab.steps?.map((step: EnterpriseRegistrationStep) => {
              return {
                ...step,
                completed: false,
              };
            }),
          };
        }
      );

      // FIND STEP
      const step = updatedRegistrationTabs
        ?.flatMap((tab: EnterpriseRegistrationTab) => tab?.steps)
        .find(
          (step: EnterpriseRegistrationStep) => step?.name === action.payload
        );

      // FIND TAB INDEX
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: EnterpriseRegistrationTab) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: EnterpriseRegistrationStep) =>
          stepToFind?.name === step?.name
      );

      // SET COMPLETED STEP
      updatedRegistrationTabs[tabIndex].steps[stepIndex].completed = true;

      // SET COMPLETED STEP TO STATE AND LOCAL STORAGE
      state.enterprise_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "enterprise_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    setEnterpriseCompletedTab: (state, action) => {
      const updatedRegistrationTabs = state.enterprise_registration_tabs;
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: EnterpriseRegistrationTab) => tab?.name === action.payload
      );
      updatedRegistrationTabs[tabIndex].completed = true;
      state.enterprise_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "enterprise_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },
    setEnterpriseDetails: (state, action) => {
      state.enterprise_details = action.payload;
      localStorage.setItem(
        "enterprise_details",
        JSON.stringify(action.payload)
      );
    },
  },
});

export default enterpriseRegistrationSlice.reducer;

export const {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
  setEnterpriseCompletedTab,
  setEnterpriseDetails,
} = enterpriseRegistrationSlice.actions;
