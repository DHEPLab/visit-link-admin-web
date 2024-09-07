import { BabyModalFormValues } from "@/components/BabyModalForm";
import { omit } from "radash";

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
  longitude?: number;
  latitude?: number;
  remark?: string;
}

export const toNewBabyRequest = (values: BabyModalFormValues, lang: string = "en"): NewBabyRequest => {
  const request: NewBabyRequest = {
    ...omit(values, ["area", "birthday", "edc"]),
    area: lang === "zh" && Array.isArray(values.area) ? values.area.join("/") : (values.area as string),
  };

  if (values.birthday) {
    request.birthday = values.birthday.format("YYYY-MM-DD");
  }

  if (values.edc) {
    request.edc = values.edc.format("YYYY-MM-DD");
  }

  return request;
};
