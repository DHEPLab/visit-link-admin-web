import i18n from "../i18n";

export const Role = {
  ROLE_CHW: i18n.t("ROLE_CHW", { ns: "roles" }),
  ROLE_SUPERVISOR: i18n.t("ROLE_SUPERVISOR", { ns: "roles" }),
  ROLE_ADMIN: i18n.t("ROLE_ADMIN", { ns: "roles" }),
  ROLE_SUPER_ADMIN: i18n.t("ROLE_SUPER_ADMIN", { ns: "roles" }),
};

export const Gender = {
  MALE: i18n.t("Gender.MALE", { ns: "enum" }),
  FEMALE: i18n.t("Gender.FEMALE", { ns: "enum" }),
  UNKNOWN: i18n.t("Gender.UNKNOWN", { ns: "enum" }),
};

export const BabyStage = {
  EDC: i18n.t("BabyStage.EDC", { ns: "enum" }),
  BIRTH: i18n.t("BabyStage.BIRTH", { ns: "enum" }),
};

export const CurriculumBabyStage = {
  EDC: i18n.t("CurriculumBabyStage.EDC", { ns: "enum" }),
  BIRTH: i18n.t("CurriculumBabyStage.BIRTH", { ns: "enum" }),
};

export const FeedingPattern = {
  BREAST_MILK: i18n.t("FeedingPattern.BREAST_MILK", { ns: "enum" }),
  MILK_POWDER: i18n.t("FeedingPattern.MILK_POWDER", { ns: "enum" }),
  MIXED: i18n.t("FeedingPattern.MIXED", { ns: "enum" }),
  TERMINATED: i18n.t("FeedingPattern.TERMINATED", { ns: "enum" }),
};

export const FamilyTies = {
  MOTHER: i18n.t("RELATIVES.MOTHER", { ns: "enum" }),
  FATHER: i18n.t("RELATIVES.FATHER", { ns: "enum" }),
  GRANDMOTHER: i18n.t("RELATIVES.GRANDMOTHER", { ns: "enum" }),
  GRANDMA: i18n.t("RELATIVES.GRANDMA", { ns: "enum" }),
  GRANDFATHER: i18n.t("RELATIVES.GRANDFATHER", { ns: "enum" }),
  GRANDPA: i18n.t("RELATIVES.GRANDPA", { ns: "enum" }),
  OTHER: i18n.t("RELATIVES.OTHER", { ns: "enum" }),
};

export const ModuleTopic = {
  MOTHER_NUTRITION: i18n.t("ModuleTopic.MOTHER_NUTRITION", { ns: "enum" }),
  BREASTFEEDING: i18n.t("ModuleTopic.BREASTFEEDING", { ns: "enum" }),
  BABY_FOOD: i18n.t("ModuleTopic.BABY_FOOD", { ns: "enum" }),
  INFANT_INJURY_AND_PREVENTION: i18n.t("ModuleTopic.INFANT_INJURY_AND_PREVENTION", { ns: "enum" }),
  CAREGIVER_MENTAL_HEALTH: i18n.t("ModuleTopic.CAREGIVER_MENTAL_HEALTH", { ns: "enum" }),
  GOVERNMENT_SERVICES: i18n.t("ModuleTopic.GOVERNMENT_SERVICES", { ns: "enum" }),
  KNOWLEDGE_ATTITUDE_TEST: i18n.t("ModuleTopic.KNOWLEDGE_ATTITUDE_TEST", { ns: "enum" }),
};

export const ActionFromApp = {
  CREATE: i18n.t("ActionFromApp.CREATE", { ns: "enum" }),
  MODIFY: i18n.t("ActionFromApp.MODIFY", { ns: "enum" }),
  DELETE: i18n.t("ActionFromApp.DELETE", { ns: "enum" }),
};

export const ReviewActionFromApp = {
  CREATE: i18n.t("ReviewActionFromApp.CREATE", { ns: "enum" }),
  MODIFY: i18n.t("ReviewActionFromApp.MODIFY", { ns: "enum" }),
  DELETE: i18n.t("ReviewActionFromApp.DELETE", { ns: "enum" }),
};

export const VisitStatus = {
  NOT_STARTED: i18n.t("VisitStatus.NOT_STARTED", { ns: "enum" }),
  UNDONE: i18n.t("VisitStatus.UNDONE", { ns: "enum" }),
  EXPIRED: i18n.t("VisitStatus.EXPIRED", { ns: "enum" }),
  DONE: i18n.t("VisitStatus.DONE", { ns: "enum" }),
};

export const ProjectStatus = {
  "1": i18n.t("ProjectStatus.1", { ns: "enum" }),
  "0": i18n.t("ProjectStatus.0", { ns: "enum" }),
};

export const QrType = {
  MODULE_DATA: "MODULE_DATA", // module原始数据
  MODULE_ID: "MODULE_ID", // module的id
};

export const enumKeysIterator = <T extends object>(enums: T): Array<keyof T> => {
  return Object.keys(enums) as Array<keyof T>;
};
