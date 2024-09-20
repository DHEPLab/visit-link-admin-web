import { BabyModalFormValues } from "@/components/BabyModalForm";
import dayjs from "dayjs";
import { toNewBabyRequest } from "./BabyForm";

describe("toNewBabyRequest", () => {
  const formValues = {
    name: "Han Meimei",
    identity: "123456789",
    gender: "FEMALE",
    stage: "EDC",
    edc: dayjs().add(2, "days"),
    area: ["Some Area"],
    location: "Some Location",
  } as BabyModalFormValues;

  it("should convert values correctly with default language", () => {
    expect(toNewBabyRequest(formValues)).toEqual({
      name: "Han Meimei",
      identity: "123456789",
      gender: "FEMALE",
      stage: "EDC",
      edc: dayjs().add(2, "days").format("YYYY-MM-DD"),
      area: "Some Area",
      location: "Some Location",
    });
  });

  it("should join area as string when language is zh", () => {
    const newFormValues: BabyModalFormValues = {
      ...formValues,
      area: ["Area1"],
    };

    const result = toNewBabyRequest(newFormValues);

    expect(result).toEqual({
      name: "Han Meimei",
      identity: "123456789",
      gender: "FEMALE",
      stage: "EDC",
      edc: dayjs().add(2, "days").format("YYYY-MM-DD"),
      area: "Area1",
      location: "Some Location",
    });
  });

  it("should handle BIRTH stage request", () => {
    const newFormValues: BabyModalFormValues = {
      ...formValues,
      stage: "BIRTH",
      edc: undefined,
      birthday: dayjs().add(2, "days"),
      assistedFood: true,
      feedingPattern: "BREAST_MILK",
    };

    const result = toNewBabyRequest(newFormValues);

    expect(result).toEqual({
      name: "Han Meimei",
      identity: "123456789",
      gender: "FEMALE",
      stage: "BIRTH",
      birthday: dayjs().add(2, "days").format("YYYY-MM-DD"),
      assistedFood: true,
      feedingPattern: "BREAST_MILK",
      area: "Some Area",
      location: "Some Location",
    });
  });
});
