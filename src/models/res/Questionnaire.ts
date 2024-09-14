export interface Questionnaire {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  projectId: number;
  id: number;
  name: string;
  questions: Question[];
  branch: string;
  published: boolean;
}

export interface QuestionnaireListItem {
  id: number;
  branch: string;
  name: string;
  published: boolean;
}

type Question = TextQuestion | RadioQuestion | CheckboxQuestion;

export interface TextQuestionValue {
  title: string;
}

export interface TextQuestion {
  type: "Text";
  value: TextQuestionValue;
}

export interface ChoiceQuestionValue {
  title: string;
  options: ChoiceQuestionOption[];
}

interface RadioQuestion {
  type: "Radio";
  value: ChoiceQuestionValue;
}

interface CheckboxQuestion {
  type: "Checkbox";
  value: ChoiceQuestionValue;
}

export interface ChoiceQuestionOption {
  label: string;
  needEnter: boolean;
}
