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
    enterprise_office_address:
      JSON.parse(String(localStorage.getItem("enterprise_office_address"))) ||
      null,
    enterprise_business_activity_vat:
      JSON.parse(
        String(localStorage.getItem("enterprise_business_activity_vat"))
      ) || null,
    enterprise_business_lines:
      JSON.parse(String(localStorage.getItem("enterprise_business_lines"))) ||
      [],
    enterprise_attachments:
      JSON.parse(String(localStorage.getItem("enterprise_attachments"))) ||
      null,
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
    setEnterpriseDetails: (state, action) => {
      state.enterprise_details = action.payload;
      localStorage.setItem(
        "enterprise_details",
        JSON.stringify(action.payload)
      );
    },
    setEnterpriseOfficeAddress: (state, action) => {
      state.enterprise_office_address = action.payload;
      localStorage.setItem(
        "enterprise_office_address",
        JSON.stringify(action.payload)
      );
    },
    setEnterpriseBusinessActivityVat: (state, action) => {
      state.enterprise_business_activity_vat = action.payload;
      localStorage.setItem(
        "enterprise_business_activity_vat",
        JSON.stringify(action.payload)
      );
    },
    setEnterpriseBusinessLines: (state, action) => {
      state.enterprise_business_lines = action.payload;
      localStorage.setItem(
        "enterprise_business_lines",
        JSON.stringify(action.payload)
      );
    },
    setEnterpriseAttachments: (state, action) => {
      state.enterprise_attachments = action.payload;
      localStorage.setItem(
        "enterprise_attachments",
        JSON.stringify(action.payload)
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
        name: "enterprise_details",
      };
      state.enterprise_registration_active_step = {
        label: "Enterprise Details",
        name: "enterprise_details",
      };
      state.enterprise_details = null;
      state.enterprise_office_address = null;
      state.enterprise_business_activity_vat = null;
      state.enterprise_business_lines = [];
      state.enterprise_attachments = null;
      localStorage.removeItem("enterprise_registration_tabs");
      localStorage.removeItem("enterprise_registration_active_tab");
      localStorage.removeItem("enterprise_registration_active_step");
      localStorage.removeItem("enterprise_details");
      localStorage.removeItem("enterprise_office_address");
      localStorage.removeItem("enterprise_business_activity_vat");
      localStorage.removeItem("enterprise_business_lines");
      localStorage.removeItem("enterprise_attachments");
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
  setEnterpriseOfficeAddress,
  setEnterpriseBusinessActivityVat,
  setEnterpriseBusinessLines,
  setEnterpriseAttachments,
  resetToInitialState,
  setUsedIds,
} = enterpriseRegistrationSlice.actions;
