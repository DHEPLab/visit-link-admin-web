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

type Question = TextQuestion | RadioQuestion | CheckboxQuestion;

export interface TextQuestionValue {
  title: string;
}

export interface TextQuestion {
  type: "Text";
  value: TextQuestionValue;
}

interface RadioQuestion {
  type: "Radio";
  value: {
    title: string;
    options: Option[];
  };
}

interface CheckboxQuestion {
  type: "Checkbox";
  value: {
    title: string;
    options: Option[];
  };
}

interface Option {
  label: string;
  needEnter: boolean;
}
