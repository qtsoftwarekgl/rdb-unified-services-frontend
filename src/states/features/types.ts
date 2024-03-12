export interface Step {
  label: string;
  name: string;
  tab_name: string;
  active: boolean;
  completed: boolean;
}

export interface TabType {
  no: number;
  label: string;
  name: string;
  active: boolean;
  steps: Array<Step>;
}
