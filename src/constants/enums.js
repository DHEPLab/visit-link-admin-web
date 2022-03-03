export const Role = {
  ROLE_CHW: "社区工作者",
  ROLE_SUPERVISOR: "督导员",
  ROLE_ADMIN: "管理员",
  ROLE_SUPER_ADMIN: "超级管理员",
};

export const Gender = {
  MALE: "男",
  FEMALE: "女",
  UNKNOWN: "未知",
};

export const BabyStage = {
  EDC: "待产期",
  BIRTH: "已出生",
};

export const CurriculumBabyStage = {
  EDC: "已怀孕",
  BIRTH: "已出生",
};

export const FeedingPattern = {
  BREAST_MILK: "纯母乳喂养",
  MILK_POWDER: "纯奶粉喂养",
  MIXED: "母乳奶粉混合喂养",
  TERMINATED: "已终止母乳/奶粉喂养",
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

export const ProjectStatus = {
  "1": "发布",
  "0": "停用"
};

export const QrType = {
  MODULE_DATA: "MODULE_DATA", // module原始数据
  MODULE_ID: "MODULE_ID"      // module的id
}