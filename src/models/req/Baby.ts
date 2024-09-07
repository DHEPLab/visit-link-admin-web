export interface NewBabyRequest {
  name: string;
  identity: string;
  gender: string;
  stage: "EDC" | "BIRTH";
  edc?: string;
  birthday?: string;
  assistedFood?: boolean;
  feedingPattern?: "BREAST_MILK" | "MILK_POWDER" | "MIXED" | "TERMINATED";
  area: string;
  location: string;
  longitude: number | null;
  latitude: number | null;
  remark: string | null;
}
