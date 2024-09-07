import { BabyModalFormValues } from "@/components/BabyModalForm.tsx";
import { omit } from "radash";
import { NewBabyRequest } from "@/models/req/Baby.ts";

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
