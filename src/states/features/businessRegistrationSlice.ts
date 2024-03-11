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
        name: 'beneficial_owners',
      },
      {
        no: 5,
        label: 'Attachments',
        name: 'attachments',
        active: false,
      },
      {
        no: 6,
        label: 'Preview & Submission',
        name: 'preview_submission',
        active: false,
      },
    ],
  },
  reducers: {
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
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },
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
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },
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
      state.registration_tabs = updatedRegistrationTabs;
      localStorage.setItem(
        'registration_tabs',
        JSON.stringify(updatedRegistrationTabs)
      );
    },
  },
});

export default businessRegistrationSlice.reducer;

export const { setActiveTab, setActiveStep, setCompletedStep } =
  businessRegistrationSlice.actions;
