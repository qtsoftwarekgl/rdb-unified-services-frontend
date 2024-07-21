import { NavigationFlow, NavigationFlowMass } from '@/types/models/navigationFlow';

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
