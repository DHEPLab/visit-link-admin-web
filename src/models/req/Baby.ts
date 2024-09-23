export interface NewBabyRequest {
  name: string;
  identity: string;
  gender: string;
  stage: "UNBORN" | "BORN";
  edc?: string;
  birthday?: string;
  assistedFood?: boolean;
  feedingPattern?:
    | "EXCLUSIVE_BREASTFEEDING"
    | "FORMULA_FEEDING"
    | "MIXED_BREAST_FORMULA_FEEDING"
    | "NO_BREAST_FORMULA_FEEDING";
  area: string;
  location: string;
  longitude: number | null;
  latitude: number | null;
  remark: string | null;
}
