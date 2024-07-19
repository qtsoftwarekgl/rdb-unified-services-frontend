import { NavigationFlowMass } from '@/types/models/navigationFlow';

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
