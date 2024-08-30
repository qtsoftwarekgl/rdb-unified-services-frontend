import { Business } from '@/types/models/business';
import {
  NavigationFlow,
  NavigationFlowMass,
} from '@/types/models/navigationFlow';
import { UUID } from 'crypto';

// FIND NAVIGATION FLOW ID BY STEP NAME
export const findNavigationFlowMassIdByStepName = (
  navigationFlowMassList?: NavigationFlowMass,
  stepName?: string
) => {
  if (!navigationFlowMassList) return undefined;
  const navigationFlowId = Object?.values(navigationFlowMassList)
    ?.flat()
    ?.find((navigationFlow) => navigationFlow?.stepName === stepName)?.id;
  return navigationFlowId;
};

// FIND NAVIGATION FLOW BY STEP NAME
export const findNavigationFlowByStepName = (
  businessNavigationFlowsList?: NavigationFlow[],
  stepName?: string
) => {
  if (!businessNavigationFlowsList) return undefined;
  const navigationFlow = Object?.values(businessNavigationFlowsList)
    ?.flat()
    ?.find(
      (navigationFlow) =>
        navigationFlow?.navigationFlowMass?.stepName === stepName
    );
  return navigationFlow;
};

// FIND NAVIGATION FLOW BY ID
export const findNavigationFlowById = (
  businessNavigationFlowsList?: NavigationFlow[],
  navigationFlowId?: UUID
) => {
  if (!businessNavigationFlowsList) return undefined;
  const navigationFlow = Object?.values(businessNavigationFlowsList)
    ?.flat()
    ?.find((navigationFlow) => navigationFlow?.id === navigationFlowId);
  return navigationFlow;
};

export const getBusinessStatusColor = (status: string): string => {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-blue-700';
    case 'VERIFIED':
      return 'bg-green-700';
    case 'APPROVED':
    case 'ACTIVE':
      return 'bg-green-700';
    case 'REJECTED':
      return 'bg-red-700';
    case 'IN_PROGRESS':
      return 'bg-slate-600';
    case 'ACTION_REQUIRED':
      return 'bg-yellow-700';
    case 'AMENDMENT_SUBMITTED':
    case 'IS_AMENDING':
      return 'bg-yellow-700';
    case 'IN_REVIEW':
      return 'bg-blue-700';
    case 'RESUBMITTED':
    case 'PENDING_DECISION':
      return 'bg-blue-700';
    default:
      return '';
  }
};

export const getBusinessName = (business: Business): string => {
  return (
    business?.companyName ||
    business?.enterpriseName ||
    business?.enterpriseBusinessName ||
    business?.branchName ||
    ''
  );
}

