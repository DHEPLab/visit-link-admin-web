import { STAGE_TYPE } from "./common";

export interface LessonFormValue {
  id?: number;
  number: string;
  name: string;
  description: string;
  stage: STAGE_TYPE;
  startOfApplicableDays: number;
  endOfApplicableDays: number;
  modules: {
    label: string;
    value: number;
    key: number;
  }[];
  questionnaire: number;
  smsQuestionnaireAddress: string;
}
