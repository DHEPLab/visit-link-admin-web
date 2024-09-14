import { Questionnaire } from "./Questionnaire";

export interface Lesson {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  deleted: boolean;
  projectId: number;
  id: number;
  number: string;
  name: string;
  description: string;
  stage: "BIRTH" | "EDC";
  startOfApplicableDays: number;
  endOfApplicableDays: number;
  modules: {
    value: string;
    label: string;
  }[];
  questionnaire: Questionnaire;
  questionnaireAddress: string | null;
  smsQuestionnaireAddress: string | null;
}
