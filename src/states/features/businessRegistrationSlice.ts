import { createSlice } from '@reduxjs/toolkit';

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

export const business_registration_tabs_initial_state: Array<RegistrationTab> =
  [
    {
      no: 1,
      label: 'General Information',
      name: 'general_information',
      completed: false,
      active: true,
      steps: [
        {
          label: 'Company Details',
          name: 'company_details',
          tab_name: 'general_information',
          active: true,
          completed: false,
        },
        {
          label: 'Company Address',
          name: 'company_address',
          tab_name: 'general_information',
          active: false,
          completed: false,
        },
        {
          label: 'Business Activity & VAT',
          name: 'business_activity_vat',
          tab_name: 'general_information',
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 2,
      label: 'Management',
      name: 'management',
      active: false,
      completed: false,
      steps: [
        {
          label: 'Board of Directors',
          name: 'board_of_directors',
          tab_name: 'management',
          active: false,
          completed: false,
        },
        {
          label: 'Senior Management',
          name: 'senior_management',
          tab_name: 'management',
          active: false,
          completed: false,
        },
        {
          label: 'Employment Info',
          name: 'employment_info',
          tab_name: 'management',
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 3,
      label: 'Capital Information',
      name: 'capital_information',
      active: false,
      completed: false,
      steps: [
        {
          label: 'Share Details',
          name: 'share_details',
          tab_name: 'capital_information',
          active: false,
          completed: false,
        },
        {
          label: 'Shareholders',
          name: 'shareholders',
          tab_name: 'capital_information',
          active: false,
          completed: false,
        },
        {
          label: 'Capital Details',
          name: 'capital_details',
          tab_name: 'capital_information',
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 4,
      label: 'Beneficial Owners',
      active: false,
      completed: false,
      name: 'beneficial_owners',
      steps: [
        {
          label: 'Beneficial Owners',
          name: 'beneficial_owners',
          tab_name: 'beneficial_owners',
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 5,
      label: 'Attachments',
      name: 'attachments',
      completed: false,
      active: false,
      steps: [
        {
          label: 'Attachments',
          name: 'attachments',
          tab_name: 'attachments',
          active: false,
          completed: false,
        },
      ],
    },
    {
      no: 6,
      label: 'Preview & Submission',
      name: 'preview_submission',
      completed: false,
      active: false,
      steps: [
        {
          label: 'Preview & Submission',
          name: 'preview_submission',
          tab_name: 'preview_submission',
          active: false,
          completed: false,
        },
      ],
    },
  ];

export const businessRegistrationSlice = createSlice({
  name: 'businessRegistration',
  initialState: {
    business_registration_tabs:
      JSON.parse(String(localStorage.getItem('business_registration_tabs'))) ||
      business_registration_tabs_initial_state,
    business_active_step: JSON.parse(
      String(localStorage.getItem('business_active_step'))
    ) || {
      label: 'Company Details',
      name: 'company_details',
    },
    business_active_tab: JSON.parse(
      String(localStorage.getItem('business_active_tab'))
    ) || {
      label: 'General Information',
      name: 'general_information',
    },
    company_business_lines:
      JSON.parse(String(localStorage.getItem('company_business_lines'))) || [],
    capitalDetailsModal: false,
    confirmDeleteModal: false,
    shareholderDetailsModal: false,
  },
  reducers: {
    // SET REGISTRATION TABS
    setBusinessRegistrationTabs: (state, action) => {
      state.business_registration_tabs = action.payload;
      localStorage.setItem(
        'business_registration_tabs',
        JSON.stringify(action.payload)
      );
    },

    // SET ACTIVE TAB
    setBusinessActiveTab: (state, action) => {
      const updatedRegistrationTabs = state.business_registration_tabs?.map(
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
      state.business_active_tab = updatedRegistrationTabs[tabIndex];
      localStorage.setItem(
        'business_active_tab',
        JSON.stringify(updatedRegistrationTabs[tabIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'business_registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPLETED TAB
    setBusinessCompletedTab: (state, action) => {
      const updatedRegistrationTabs = state.business_registration_tabs;
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === action.payload
      );
      updatedRegistrationTabs[tabIndex].completed = true;
      state.business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'business_registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET ACTIVE STEP
    setBusinessActiveStep: (state, action) => {
      const updatedRegistrationTabs = state.business_registration_tabs?.map(
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
      state.business_active_step =
        updatedRegistrationTabs[tabIndex].steps[stepIndex];
      localStorage.setItem(
        'business_active_step',
        JSON.stringify(updatedRegistrationTabs[tabIndex].steps[stepIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'business_registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPLETED STEP
    setBusinessCompletedStep: (state, action) => {
      const updatedRegistrationTabs = state.business_registration_tabs?.map(
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
      state.business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'business_registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // REMOVE COMPLETED STEP
    removeBusinessCompletedStep: (state, action) => {
      const updatedRegistrationTabs = state.business_registration_tabs?.map(
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
      updatedRegistrationTabs[tabIndex].steps[stepIndex].completed = false;

      // SET UPDATED ACTIVE REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.business_registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'business_registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPANY SUB ACTIVITIES
    setCompanySubActivities: (state, action) => {
      state.company_business_lines = action.payload;
      localStorage.setItem(
        'company_business_lines',
        JSON.stringify(action.payload)
      );
    },

    // SET CAPITAL DETAILS MODAL
    setCapitalDetailsModal: (state, action) => {
      state.capitalDetailsModal = action.payload;
  },

  // SET CONFIRM DELETE MODAL
  setConfirmDeleteModal: (state, action) => {
    state.confirmDeleteModal = action.payload;
  },

  // SET SHAREHOLDER DETAILS MODAL
  setShareholderDetailsModal: (state, action) => {
    state.shareholderDetailsModal = action.payload;
  },

}});

export default businessRegistrationSlice.reducer;

export const {
  setBusinessActiveTab,
  setBusinessActiveStep,
  setBusinessCompletedStep,
  setCompanySubActivities,
  removeBusinessCompletedStep,
  setBusinessRegistrationTabs,
  setBusinessCompletedTab,
  setCapitalDetailsModal,
  setConfirmDeleteModal,
  setShareholderDetailsModal,
} = businessRegistrationSlice.actions;
