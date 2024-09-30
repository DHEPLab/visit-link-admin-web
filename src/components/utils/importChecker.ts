import { NAME_REGEX, PHONE_REGEX } from "@/constants/rules";
import dayjs from "dayjs";
import i18n from "@/i18n";
import * as Enums from "@/constants/enums";

const t = i18n.getFixedT(null, ["common", "enum", "baby"]);
type EnumType = (typeof Enums)[keyof typeof Enums];

const BabyKeys = {
  identity: "id",
  name: "babyName",
  stage: "growthStage",
  gender: "gender",
  edc: "dueDay",
  birthday: "birthDay",
  assistedFood: "supplementaryFood",
  feedingPattern: "feedingMethods",
  area: "area",
  location: "address",
  remark: "comments",
  chwID: "chwID",
};

function getBabyField(key: keyof typeof BabyKeys): string {
  return t(BabyKeys[key], { ns: "baby" });
}

function getEnumValue(enumType: EnumType, enumValue: string): string | null {
  const key = Object.keys(enumType).find((key) => enumType[key as keyof typeof enumType] === enumValue);
  return key || null;
}

const getBabyStage = (value: string) => getEnumValue(Enums.BabyStage, value);
const getGender = (value: string) => getEnumValue(Enums.Gender, value);
const getFeedingPattern = (value: string) => getEnumValue(Enums.FeedingPattern, value);
const getFamilyTies = (value: string) => getEnumValue(Enums.FamilyTies, value);

function getAssistedFood(value: string): boolean | null {
  const trueValue = t("AssistedFood.TRUE", { ns: "enum" });
  const falseValue = t("AssistedFood.FALSE", { ns: "enum" });
  if (value === trueValue) return true;
  if (value === falseValue) return false;
  return null;
}

type Care = {
  master: boolean;
  name: string;
  familyTies: string | null;
  phone: string;
  wechat: string;
};

function buildCare(baby: Record<string, string>, prefix: string, isMaster: boolean): Care {
  return {
    master: isMaster,
    name: baby[`${prefix}_name`] || "",
    familyTies: getFamilyTies(baby[`${prefix}_relationship`] || ""),
    phone: baby[`${prefix}_phone`] || "",
    wechat: baby[`${prefix}_Wechat`] || "",
  };
}

function getCares(baby: Record<string, string>): Care[] {
  const caregivers = [
    { prefix: "Caregiver_Main", isMaster: true },
    { prefix: "Caregiver_II", isMaster: false },
    { prefix: "Caregiver_III", isMaster: false },
    { prefix: "Caregiver_IV", isMaster: false },
  ];

  return caregivers
    .map(({ prefix, isMaster }) => (baby[`${prefix}_name`] ? buildCare(baby, prefix, isMaster) : null))
    .filter((care): care is Care => care !== null);
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

type BabyWithNumber = ImportBabyType & { number: number };

function toBaby(baby: Record<string, string>): ImportBabyType {
  return {
    identity: baby[getBabyField("identity")]?.trim(),
    name: baby[getBabyField("name")]?.trim(),
    stage: getBabyStage(baby[getBabyField("stage")] || ""),
    gender: getGender(baby[getBabyField("gender")] || ""),
    edc: baby[getBabyField("edc")],
    birthday: baby[getBabyField("birthday")],
    assistedFood: getAssistedFood(baby[getBabyField("assistedFood")] || ""),
    feedingPattern: getFeedingPattern(baby[getBabyField("feedingPattern")] || ""),
    area: baby[getBabyField("area")],
    location: baby[getBabyField("location")],
    remark: baby[getBabyField("remark")],
    chw: { chw: { identity: baby[getBabyField("chwID")] } },
    cares: getCares(baby),
  };
}

function validateUniqueIdentity(
  element: BabyWithNumber,
  validBabies: ImportBabyType[],
  errors: ImportBabyError[],
): boolean {
  if (validBabies.some((ele) => ele.identity === element.identity)) {
    errors.push({
      number: element.number,
      name: element.name || "",
      matters: t("excel.importBaby.duplicateId"),
    });
    return false;
  }
  return true;
}

function validateRequiredFields(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  const { number, name, identity, gender, stage, area, location, cares } = element;

  if (!identity) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.emptyId"),
    });
    return false;
  }
  if (!name) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.emptyBabyName"),
    });
    return false;
  }
  if (!gender) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.invalidGender"),
    });
    return false;
  }
  if (!stage) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.invalidGrowthStage"),
    });
    return false;
  }
  if (!area) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.emptyArea"),
    });
    return false;
  }
  if (!location) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.emptyLocation"),
    });
    return false;
  }
  if (!cares || cares.length === 0 || !cares[0].master) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.emptyCaregiver"),
    });
    return false;
  }
  return true;
}

function validateName(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  if (element.name && !NAME_REGEX.test(element.name)) {
    errors.push({
      number: element.number,
      name: element.name,
      matters: t("excel.importBaby.nameInvalid"),
    });
    return false;
  }
  return true;
}

function validateCares(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  const isValidCares = element.cares.every((care) => {
    return care.name && care.phone && care.familyTies && NAME_REGEX.test(care.name) && PHONE_REGEX.test(care.phone);
  });
  if (!isValidCares) {
    errors.push({
      number: element.number,
      name: element.name || "",
      matters: t("excel.importBaby.invalidCaregiver"),
    });
    return false;
  }
  return true;
}

function validateDate(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  if (element.stage === "UNBORN") {
    const { edc } = element;
    if (!edc) {
      errors.push({
        number: element.number,
        name: element.name || "",
        matters: t("excel.importBaby.emptyEDC"),
      });
      return false;
    }
    if (!dayjs(edc, "YYYY-MM-DD", true).isValid()) {
      errors.push({
        number: element.number,
        name: element.name || "",
        matters: t("excel.importBaby.invalidFormatDueDay"),
      });
      return false;
    }
    if (dayjs().isAfter(dayjs(edc))) {
      errors.push({
        number: element.number,
        name: element.name || "",
        matters: t("excel.importBaby.invalidDueDay"),
      });
      return false;
    }
    element.edc = dayjs(edc).format("YYYY-MM-DD");
  } else {
    const { birthday } = element;
    if (!birthday) {
      errors.push({
        number: element.number,
        name: element.name || "",
        matters: t("excel.importBaby.emptyBirthDay"),
      });
      return false;
    }
    if (!dayjs(birthday, "YYYY-MM-DD", true).isValid()) {
      errors.push({
        number: element.number,
        name: element.name || "",
        matters: t("excel.importBaby.invalidFormatBirthDay"),
      });
      return false;
    }
    if (dayjs().isBefore(dayjs(birthday))) {
      errors.push({
        number: element.number,
        name: element.name || "",
        matters: t("excel.importBaby.invalidBirthDay"),
      });
      return false;
    }
    element.birthday = dayjs(birthday).format("YYYY-MM-DD");
  }
  return true;
}

export const checkBabies = (babies: Record<string, string>[]) => {
  const babyObjects: BabyWithNumber[] = babies.map((baby, index) => ({
    ...toBaby(baby),
    number: index + 1,
  }));
  const validBabies: ImportBabyType[] = [];
  const errors: ImportBabyError[] = [];

  babyObjects.forEach((element) => {
    if (!validateUniqueIdentity(element, validBabies, errors)) return;
    if (!validateRequiredFields(element, errors)) return;
    if (!validateName(element, errors)) return;
    if (!validateCares(element, errors)) return;
    if (!validateDate(element, errors)) return;

    validBabies.push(element);
  });

  return {
    validBabies,
    errors,
  };
};
