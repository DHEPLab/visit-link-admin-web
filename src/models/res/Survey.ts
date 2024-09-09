export interface SurveyTextComponent {
  type: "Text";
  key: number;
  value: {
    title: string;
  };
}

export interface SurveyRadioComponent {
  type: "Radio";
  key: number;
  value: {
    title: string;
    options: object[];
  };
}

export interface SurveyCheckboxComponent {
  type: "Checkbox";
  key: number;
  value: {
    title: string;
    options: object[];
  };
}

export type SurveyComponentType = SurveyTextComponent | SurveyRadioComponent | SurveyCheckboxComponent;
