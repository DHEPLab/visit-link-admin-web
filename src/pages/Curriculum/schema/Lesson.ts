import { STAGE_TYPE } from "./common";

export type LessonModule = {
  label: string;
  value: number;
  key: number;
};

export interface LessonFormValue {
  id?: number;
  number: string;
  name: string;
  description: string;
  stage: STAGE_TYPE;
  startOfApplicableDays: number;
  endOfApplicableDays: number;
  modules: LessonModule[];
  questionnaire: number;
  smsQuestionnaireAddress: string;
}
