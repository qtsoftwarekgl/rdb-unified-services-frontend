import { createSlice } from "@reduxjs/toolkit";
import { Step, TabType } from "./types";

export const enterpriseRegistrationSlice = createSlice({
  name: "enterpriseRegistration",
  initialState: {
    enterprise_registration_tabs: JSON.parse(
      String(localStorage.getItem("enterprise_registration_tabs"))
    ) || [
      {
        no: 1,
        label: "Enterprise Details",
        name: "general_information",
        completed: false,
        active: true,
        steps: [
          {
            label: "Enterprise Details",
            name: "company_details",
            tab_name: "general_information",
            active: true,
            completed: false,
          },
          {
            label: "Business Activity & VAT",
            name: "business_activity_vat",
            tab_name: "general_information",
            active: false,
            completed: false,
          },
          {
            label: "Office Address",
            name: "office_address",
            tab_name: "general_information",
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
        steps: [
          {
            label: "Attachments",
            name: "attachments",
            tab_name: "attachments",
            active: false,
            completed: false,
          },
        ],
      },
      {
        no: 3,
        label: "Preview & Submission",
        name: "enterprise_preview_submission",
        completed: false,
        active: false,
        steps: [
          {
            label: "Preview & Submission",
            name: "enterprise_preview_submission",
            tab_name: "enterprise_preview_submission",
            active: false,
            completed: false,
          },
        ],
      },
    ],
    enterprise_registration_active_tab: JSON.parse(
      String(localStorage.getItem("enterprise_registration_active_tab"))
    ) || {
      label: "Enterprise Details",
      name: "general_information",
    },
    enterprise_registration_active_step: JSON.parse(
      String(localStorage.getItem("enterprise_registration_active_step"))
    ) || {
      label: "Enterprise Details",
      name: "company_details",
    },
    isNavigationFromPreview: false,
    usedIds: JSON.parse(String(localStorage.getItem("usedIds"))) || [],
  },
  reducers: {
    setEnterpriseActiveTab: (state, action) => {
      const updatedRegistrationTabs = state.enterprise_registration_tabs.map(
        (tab: TabType) => {
          return {
            ...tab,
            active: false,
          };
        }
      );
      const tabIndex = updatedRegistrationTabs.findIndex(
        (tab: TabType) => tab.name === action.payload
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
        (tab: TabType) => {
          return {
            ...tab,
            steps: tab?.steps?.map((step: Step) => {
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
        ?.flatMap((tab: TabType) => tab?.steps)
        .find((step: TabType) => step?.name === action.payload);

      const tabIndex = updatedRegistrationTabs.findIndex(
        (tab: TabType) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: Step) => stepToFind?.name === step?.name
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
        (tab: TabType) => {
          return {
            ...tab,
            steps: tab.steps?.map((step: Step) => {
              return {
                ...step,
              };
            }),
          };
        }
      );

      // FIND STEP
      const step = updatedRegistrationTabs
        ?.flatMap((tab: TabType) => tab?.steps)
        .find((step: Step) => step?.name === action.payload);

      // FIND TAB INDEX
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: TabType) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: Step) => stepToFind?.name === step?.name
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
        (tab: TabType) => tab?.name === action.payload
      );
      updatedRegistrationTabs[tabIndex].completed = true;
      state.enterprise_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "enterprise_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },
    setUsedIds: (state, action) => {
      state.usedIds.push(action.payload);
      localStorage.setItem("usedIds", JSON.stringify(state.usedIds));
    },
    resetToInitialState: (state) => {
      state.enterprise_registration_tabs = [
        {
          no: 1,
          label: "Enterprise Details",
          name: "general_information",
          completed: false,
          active: true,
          steps: [
            {
              label: "Enterprise Details",
              name: "company_details",
              tab_name: "general_information",
              active: true,
              completed: false,
            },
            {
              label: "Business Activity & VAT",
              name: "business_activity_vat",
              tab_name: "general_information",
              active: false,
              completed: false,
            },
            {
              label: "Office Address",
              name: "office_address",
              tab_name: "general_information",
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
          steps: [
            {
              label: "Attachments",
              name: "attachments",
              tab_name: "attachments",
              active: false,
              completed: false,
            },
          ],
        },
        {
          no: 3,
          label: "Preview & Submission",
          name: "enterprise_preview_submission",
          completed: false,
          active: false,
          steps: [
            {
              label: "Preview & Submission",
              name: "enterprise_preview_submission",
              tab_name: "enterprise_preview_submission",
              active: false,
              completed: false,
            },
          ],
        },
      ];
      state.enterprise_registration_active_tab = {
        label: "Enterprise Details",
        name: "general_information",
      };
      state.enterprise_registration_active_step = {
        label: "Enterprise Details",
        name: "company_details",
      };
    },
  },
});

export default enterpriseRegistrationSlice.reducer;

export const {
  setEnterpriseActiveStep,
  setEnterpriseActiveTab,
  setEnterpriseCompletedStep,
  setEnterpriseCompletedTab,
  resetToInitialState,
  setUsedIds,
} = enterpriseRegistrationSlice.actions;
