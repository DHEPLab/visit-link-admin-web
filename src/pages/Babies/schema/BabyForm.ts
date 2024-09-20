import { BabyModalFormValues } from "@/components/BabyModalForm";
import { omit } from "radash";
import { NewBabyRequest } from "@/models/req/Baby";

export const toNewBabyRequest = (values: BabyModalFormValues): NewBabyRequest => {
  const request: NewBabyRequest = {
    ...omit(values, ["area", "birthday", "edc"]),
    area: values.area[0],
  };

  if (values.birthday) {
    request.birthday = values.birthday.format("YYYY-MM-DD");
  }

  if (values.edc) {
    request.edc = values.edc.format("YYYY-MM-DD");
  }

  return request;
};
