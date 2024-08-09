import i18n from "../i18n";

export const Role = {
  ROLE_CHW: "ROLE_CHW",
  ROLE_SUPERVISOR: "ROLE_SUPERVISOR",
  ROLE_ADMIN: "ROLE_ADMIN",
};

export const Gender = {
  MALE: i18n.t('Gender.MALE', { ns: "enum" }),
  FEMALE: i18n.t('Gender.FEMALE', { ns: "enum" }),
  UNKNOWN: i18n.t('Gender.UNKNOWN', { ns: "enum" }),
};

export const BabyStage = {
  EDC: i18n.t('BabyStage.EDC', { ns: "enum" }),
  BIRTH: i18n.t('BabyStage.BIRTH', { ns: "enum" }),
};

export const CurriculumBabyStage = {
  EDC: i18n.t('CurriculumBabyStage.EDC', { ns: "enum" }),
  BIRTH: i18n.t('CurriculumBabyStage.BIRTH', { ns: "enum" }),
};

export const FeedingPattern = {
  BREAST_MILK: i18n.t('FeedingPattern.BREAST_MILK', { ns: "enum" }),
  MILK_POWDER: i18n.t('FeedingPattern.MILK_POWDER', { ns: "enum" }),
  MIXED: i18n.t('FeedingPattern.MIXED', { ns: "enum" }),
  TERMINATED: i18n.t('FeedingPattern.TERMINATED', { ns: "enum" }),
};

export const FamilyTies = {
  MOTHER: i18n.t('RELATIVES.MOTHER', { ns: "enum" }),
  FATHER: i18n.t('RELATIVES.FATHER', { ns: "enum" }),
  GRANDMOTHER: i18n.t('RELATIVES.GRANDMOTHER', { ns: "enum" }),
  GRANDMA: i18n.t('RELATIVES.GRANDMA', { ns: "enum" }),
  GRANDFATHER: i18n.t('RELATIVES.GRANDFATHER', { ns: "enum" }),
  GRANDPA: i18n.t('RELATIVES.GRANDPA', { ns: "enum" }),
  OTHER: i18n.t('RELATIVES.OTHER', { ns: "enum" }),
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
  CREATE: "待审创建",
  MODIFY: "待审修改",
  DELETE: "待审注销",
};

export const ReviewActionFromApp = {
  CREATE: "创建新宝宝账户",
  MODIFY: "修改宝宝信息",
  DELETE: "注销宝宝账户",
};

export const VisitStatus = {
  NOT_STARTED: "待开始",
  UNDONE: "未完成",
  EXPIRED: "已过期",
  DONE: "已完成",
};
