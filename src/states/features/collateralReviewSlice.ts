import { createSlice } from "@reduxjs/toolkit";
import { Step, TabType } from "../../types/navigationTypes";

const initialCollateralReviewTabs = [
  {
    no: 1,
    label: "Property",
    name: "property",
    active: true,
    completed: false,
    steps: [
      {
        label: "Property Information",
        name: "property",
        active: true,
        completed: false,
        tab_name: "property",
      },
    ],
  },
  {
    no: 2,
    label: "Mortgage",
    name: "mortgage",
    active: false,
    completed: false,
    steps: [
      {
        label: "Mortgage Information",
        name: "mortgage",
        active: false,
        completed: false,
        tab_name: "mortgage",
        collateral_application_group_tab: "collateral_informationl",
      },
    ],
  },
  {
    no: 3,
    label: "AoMA",
    name: "aoma",
    active: false,
    completed: false,
    steps: [
      {
        label: "AoMA Information",
        name: "aoma",
        active: false,
        completed: false,
        tab_name: "aoma",
        collateral_application_group_tab: "attachments",
      },
    ],
  },
  {
    no: 4,
    label: "Attachments",
    name: "attachments",
    active: false,
    completed: false,
    steps: [
      {
        label: "Attachments",
        name: "attachments",
        active: false,
        completed: false,
        tab_name: "attachments",
        collateral_application_group_tab: "attachments",
      },
    ],
  },
  {
    no: 5,
    label: "Mortage History",
    name: "mortgage_history",
    active: false,
    completed: false,
    steps: [
      {
        label: "Mortage History",
        name: "mortgage_history",
        active: false,
        completed: false,
        tab_name: "mortgage_history",
      },
    ],
  },
];

export const collateralReviewSlice = createSlice({
  name: "collateralReview",
  initialState: {
    collateral_review_tabs:
      JSON.parse(String(localStorage.getItem("collateral_review_tabs"))) ||
      initialCollateralReviewTabs,
    collateral_review_active_tab:
      JSON.parse(
        String(localStorage.getItem("collateral_review_active_tab"))
      ) || initialCollateralReviewTabs[0],
    collateral_review_active_step:
      JSON.parse(
        String(localStorage.getItem("collateral_review_active_step"))
      ) || initialCollateralReviewTabs[0].steps[0],
  },
  reducers: {
    setCollateralReviewTabs: (state, action) => {
      state.collateral_review_tabs = action.payload;

      localStorage.setItem(
        "collateral_review_tabs",
        JSON.stringify(action.payload)
      );
    },
    setCollateralReviewActiveTab: (state, action) => {
      const updatedCollateralTabs = state.collateral_review_tabs.map(
        (tab: TabType) => {
          return { ...tab, active: false };
        }
      );

      // FIND TAB INDEX
      const tabIndex = updatedCollateralTabs.findIndex(
        (tab: TabType) => tab.name === action.payload
      );

      // SET ACTIVE TAB
      updatedCollateralTabs[tabIndex].active = true;
      state.collateral_review_active_tab = updatedCollateralTabs[tabIndex];
      localStorage.setItem(
        "collateral_review_active_tab",
        JSON.stringify(updatedCollateralTabs[tabIndex])
      );

      // SET TABs
      state.collateral_review_tabs = updatedCollateralTabs;
      localStorage.setItem(
        "collateral_review_tabs",
        JSON.stringify(updatedCollateralTabs)
      );
    },
    setCollateralReviewActiveStep: (state, action) => {
      const updatedCollateralTabs = state.collateral_review_tabs.map(
        (tab: TabType) => {
          const updatedSteps = tab.steps.map((step) => {
            return { ...step, active: false };
          });
          return { ...tab, steps: updatedSteps };
        }
      );

      const step = updatedCollateralTabs
        .flatMap((tab: TabType) => tab.steps)
        .find((step: Step) => step?.name === action?.payload);

      const activeTabIndex = updatedCollateralTabs.findIndex(
        (tab: TabType) => tab?.name === step?.tab_name
      );

      const stepIndex = updatedCollateralTabs[activeTabIndex]?.steps.findIndex(
        (stepToFind: Step) => stepToFind?.name === step?.name
      );

      updatedCollateralTabs[activeTabIndex].steps[stepIndex].active = true;

      state.collateral_review_active_step =
        updatedCollateralTabs[activeTabIndex]?.steps[stepIndex];
      localStorage.setItem(
        "collateral_review_active_step",
        JSON.stringify(updatedCollateralTabs[activeTabIndex]?.steps[stepIndex])
      );

      state.collateral_review_tabs = updatedCollateralTabs;
      localStorage.setItem(
        "collateral_review_tabs",
        JSON.stringify(updatedCollateralTabs)
      );
    },

    setCollateralReviewCompletedStep: (state, action) => {
      const updatedCollateralTabs = state.collateral_review_tabs.map(
        (tab: TabType) => {
          const updatedSteps = tab.steps.map((step) => {
            return { ...step, completed: false };
          });
          return { ...tab, steps: updatedSteps };
        }
      );

      const step = updatedCollateralTabs
        .flatMap((tab: TabType) => tab.steps)
        .find((step: Step) => step.name === action.payload);

      const activeTabIndex = updatedCollateralTabs.findIndex(
        (tab: TabType) => tab?.name === step?.tab_name
      );

      const stepIndex = updatedCollateralTabs[activeTabIndex]?.steps.findIndex(
        (stepToFind: Step) => stepToFind?.name === step?.name
      );

      updatedCollateralTabs[activeTabIndex].steps[stepIndex].completed = true;

      state.collateral_review_tabs = updatedCollateralTabs;
      localStorage.setItem(
        "collateral_review_tabs",
        JSON.stringify(updatedCollateralTabs)
      );
    },
    setCollateralReviewCompletedTab: (state, action) => {
      const updatedCollateralTabs = state.collateral_review_tabs;
      const tabIndex = updatedCollateralTabs.findIndex(
        (tab: TabType) => tab?.name === action.payload
      );
      updatedCollateralTabs[tabIndex].completed = true;
      state.collateral_review_tabs = updatedCollateralTabs;
      localStorage.setItem(
        "collateral_review_tabs",
        JSON.stringify(updatedCollateralTabs)
      );
    },
  },
});

export default collateralReviewSlice.reducer;

export const {
  setCollateralReviewTabs,
  setCollateralReviewActiveTab,
  setCollateralReviewActiveStep,
  setCollateralReviewCompletedStep,
  setCollateralReviewCompletedTab,
} = collateralReviewSlice.actions;
