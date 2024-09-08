import dayjs from "dayjs";
import i18n from "@/i18n";

const t = i18n.getFixedT(null, ["common", "enum", "baby"]);

function getFeedingPattern(value: string): string | null {
  const arr = [
    { key: "BREAST_MILK", value: t("FeedingPattern.BREAST_MILK", { ns: "enum" }) },
    { key: "MILK_POWDER", value: t("FeedingPattern.MILK_POWDER", { ns: "enum" }) },
    { key: "MIXED", value: t("FeedingPattern.MIXED", { ns: "enum" }) },
    { key: "TERMINATED", value: t("FeedingPattern.TERMINATED", { ns: "enum" }) },
  ];
  const find = arr.find((ele) => ele.value === value);
  if (find) return find.key;
  return null;
}

function getBabyStage(value?: string): string | null {
  const arr = [
    { key: "EDC", value: t("BabyStage.EDC", { ns: "enum" }) },
    { key: "BIRTH", value: t("BabyStage.BIRTH", { ns: "enum" }) },
  ];
  const find = arr.find((ele) => ele.value === value);
  if (find) return find.key;
  return null;
}

function getGender(value?: string): string | null {
  const arr = [
    { key: "MALE", value: t("Gender.MALE", { ns: "enum" }) },
    { key: "FEMALE", value: t("Gender.FEMALE", { ns: "enum" }) },
    { key: "UNKNOWN", value: t("Gender.UNKNOWN", { ns: "enum" }) },
  ];
  const find = arr.find((ele) => ele.value === value);
  if (find) return find.key;
  return null;
}

function getFamilyTies(value: string): string | null {
  const arr = [
    { key: "MOTHER", value: t("RELATIVES.MOTHER", { ns: "enum" }) },
    { key: "FATHER", value: t("RELATIVES.FATHER", { ns: "enum" }) },
    { key: "GRANDMOTHER", value: t("RELATIVES.GRANDMOTHER", { ns: "enum" }) },
    { key: "GRANDMA", value: t("RELATIVES.GRANDMA", { ns: "enum" }) },
    { key: "GRANDFATHER", value: t("RELATIVES.GRANDFATHER", { ns: "enum" }) },
    { key: "GRANDPA", value: t("RELATIVES.GRANDPA", { ns: "enum" }) },
    { key: "OTHER", value: t("RELATIVES.OTHER", { ns: "enum" }) },
  ];
  const find = arr.find((ele) => ele.value === value);
  if (find) return find.key;
  return null;
}

function getAssistedFood(value: string): boolean | null {
  const arr = [
    { key: true, value: t("AssistedFood.TRUE", { ns: "enum" }) },
    { key: false, value: t("AssistedFood.FALSE", { ns: "enum" }) },
  ];
  const find = arr.find((ele) => ele.value === value);
  if (find) return find.key;
  return null;
}

type Care = {
  master: boolean;
  name: string;
  familyTies: string | null;
  phone: string;
  wechat: string;
};

function getCares(baby: Record<string, string>): Care[] {
  const cares: Care[] = [];
  if (baby["Caregiver_Main_name"]) {
    cares.push({
      master: true,
      name: baby["Caregiver_Main_name"] && baby["Caregiver_Main_name"].trim(),
      familyTies: getFamilyTies(baby["Caregiver_Main_relationship"]),
      phone: baby["Caregiver_Main_phone"],
      wechat: baby["Caregiver_Main_Wechat"],
    });
  } else {
    return cares;
  }

  if (baby["Caregiver_II_name"]) {
    cares.push({
      master: false,
      name: baby["Caregiver_II_name"],
      familyTies: getFamilyTies(baby["Caregiver_II_relationship"]),
      phone: baby["Caregiver_II_phone"],
      wechat: baby["Caregiver_II_Wechat"],
    });
  } else {
    return cares;
  }

  if (baby["Caregiver_III_name"]) {
    cares.push({
      master: false,
      name: baby["Caregiver_III_name"],
      familyTies: getFamilyTies(baby["Caregiver_III_relationship"]),
      phone: baby["Caregiver_III_phone"],
      wechat: baby["Caregiver_III_Wechat"],
    });
  } else {
    return cares;
  }

  if (baby["Caregiver_IV_name"]) {
    cares.push({
      master: false,
      name: baby["Caregiver_IV_name"],
      familyTies: getFamilyTies(baby["Caregiver_IV_relationship"]),
      phone: baby["Caregiver_IV_phone"],
      wechat: baby["Caregiver_IV_Wechat"],
    });
  } else {
    return cares;
  }
  return cares;
}

export type ImportBabyType = {
  identity?: string;
  name?: string;
  stage: string | null;
  gender: string | null;
  edc?: string;
  birthday?: string;
  assistedFood: boolean | null;
  feedingPattern: string | null;
  area?: string;
  location?: string;
  remark?: string;
  chw: {
    chw: {
      identity?: string;
    };
  };
  cares: Care[];
};

export type ImportBabyError = {
  number: number;
  name: string;
  matters: string;
};

function toBaby(baby: Record<string, string>) {
  const cares = getCares(baby);
  return {
    identity: baby[t("id", { ns: "baby" })]?.trim(),
    name: baby[t("babyName", { ns: "baby" })]?.trim(),
    stage: getBabyStage(baby[t("growthStage", { ns: "baby" })]),
    gender: getGender(baby[t("gender", { ns: "baby" })]),
    edc: baby[t("dueDay", { ns: "baby" })],
    birthday: baby[t("birthDay", { ns: "baby" })],
    assistedFood: getAssistedFood(baby[t("supplementaryFood", { ns: "baby" })]),
    feedingPattern: getFeedingPattern(baby[t("feedingMethods", { ns: "baby" })]),
    area: baby[t("area", { ns: "baby" })],
    location: baby[t("address", { ns: "baby" })],
    remark: baby[t("comments", { ns: "baby" })],
    chw: { chw: { identity: baby[t("chwID", { ns: "baby" })] } },
    cares: cares,
  };
}

export const checkBabies = (babies: Record<string, string>[]) => {
  const isLanguageZH = i18n.resolvedLanguage === "zh";
  const babyObjects = babies.map((baby, index) => ({ ...toBaby(baby), number: index + 1 }));
  const validBabies: ImportBabyType[] = [];
  const errors: ImportBabyError[] = [];
  babyObjects.forEach((element) => {
    if (validBabies.find((ele) => ele.identity === element.identity)) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.duplicateId") });
      return;
    }

    if (!element.identity) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyId") });
      return;
    }

    if (!element.name) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyBabyName") });
      return;
    }

    if (!element.gender) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.invalidGender") });
      return;
    }

    if (!element.stage) {
      errors.push({
        number: element.number,
        name: element.name,
        matters: t("excel.importBaby.invalidGrowthStage"),
      });
      return;
    }

    if (!element.area) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyArea") });
      return;
    }

    if (!element.location) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyLocation") });
      return;
    }

    if (!element.cares || element.cares.length === 0 || element.cares[0]?.master === false) {
      errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyCaregiver") });
      return;
    }

    if (isLanguageZH && !new RegExp(/^[\u4e00-\u9fa5]{2,10}$/).test(element.name)) {
      errors.push({ number: element.number, name: element.name, matters: "姓名必须为2-10个汉字" });
      return;
    }

    if (isLanguageZH && element.area.split("/").length !== 4) {
      errors.push({ number: element.number, name: element.name, matters: "所在地区格式错误" });
      return;
    }

    if (element.cares.length > 0) {
      const result = element.cares.every((ele) => {
        if (!ele.phone || !ele.familyTies) return false;
        if (isLanguageZH && !new RegExp(/^[\u4e00-\u9fa5]{2,10}$/).test(ele.name)) return false;
        if (isLanguageZH && !new RegExp(/^1[0-9]{10}$/).test(ele.phone)) return false;
        return true;
      });
      if (!result) {
        errors.push({
          number: element.number,
          name: element.name,
          matters: t("excel.importBaby.invalidCaregiver"),
        });
        return;
      }
    }

    if (element.stage === "EDC") {
      if (!element.edc) {
        errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyEDC") });
        return;
      }

      if (element.edc.split("-").length !== 3) {
        errors.push({
          number: element.number,
          name: element.name,
          matters: t("excel.importBaby.invalidFormatDueDay"),
        });
        return;
      }

      element.edc = dayjs(element.edc).format("YYYY-MM-DD");

      if (dayjs().unix() > dayjs(element.edc).unix()) {
        errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.invalidDueDay") });
        return;
      }
      validBabies.push(element);
    } else {
      if (!element.birthday) {
        errors.push({ number: element.number, name: element.name, matters: t("excel.importBaby.emptyBirthDay") });
        return;
      }

      if (element.birthday.split("-").length !== 3) {
        errors.push({
          number: element.number,
          name: element.name,
          matters: t("excel.importBaby.invalidFormatBirthDay"),
        });
        return;
      }

      element.birthday = dayjs(element.birthday).format("YYYY-MM-DD");

      if (dayjs().unix() < dayjs(element.birthday).unix()) {
        errors.push({
          number: element.number,
          name: element.name,
          matters: t("excel.importBaby.invalidBirthDay"),
        });
        return;
      }
      validBabies.push(element);
    }
  });

  return {
    validBabies,
    errors,
  };
};
