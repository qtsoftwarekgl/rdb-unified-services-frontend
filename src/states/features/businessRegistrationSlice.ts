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
  steps: Array<RegistrationStep>;
}

export const businessRegistrationSlice = createSlice({
  name: 'businessRegistration',
  initialState: {
    registration_tabs: JSON.parse(
      String(localStorage.getItem('registration_tabs'))
    ) || [
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
      },
      {
        no: 5,
        label: 'Attachments',
        name: 'attachments',
        completed: false,
        active: false,
      },
      {
        no: 6,
        label: 'Preview & Submission',
        name: 'preview_submission',
        completed: false,
        active: false,
      },
    ],
    active_step: JSON.parse(String(localStorage.getItem('active_step'))) || {
      label: 'Company Details',
      name: 'company_details',
    },
    active_tab: JSON.parse(String(localStorage.getItem('active_tab'))) || {
      label: 'General Information',
      name: 'general_information',
    },
    company_details: JSON.parse(String(localStorage.getItem('company_details'))) || null,
  },
  reducers: {

    // SET ACTIVE TAB
    setActiveTab: (state, action) => {
      const updatedRegistrationTabs = state.registration_tabs?.map(
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
      state.active_tab = updatedRegistrationTabs[tabIndex];
      localStorage.setItem(
        'active_tab',
        JSON.stringify(updatedRegistrationTabs[tabIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPLETED TAB
    setCompletedTab: (state, action) => {
      const updatedRegistrationTabs = state.registration_tabs;
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === action.payload
      );
      updatedRegistrationTabs[tabIndex].completed = true;
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET ACTIVE STEP
    setActiveStep: (state, action) => {
      const updatedRegistrationTabs = state.registration_tabs?.map(
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
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === action.payload.tab_name
      );
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (step: RegistrationStep) => step?.name === action.payload.name
      );
      updatedRegistrationTabs[tabIndex].steps[stepIndex].active = true;

      // SET ACTIVE STEP TO STATE AND LOCAL STORAGE
      state.active_step = updatedRegistrationTabs[tabIndex].steps[stepIndex];
      localStorage.setItem(
        'active_step',
        JSON.stringify(updatedRegistrationTabs[tabIndex].steps[stepIndex])
      );

      // SET UPDATED REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPLETED STEP
    setCompletedStep: (state, action) => {
      const updatedRegistrationTabs = state.registration_tabs?.map(
        (tab: RegistrationTab) => {
          return {
            ...tab,
            steps: tab.steps?.map((step: RegistrationStep) => {
              return {
                ...step,
                completed: false,
              };
            }),
          };
        }
      );
      const tabIndex = updatedRegistrationTabs?.findIndex(
        (tab: RegistrationTab) => tab?.name === action.payload.tab_name
      );
      const stepIndex = updatedRegistrationTabs[tabIndex].steps?.findIndex(
        (step: RegistrationStep) => step?.name === action.payload.name
      );
      updatedRegistrationTabs[tabIndex].steps[stepIndex].completed = true;

      // SET UPDATED ACTIVE REGISTRATION TABS TO STATE AND LOCAL STORAGE
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },

    // SET COMPANY DETAILS
    setCompanyDetails: (state, action) => {
      state.company_details = action.payload;
      localStorage.setItem('company_details', JSON.stringify(action.payload));
    },
  },
});

export default businessRegistrationSlice.reducer;

export const { setActiveTab, setActiveStep, setCompletedStep, setCompanyDetails } =
  businessRegistrationSlice.actions;
