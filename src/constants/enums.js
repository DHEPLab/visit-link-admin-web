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
  EDC: "已怀孕",
  BIRTH: "已出生",
};

export const FeedingPattern = {
  BREAST_MILK: i18n.t('FeedingPattern.BREAST_MILK', { ns: "enum" }),
  MILK_POWDER: i18n.t('FeedingPattern.MILK_POWDER', { ns: "enum" }),
  MIXED: i18n.t('FeedingPattern.MIXED', { ns: "enum" }),
  TERMINATED: i18n.t('FeedingPattern.TERMINATED', { ns: "enum" }),
};

export const FamilyTies = {
  MOTHER: "妈妈",
  FATHER: "爸爸",
  GRANDMOTHER: "奶奶",
  GRANDMA: "外婆",
  GRANDFATHER: "爷爷",
  GRANDPA: "外公",
  OTHER: "其他",
};

export const ModuleTopic = {
  MOTHER_NUTRITION: "母亲营养",
  BREASTFEEDING: "母乳喂养",
  BABY_FOOD: "婴儿辅食",
  INFANT_INJURY_AND_PREVENTION: "婴儿伤病和预防",
  CAREGIVER_MENTAL_HEALTH: "照料人心理健康",
  GOVERNMENT_SERVICES: "政府服务",
  KNOWLEDGE_ATTITUDE_TEST: "知识态度检测",
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
