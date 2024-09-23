export interface Schedule {
  id: number;
  name: string;
  stage: "UNBORN" | "BORN";
  startOfApplicableDays: number;
  endOfApplicableDays: number;
  lessons: { value: string; label: string }[];
  createdAt: string;
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}
