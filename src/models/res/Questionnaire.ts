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

interface TextQuestion {
  type: "Text";
  value: {
    html: string;
    type: string;
    title: string;
  };
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
