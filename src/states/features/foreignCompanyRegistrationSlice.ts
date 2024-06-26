import { createSlice } from "@reduxjs/toolkit";

export interface RegistrationStep {
  label: string;
  name: string;
  tab_name: string;
  active: boolean;
  completed: boolean;
}
export interface RegistrationTab {
  no: number;
  label: string;
  name: string;
  active: boolean;
  completed: boolean;
  steps: Array<RegistrationStep>;
}

export const foreign_business_registration_tabs_initial_state: Array<RegistrationTab> =
  [
    {
      no: 1,
      label: "General Information",
      name: "general_information",
      completed: false,
      active: true,
      steps: [
        {
          label: "Company Details",
          name: "company_details",
          tab_name: "general_information",
          active: true,
          completed: false,
        },
        {
          label: "Company Address",
          name: "company_address",
          tab_name: "general_information",
          active: false,
          completed: false,
        },
        {
          label: "Business Activity & VAT",
          name: "business_activity_vat",
          tab_name: "general_information",
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 2,
      label: "Management",
      name: "management",
      active: false,
      completed: false,
      steps: [
        {
          label: "Executive Management",
          name: "executive_management",
          tab_name: "management",
          active: false,
          completed: false,
        },
        {
          label: "Board of Directors",
          name: "board_of_directors",
          tab_name: "management",
          active: false,
          completed: false,
        },
        {
          label: "Employment Info",
          name: "employment_info",
          tab_name: "management",
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 5,
      label: "Attachments",
      name: "attachments",
      completed: false,
      active: false,
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
      no: 6,
      label: "Preview & Submission",
      name: "preview_submission",
      completed: false,
      active: false,
      steps: [
        {
          label: "Preview & Submission",
          name: "preview_submission",
          tab_name: "preview_submission",
          active: false,
          completed: false,
        },
      ],
    },
  ];

export const foreignCompanyRegistrationSlice = createSlice({
  name: "foreignCompanyRegistration",
  initialState: {
    foreign_business_registration_tabs:
      JSON.parse(
        String(localStorage.getItem("foreign_business_registration_tabs"))
      ) || foreign_business_registration_tabs_initial_state,
    foreign_business_active_step: JSON.parse(
      String(localStorage.getItem("business_active_step"))
    ) || {
      label: "Company Details",
      name: "company_details",
    },
    foreign_business_active_tab: JSON.parse(
      String(localStorage.getItem("business_active_tab"))
    ) || {
      label: "General Information",
      name: "general_information",
    },
  },
  reducers: {
    // SET REGISTRATION TABS
    setForeignBusinessRegistrationTabs: (state, action) => {
      state.foreign_business_registration_tabs = action.payload;
      localStorage.setItem(
        "foreign_business_registration_tabs",
        JSON.stringify(action.payload)
      );
    },

    // SET ACTIVE TAB
    setForeignBusinessActiveTab: (state, action) => {
      const updatedRegistrationTabs =
        state.foreign_business_registration_tabs?.map(
          (tab: RegistrationTab) => {
            return {
              ...tab,
              active: false,
            };
          }
        );
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === action.payload
      );
      updatedRegistrationTabs[tabIndex].active = true;
      updatedRegistrationTabs[tabIndex].completed = false;

      // SET ACTIVE TAB TO STATE AND LOCAL STORAGE
      state.foreign_business_active_tab = updatedRegistrationTabs[tabIndex];
      localStorage.setItem(
        "foreign_business_active_tab",
        JSON.stringify(updatedRegistrationTabs[tabIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.foreign_business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "foreign_business_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPLETED TAB
    setForeignBusinessCompletedTab: (state, action) => {
      const updatedRegistrationTabs = state.foreign_business_registration_tabs;
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === action.payload
      );
      updatedRegistrationTabs[tabIndex].completed = true;
      state.foreign_business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "foreign_business_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET ACTIVE STEP
    setForeignBusinessActiveStep: (state, action) => {
      const updatedRegistrationTabs =
        state.foreign_business_registration_tabs?.map(
          (tab: RegistrationTab) => {
            return {
              ...tab,
              steps: tab?.steps?.map((step: RegistrationStep) => {
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
        ?.flatMap((tab: RegistrationTab) => tab?.steps)
        .find((step: RegistrationStep) => step?.name === action.payload);

      console.log(">>>>>>>>>>>>>>>>>>>>>>", action.payload, step);

      // FIND TAB INDEX
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: RegistrationStep) => stepToFind?.name === step?.name
      );

      // SET ACTIVE STEP
      updatedRegistrationTabs[tabIndex].steps[stepIndex].active = true;

      // SET ACTIVE STEP TO STATE AND LOCAL STORAGE
      state.foreign_business_active_step =
        updatedRegistrationTabs[tabIndex].steps[stepIndex];
      localStorage.setItem(
        "foreign_business_active_step",
        JSON.stringify(updatedRegistrationTabs[tabIndex].steps[stepIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.foreign_business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "foreign_business_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPLETED STEP
    setForeignBusinessCompletedStep: (state, action) => {
      const updatedRegistrationTabs =
        state.foreign_business_registration_tabs?.map(
          (tab: RegistrationTab) => {
            return {
              ...tab,
              steps: tab.steps?.map((step: RegistrationStep) => {
                return {
                  ...step,
                };
              }),
            };
          }
        );

      // FIND STEP
      const step = updatedRegistrationTabs
        ?.flatMap((tab: RegistrationTab) => tab?.steps)
        .find((step: RegistrationStep) => step?.name === action.payload);

      // FIND TAB INDEX
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: RegistrationStep) => stepToFind?.name === step?.name
      );

      // SET COMPLETED STEP
      updatedRegistrationTabs[tabIndex].steps[stepIndex].completed = true;

      // SET UPDATED ACTIVE REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.foreign_business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "foreign_business_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // REMOVE COMPLETED STEP
    removeForeignBusinessCompletedStep: (state, action) => {
      const updatedRegistrationTabs =
        state.foreign_business_registration_tabs?.map(
          (tab: RegistrationTab) => {
            return {
              ...tab,
              steps: tab?.steps?.map((step: RegistrationStep) => {
                return {
                  ...step,
                };
              }),
            };
          }
        );

      // FIND STEP
      const step = updatedRegistrationTabs
        ?.flatMap((tab: RegistrationTab) => tab?.steps)
        .find((step: RegistrationStep) => step?.name === action.payload);

      // FIND TAB INDEX
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === step?.tab_name
      );

      // FIND STEP INDEX
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (stepToFind: RegistrationStep) => stepToFind?.name === step?.name
      );

      // SET COMPLETED STEP
      updatedRegistrationTabs[tabIndex].steps[stepIndex].completed = false;

      // SET UPDATED ACTIVE REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.foreign_business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        "foreign_business_registration_tabs",
        JSON.stringify(updatedRegistrationTabs)
      );
    },
  },
});

export default foreignCompanyRegistrationSlice.reducer;

export const {
  setForeignBusinessActiveTab,
  setForeignBusinessActiveStep,
  setForeignBusinessCompletedStep,
  setForeignBusinessCompletedTab,
  removeForeignBusinessCompletedStep,
  setForeignBusinessRegistrationTabs,
} = foreignCompanyRegistrationSlice.actions;
