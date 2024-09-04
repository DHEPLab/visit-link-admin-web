import { STAGE_TYPE } from "./common";

export interface ScheduleFormValue {
  id?: number;
  name: string;
  stage: STAGE_TYPE;
  startOfApplicableDays: number;
  endOfApplicableDays: number;
  lessons: {
    label: string;
    value: string;
  }[];
}
