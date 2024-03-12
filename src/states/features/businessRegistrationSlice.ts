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
    business_registration_tabs: JSON.parse(
      String(localStorage.getItem('business_registration_tabs'))
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
    business_active_step: JSON.parse(String(localStorage.getItem('business_active_step'))) || {
      label: 'Company Details',
      name: 'company_details',
    },
    business_active_tab: JSON.parse(String(localStorage.getItem('business_active_tab'))) || {
      label: 'General Information',
      name: 'general_information',
    },
    company_details: JSON.parse(String(localStorage.getItem('company_details'))) || null,
    company_address: JSON.parse(String(localStorage.getItem('company_address'))) || null,
  },
  reducers: {

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
      state.business_active_step = updatedRegistrationTabs[tabIndex].steps[stepIndex];
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

    // SET COMPANY DETAILS
    setCompanyDetails: (state, action) => {
      state.company_details = action.payload;
      localStorage.setItem('company_details', JSON.stringify(action.payload));
    },

    // SET COMPANY ADDRESS
    setCompanyAddress: (state, action) => {
      state.company_address = action.payload;
      localStorage.setItem('company_address', JSON.stringify(action.payload));
    },
  },
});

export default businessRegistrationSlice.reducer;

export const {
  setBusinessActiveTab,
  setBusinessActiveStep,
  setBusinessCompletedStep,
  setCompanyDetails,
  setCompanyAddress,
} = businessRegistrationSlice.actions;
