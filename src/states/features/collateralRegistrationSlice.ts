import { createSlice } from "@reduxjs/toolkit";
import { Step, TabType } from "../../types/navigationTypes";

export const collateral_registration_tabs_initial_state: Array<TabType> = [
  {
    no: 1,
    label: "Debtor",
    name: "debtor_information",
    active: true,
    completed: false,
    review_group_tabs: ["mortgage"],
    steps: [
      {
        label: "Debtor Information",
        name: "debtor_information",
        active: true,
        completed: false,
        tab_name: "debtor_information",
      },
    ],
  },
  {
    no: 2,
    label: "Collateral Information",
    name: "collateral_information",
    active: false,
    completed: false,
    review_group_tabs: ["property", "mortgage"],
    steps: [
      {
        label: "Collateral Information",
        name: "collateral_information",
        active: false,
        completed: false,
        tab_name: "collateral_information",
      },
    ],
  },
  {
    no: 3,
    label: "Attachments",
    name: "attachments",
    active: false,
    completed: false,
    review_group_tabs: ["aoma", "attachments"],
    steps: [
      {
        label: "Attachments",
        name: "attachments",
        active: false,
        completed: false,
        tab_name: "attachments",
      },
    ],
  },
  {
    no: 4,
    label: "Preview",
    name: "preview",
    active: false,
    completed: false,
    steps: [
      {
        label: "Preview & Submission",
        name: "preview",
        active: false,
        completed: false,
        tab_name: "preview",
      },
    ],
  },
];

export const collateralRegistrationSlice = createSlice({
  name: "collateralRegistration",
  initialState: {
    collateral_registration_tabs:
      JSON.parse(
        String(localStorage.getItem("collateral_registration_tabs"))
      ) || collateral_registration_tabs_initial_state,
    collateral_active_tab: JSON.parse(
      String(localStorage.getItem("collateral_active_tab"))
    ) || { label: "Debtor", name: "debtor" },
    collateral_active_step: JSON.parse(
      String(localStorage.getItem("collateral_active_step"))
    ) || { label: "Debtor Information", name: "debtor_information" },
    collateral_applications:
      JSON.parse(String(localStorage.getItem("collateral_applications"))) || [],
  },
  reducers: {
    setCollateralApplications: (state, action) => {
      const applicationIndex = state.collateral_applications.findIndex(
        (app) => app.entryId === action?.payload?.entryId
      );

      if (applicationIndex === -1) {
        state.collateral_applications = [
          ...state.collateral_applications,
          action.payload,
        ];
      } else {
        state.collateral_applications[applicationIndex] = {
          ...state.collateral_applications[applicationIndex],
          ...action.payload,
        };
      }
      localStorage.setItem(
        "collateral_applications",
        JSON.stringify(state.collateral_applications)
      );
    },
    setCollateralStatus: (state, action) => {
      const applicationIndex = state.collateral_applications.findIndex(
        (app) => app.entryId === action?.payload?.entryId
      );

      if (applicationIndex !== -1) {
        const collateralApplication = {
          ...state.collateral_applications[
            applicationIndex
          ].collateral_infos.find(
            (collateral) =>
              collateral.collateral_id === action.payload.collateral_id
          ),
        };
        collateralApplication.status = action.payload.status;

        state.collateral_applications[applicationIndex].collateral_infos = [
          ...state.collateral_applications[applicationIndex].collateral_infos,
          collateralApplication,
        ];

        localStorage.setItem(
          "collateral_applications",
          JSON.stringify(state.collateral_applications)
        );
      }
    },
    setCollateralRegistrationTabs: (state, action) => {
      state.collateral_registration_tabs = action.payload;
      localStorage.setItem(
        "collateral_registration_tabs",
        JSON.stringify(action.payload)
      );
    },
    setCollateralActiveTab: (state, action) => {
      const updatedColateralTabs = state.collateral_registration_tabs.map(
        (tab: TabType) => {
          return { ...tab, active: false };
        }
      );
      const tabIndex = updatedColateralTabs.findIndex(
        (tab: TabType) => tab.name === action.payload
      );
      updatedColateralTabs[tabIndex].active = true;
      state.collateral_active_tab = updatedColateralTabs[tabIndex];
      localStorage.setItem(
        "collateral_active_tab",
        JSON.stringify(updatedColateralTabs[tabIndex])
      );
      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.collateral_registration_tabs = updatedColateralTabs;
      localStorage.setItem(
        "collateral_registration_tabs",
        JSON.stringify(updatedColateralTabs)
      );
    },
    setCollateralActiveStep: (state, action) => {
      const updatedColateralTabs = state.collateral_registration_tabs.map(
        (tab: TabType) => {
          const updatedSteps = tab?.steps.map((step) => {
            return { ...step, active: false };
          });
          return { ...tab, steps: updatedSteps };
        }
      );

      // FIND STEP
      const step = updatedColateralTabs
        .flatMap((tab: TabType) => tab.steps)
        .find((step: Step) => step?.name === action?.payload);
      const activeTabIndex = updatedColateralTabs.findIndex(
        (tab: TabType) => tab?.name === step?.tab_name
      );

      // FIND ACTIVE STEP
      const stepIndex = updatedColateralTabs[activeTabIndex]?.steps.findIndex(
        (stepToFind: Step) => stepToFind?.name === step?.name
      );

      // UPDATE STEP
      updatedColateralTabs[activeTabIndex].steps[stepIndex].active = true;

      state.collateral_active_step =
        updatedColateralTabs[activeTabIndex]?.steps[stepIndex];
      localStorage.setItem(
        "collateral_active_step",
        JSON.stringify(updatedColateralTabs[activeTabIndex]?.steps[stepIndex])
      );

      // SET UPDATED TABS
      state.collateral_registration_tabs = updatedColateralTabs;
      localStorage.setItem(
        "collateral_registration_tabs",
        JSON.stringify(updatedColateralTabs)
      );
    },
    setCollateralCompletedTab: (state, action) => {
      const updatedColateralTabs = state.collateral_registration_tabs;
      const tabIndex = updatedColateralTabs.findIndex(
        (tab: TabType) => tab?.name === action.payload
      );
      updatedColateralTabs[tabIndex].completed = true;
      state.collateral_registration_tabs = updatedColateralTabs;
      localStorage.setItem(
        "collateral_registration_tabs",
        JSON.stringify(updatedColateralTabs)
      );
    },
    setCollateralCompletedStep: (state, action) => {
      const updatedColateralTabs = state.collateral_registration_tabs.map(
        (tab: TabType) => {
          const updatedSteps = tab.steps.map((step) => {
            return { ...step, completed: false };
          });
          return { ...tab, steps: updatedSteps };
        }
      );

      // FIND STEP
      const step = updatedColateralTabs
        .flatMap((tab: TabType) => tab.steps)
        .find((step: Step) => step.name === action.payload);

      // FIND  TAB
      const activeTabIndex = updatedColateralTabs.findIndex(
        (tab: TabType) => tab?.name === step?.tab_name
      );

      // FIND  STEP INDEX
      const stepIndex = updatedColateralTabs[activeTabIndex]?.steps.findIndex(
        (stepToFind: Step) => stepToFind?.name === step?.name
      );

      updatedColateralTabs[activeTabIndex].steps[stepIndex].completed = true;

      state.collateral_registration_tabs = updatedColateralTabs;
      localStorage.setItem(
        "collateral_registration_tabs",
        JSON.stringify(updatedColateralTabs)
      );
    },
  },
});

export default collateralRegistrationSlice.reducer;

export const {
  setCollateralRegistrationTabs,
  setCollateralActiveTab,
  setCollateralActiveStep,
  setCollateralCompletedTab,
  setCollateralCompletedStep,
  setCollateralApplications,
  setCollateralStatus,
} = collateralRegistrationSlice.actions;
