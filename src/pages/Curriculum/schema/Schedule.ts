import { STAGE_TYPE } from "./common";

export type ScheduleLesson = {
  label: string;
  value?: string;
};

export interface ScheduleFormValue {
  id?: number;
  name: string;
  stage: STAGE_TYPE;
  startOfApplicableDays: number;
  endOfApplicableDays: number;
  lessons: ScheduleLesson[];
}
