import { NAME_REGEX, PHONE_REGEX } from "@/constants/rules";
import dayjs from "dayjs";
import i18n from "@/i18n";
import * as Enums from "@/constants/enums";

const t = i18n.getFixedT(null, ["common", "enum", "baby"]);

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
function isValidEnumValue(enumType: Record<string, string>, value: string | null): boolean {
  if (!value) return false;
  return Object.values(enumType).includes(value);
}

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
    name: baby[`${prefix}_name`]?.trim() || "",
    familyTies: baby[`${prefix}_relationship`]?.trim() || "",
    phone: baby[`${prefix}_phone`]?.trim() || "",
    wechat: baby[`${prefix}_Wechat`]?.trim() || "",
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
    stage: baby[getBabyField("stage")]?.trim() || null,
    gender: baby[getBabyField("gender")]?.trim() || null,
    edc: baby[getBabyField("edc")],
    birthday: baby[getBabyField("birthday")],
    assistedFood: getAssistedFood(baby[getBabyField("assistedFood")] || ""),
    feedingPattern: baby[getBabyField("feedingPattern")]?.trim() || null,
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
  if (!isValidEnumValue(Enums.Gender, gender)) {
    errors.push({
      number,
      name: name || "",
      matters: t("excel.importBaby.invalidGender"),
    });
    return false;
  }
  if (!isValidEnumValue(Enums.BabyStage, stage)) {
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

function validateArea(element: BabyWithNumber, isLanguageZH: boolean, errors: ImportBabyError[]): boolean {
  if (isLanguageZH && element.area && element.area.split("/").length !== 4) {
    errors.push({
      number: element.number,
      name: element.name || "",
      matters: "所在地区格式错误",
    });
    return false;
  }
  return true;
}

function validateCares(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  const isValidCares = element.cares.every((care) => {
    const isValidFamilyTie = isValidEnumValue(Enums.FamilyTies, care.familyTies);
    return care.name && care.phone && isValidFamilyTie && NAME_REGEX.test(care.name) && PHONE_REGEX.test(care.phone);
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

function validateFeedingPattern(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  if (element.feedingPattern && !isValidEnumValue(Enums.FeedingPattern, element.feedingPattern)) {
    errors.push({
      number: element.number,
      name: element.name || "",
      matters: t("excel.importBaby.invalidFeedingPattern"),
    });
    return false;
  }
  return true;
}

function validateAssistedFood(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  if (element.assistedFood !== null && typeof element.assistedFood !== "boolean") {
    errors.push({
      number: element.number,
      name: element.name || "",
      matters: t("excel.importBaby.invalidAssistedFood"),
    });
    return false;
  }
  return true;
}

function validateDate(element: BabyWithNumber, errors: ImportBabyError[]): boolean {
  if (element.stage === Enums.BabyStage.UNBORN) {
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
  } else if (element.stage === Enums.BabyStage.BORN) {
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
  } else {
    errors.push({
      number: element.number,
      name: element.name || "",
      matters: t("excel.importBaby.invalidGrowthStage"),
    });
    return false;
  }
  return true;
}

export const checkBabies = (babies: Record<string, string>[]) => {
  const isLanguageZH = i18n.resolvedLanguage === "zh";
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
    if (!validateArea(element, isLanguageZH, errors)) return;
    if (!validateCares(element, errors)) return;
    if (!validateFeedingPattern(element, errors)) return;
    if (!validateAssistedFood(element, errors)) return;
    if (!validateDate(element, errors)) return;

    validBabies.push(element);
  });

  return {
    validBabies,
    errors,
  };
};
