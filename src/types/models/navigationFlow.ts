import { AbstractDomain } from '.';

export interface AbstractNavigationFlow extends AbstractDomain {
  tabName: string;
  stepName: string;
  stepPosition: number;
  registrationType: string;
  tabPosition: number;
}

export interface NavigationFlowMass extends AbstractNavigationFlow {
  'General Information': AbstractNavigationFlow[];
  Management: AbstractNavigationFlow[];
  'Capital Information': AbstractNavigationFlow[];
  'Beneficial Owners': AbstractNavigationFlow[];
  Attachments: AbstractNavigationFlow[];
  'Preview & Submission': AbstractNavigationFlow[];
}

export interface NavigationFlow extends AbstractDomain {
  completed: boolean;
  active: boolean;
  navigationFlowMass: AbstractNavigationFlow;
}
