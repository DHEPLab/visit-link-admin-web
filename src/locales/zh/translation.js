import zhCN from "antd/lib/locale/zh_CN";

export default {
  signIn: {
    login: "登录",
    username: {
      lable: "账户名",
      placeholder: "请输入账户名",
      required: "请输入您的用户名",
    },
    password: {
      lable: "账户密码",
      placeholder: "请输入账户密码",
      required: "请输入您的密码",
    },
    errorMessage: "您输入的账号名称/账户密码可能有误",
    success: {
      title: "登录成功",
      message: "您已成功登录系统",
    },
  },
  header: {
    myAccount: "个人中心",
    logOut: "退出",
    exportData: "数据导出",
    dataCategory: "数据类别",
    timeRange: "时间范围",
    completeVisits: "完成家访（已完成、已过期）",
    incompleteVisits: "未完成家访（待开始、未完成、已取消）",
    chw: "chw",
    baby: "宝宝",
  },
  app: {
    logoutSuccess: "您已退出登录",
    logoutMessage: "如您需进入系统，请重新登录",
  },
  roles: {
    ROLE_CHW: "社区工作者",
    ROLE_SUPERVISOR: "督导员",
    ROLE_ADMIN: "管理员",
  },
  menu: {
    curriculumManagement: "大纲管理",
    moduleManagement: "模块管理",
    surveyManagement: "问卷管理",
    accountManagement: "账户管理",
    babyManagement: "宝宝管理",
  },
  babies: {
    babyManagement: "宝宝管理",
    batchNewBabies: "批量创建宝宝",
    newBaby: "创建新宝宝",
    approved: "已审核",
    unreviewed: "待审核",
    pending: "待核准",
    importFromExcel: "从Excel导入",
    searchBabyInputPlaceholder: "请输入宝宝姓名、ID或所在区域搜索",
    babyName: "宝宝姓名",
    id: "ID",
    gender: "性别",
    area: "所在区域",
    chw: "负责社区工作者",
    chwID: "社区工作者ID",
    chooseCHW: "选择社区工作者",
    completedSession: "已上课堂",
    registerDate: "注册日期",
    babyStatus: "宝宝状态",
    active: "正常",
    archive: "注销",
    currentProgress: "当前进度",
    lastModifyAt: "修改日期",
    sessions: "节课堂",
  },
  baby: {
    noSelectedChwWarning: "请选择一个社区工作者",
    reactiveBaby: "恢复宝宝",
    archiveBaby: "注销宝宝",
    reactiveBabyConfirm: "确定要恢复宝宝？",
    babyManagement: "宝宝管理",
    cancel: "再想想",
    reactive: "恢复",
    archive: "注销",
    approve: "批准申请",
    archiveTip: "注销后，社区工作者将无法继续查看，修改，拜访该宝宝。是否继续？",
    archiveReason: "注销原因",
    archiveBabyTitle: "您确定要批准注销宝宝账户的申请吗？",
    later: "稍后再说",
    babyInfo: "宝宝信息",
    approveArchiveTip:
      "请先核对社区工作者注销的宝宝账户信息。批准申请后，宝宝账户将从社区工作者 app 端移除，不再显示，但宝宝数据将保留在已审核宝宝列表中。",
    modifyBaby: "修改宝宝信息",
    modifyBabyTitle: "您确定要批准修改宝宝信息的申请吗？",
    approveModifyTip: "请先核对社区工作者修改的宝宝账户信息。批准申请后，宝宝账户信息将被修改。",
    batchNewBabiesTitle: "您确定要批准创建新宝宝账户的申请吗？",
    batchNewBabiesTip:
      "请先核对社区工作者提交的新宝宝账户信息，并设置宝宝ID，即可批准该账户新建申请。一旦批准申请后，宝宝ID将不可更改。",
    id: "宝宝ID",
    waitingApproval: "待核准",
    visitHistory: "家访记录",
    visitStatus: "家访状态",
    visitTime: "家访时间",
    sessionContent: "课堂内容",
    reasonOfUncompleteOrExpired: "过期/未完成原因",
    deleteMasterWarning: "主看护人不可删除，请更换主看护人后进行此操作",
    changeMasterConfirm: "设置当前看护人为主看护人时会替换原来的看护人，是否继续？",
    proceed: "继续",
    confirm: "确认",
    caregiverList: "看护人列表",
    newCaregiver: "新增看护人",
    deleteCaregiver: "删除看护人",
    deleteCaregiverConfirm: "确认要删除此看护人？",
    deleteSuccessfully: "删除成功",
    master: "主看护人",
    editCaregiver: "编辑看护人",
    maxTo4Caregiver: "看护人最多可添加4人",
    yes: "是",
    no: "否",
    name: "真实姓名",
    babyName: "宝宝姓名",
    gender: "宝宝性别",
    growthStage: "成长阶段",
    dueDay: "预产期",
    birthDay: "出生日期",
    supplementaryFood: "辅食",
    add: "已添加",
    noAdd: "未添加",
    feedingMethods: "喂养方式",
    area: "所在区域",
    address: "详细地址",
    comments: "备注信息",
    relatives: "亲属关系",
    repeatRelatives: "亲属关系不能重复选择",
    contactPhone: "联系电话",
    wechat: "微信号",
    caregiverName: "看护人姓名",
    operate: "操作",
    delete: "删除",
    edit: "编辑",
    edc: "预产期",
    chw: "负责社区工作者",
    chwID: "社区工作者ID",
    chooseCHW: "选择社区工作者",
    changeCHW: "更改人员",
    assignCHW: "分配人员",
    reviewType: "审核类型",
    modifyDate: "修改日期",
    importBabyTemplate: "/static/template/import_baby_zh.xlsx",
    longitude: "经度",
    latitude: "纬度",
    locationCorrect: "校正位置",
    locationCorrectSuccessfully: "校正成功！",
    locationInfo: "位置信息",
    homeVisitDistance: '距离家访地点{{distance}}(Km)',
    time: "时间",
    content: "内容",
    change: "将",
    from: "由",
    to: "更改为",
    babyInfoChangeRecord: "宝宝信息变更记录",
    caregiverInfoChangeRecord: "看护人信息变更记录"
  },
  myAccount: {
    myAccount: "个人中心",
    generalInformation: "基本信息",
    edit: "编辑资料",
    name: "真实姓名",
    phoneNumber: "联系电话",
    permissions: "权限",
    accountInformation: "账户信息",
    username: "账户名称",
    password: "账户密码",
    editGeneralInformation: "编辑基本信息",
    resetPassword: "修改密码",
    oldPassword: "旧密码",
    newPassword: "新密码",
    confirmPassword: "确认密码",
    passwordNotMatch: "两次密码输入不一致",
    passwordChangedTip: "密码修改成功",
    reLoginTip: "请您重新登录",
  },
  users: {
    accountManagement: "账户管理",
    createNewUser: "创建新用户",
    chw: "社区工作者",
    supervisor: "督导员",
    admin: "管理员",
    generalInformation: "用户信息",
    permissions: "权限",
    id: "ID",
    name: "真实姓名",
    area: "所在区域",
    phone: "联系电话",
    username: "账户名称",
    password: "账户密码",
    completion: "已完成/应完成",
    completionRate: "完成率",
    searchChwPlaceholder: "请输入社区工作者姓名、ID或所在区域搜索",
    babyCount: "负责宝宝",
    accountInformation: "账户信息",
    batchNewAccounts: "批量创建账户"
  },
  user: {
    accountManagement: "账户管理",
    accountInformation: "账户信息",
    deleteAccount: "注销账户",
    chw: "社区工作者",
    supervisor: "负责督导员",
    username: "账户名称",
    password: "账户密码",
    id: "ID",
    name: "真实姓名",
    phone: "联系电话",
    area: "所在区域",
    generalInformation: "用户信息",
    edit: "编辑资料",
    resetPassword: "修改密码",
    editGeneralInformation: "修改用户信息",
    deleteSuperviser: "注销督导员",
    delete: "注销账户",
    cancel: "再想想",
    deleteSuperviserMessage: "注意！注销后，该账户将不可用且不可恢复，所有该督导员负责的社区工作者将处于未分配状态",
    deleteChw: "注销社区工作者",
    generalDeleteMessage: "注意！注销后，该账户将不可用且不可恢复。",
    babyNotEmptyMessage: "请先将其负责的宝宝移交至其他社区工作者后再进行注销",
    selectBabyPlaceholder: "请选择移交宝宝的社区工作者",
    confirmResetPassword: "您确定要修改密码吗？",
    resetPasswordMessage: "请您牢记最新修改的密码，提交后将不再显示；且修改后，用户原密码将不可用",
    newPassword: "新的账户密码",
    babyList: "负责宝宝列表",
    newBaby: "添加新宝宝",
    babyName: "宝宝姓名",
    gender: "性别",
    master: "主看护人",
    operate: "操作",
    unbind: "解绑",
    unbindSuccessfully: "解绑成功",
    unbindBaby: "解绑宝宝",
    unbindBabyMessage:
      "解绑宝宝后，该宝宝将处于未分配状态，且不会出现在社区工作者 app 端宝宝列表中，该工作者也无法对宝宝进行家访。确定要继续吗？",
    assignBaby: "分配新宝宝",
    assignChw: "分配新人员",
    unbindChw: "解绑社区工作者",
    unbindChwMessage: "确认要解绑此社区工作者？",
    assignNewChw: "分配新社区工作者",
    saveSuccessfully: "保存成功",
  },
  common: {
    wordBreak: "",
    enter: "请输入",
    unit: {
      day: "天",
      person: "位(人)",
      item: "条",
    },
    excel: {
      downloadTemplate: "下载模板",
      importData: "导入数据",
      finishImport: "导入完成",
      importSuccess: "导入成功",
      clickToUploadExcel: "点击上传Excel",
      support: "支持 xls/xlsx",
      filesizeMaxTo5M: "大小不超过5M",
      batchImportCountSuggest: "单次导入数据最好不超过500条",
      verifiedDataCount: "成功校验数据",
      importBaby: {
        duplicateId: "表内ID重复",
        emptyId: "宝宝ID为空",
        emptyBabyName: "宝宝姓名为空",
        invalidGender: "宝宝性别为空/格式错误",
        invalidGrowthStage: "宝宝成长阶段为空/格式错误",
        emptyArea: "宝宝地区为空",
        emptyLocation: "宝宝详细地址为空",
        emptyCaregiver: "至少添加一位主看护人",
        invalidCaregiver: "看护人信息不符合规则",
        emptyEDC: "预产期为空",
        invalidFormatDueDay: "预产期格式错误",
        invalidDueDay: "预产期不能小于当前时间",
        emptyBirthDay: "生日为空",
        invalidFormatBirthDay: "生日格式错误",
        invalidBirthDay: "生日不能大于当前时间",
      }
    },
    confirm: "确定",
    add: "添加",
    delete: "删除",
    submit: "提交",
    cancel: "放弃",
    total: "共",
    close: "关闭",
    row: "行号",
    babyName: "宝宝姓名",
    errorItem: "错误事项",
    searchInputByNameIDAreaPlaceholder: "请输入姓名、ID或所在区域搜索",
    /* eslint-disable no-template-curly-in-string */
    validateMessages: {
      // node_modules/rc-field-form/lib/interface.d.ts
      required: "请输入${label}！",
      string: {
        min: "${label}长度不得少于${min}位",
        max: "${label}长度不得多于${max}位",
      },
    },
  },
  enum: {
    FeedingPattern: {
      BREAST_MILK: "纯母乳喂养",
      MILK_POWDER: "纯奶粉喂养",
      MIXED: "母乳奶粉混合喂养",
      TERMINATED: "已终止母乳/奶粉喂养",
    },
    Gender: {
      MALE: "男",
      FEMALE: "女",
      UNKNOWN: "未知",
    },
    BabyStage: {
      EDC: "待产期",
      BIRTH: "已出生",
    },
    AssistedFood: {
      TRUE: "已添加",
      FALSE: "未添加",
    },
    RELATIVES: {
      MOTHER: "妈妈",
      FATHER: "爸爸",
      GRANDMOTHER: "奶奶",
      GRANDMA: "外婆",
      GRANDFATHER: "爷爷",
      GRANDPA: "外公",
      OTHER: "其他",
    },
    CurriculumBabyStage: {
      EDC: "已怀孕",
      BIRTH: "已出生",
    },
    ModuleTopic: {
      MOTHER_NUTRITION: "母亲营养",
      BREASTFEEDING: "母乳喂养",
      BABY_FOOD: "婴儿辅食",
      INFANT_INJURY_AND_PREVENTION: "婴儿伤病和预防",
      CAREGIVER_MENTAL_HEALTH: "照料人心理健康",
      GOVERNMENT_SERVICES: "政府服务",
      KNOWLEDGE_ATTITUDE_TEST: "知识态度检测",
    },
  },

  curriculum: {
    createNewCurriculum: "创建新大纲",
    curriculumManagement: "大纲管理",
    saveToDraft: "保存至草稿",
    publish: "保存并发布",
    unpublishedDraft: "本大纲有1个尚未发布的草稿：",
    editDate: "编辑日期",
    deleteDraft: "删除草稿",
    deleteDraftWarn: "删除草稿后将无法恢复是否继续？",
    editDraft: "继续编辑",
    curriculumInformation: "大纲基本信息",
    curriculumName: "大纲名称",
    enterCurriculumNameWithLimit: " 请输入大纲名称，限 20 个汉字",
    curriculumDescription: "大纲描述",
    enterCurriculumDescriptionWithLimit: "请输入大纲描述，限 50 个汉字",
    sessions: "课堂列表",
    pleaseNote: "请注意",
    sessionApplicabilityWarning: "1.课堂适用时间不符合已添加匹配规则的时间范围会导致匹配规则内已添加的课堂丢失",
    modifyApplicabilityWarning: "2.修改适用时间可能会导致一些拜访计划不可用，请及时通知社区工作者",
    addNewSession: "添加新课堂",
    editSession: "编辑课堂",
    sessionNumber: "课堂序号",
    sessionName: "课堂名称",
    sessionDescription: "课堂描述",
    applicableBaby: "适用宝宝",
    pregnant: "已怀孕",
    born: "已出生",
    modulesIncluded: "包含模块",
    survey: "调查问卷",
    textSurvey: "短信问卷",
    cancel: "取消",
    submit: "提交",
    endDayGreaterThanStart: "必须大于起始天数",
    curriculumRangeMatchingRule: "大纲区间匹配规则",
    addRule: "添加规则",
    editMatchingRule: "编辑规则",
    ruleName: "规则名称",
    sessionsIncluded: "包含课堂",
    delete: "删除",
    edit: "编辑",
    deleteCurriculum: "删除大纲",
    deleteCurriculumWarning:
      "删除大纲后，会将大纲分配的所有宝宝的待开始家访清除，这些宝宝安排家访时将找不到匹配的课堂是否继续？",
    editCurriculum: "编辑大纲",
    unsavedChangesWarning: "当前页面有未保存或未提交的内容，离开后将丢失已编辑内容，您确定要离开吗?",
    applicableDays: "适用天数",
    to: "至",
    applicableDaysOverlap: "适用天数不能重叠",
    deleteRule: "删除规则",
    deleteRuleConfirmation: "您确定要删除这个规则吗？此操作不可撤销。",
    atLeastOneMatchingPlan: "至少添加一个匹配计划",
    atLeastOneSession: "至少添加一个课堂",
    lessonOperationWarn: "删除课堂同时会导致之前已添加的匹配规则中的此课堂丢失",
    matchingPlanAtLeastOneSession: "匹配计划{{name}}至少包含一个课堂",
    curriculumNameTooLong: "大纲名称最多20个字符",
    curriculumDescriptionTooLong: "大纲描述最多50个字符",
    sessionNumberDuplicate: "课堂序号不能重复",
    startDateRequired: "请输入适用天数!",
    endDateRequired: "请输入适用天数!",
    applicableBabyGrowthPeriod: "适用宝宝成长时期区间",
    operation: "操作",
  },
  curriculums: {
    curriculumManagement: "大纲管理",
    searchByCurriculumName: "请输入大纲名称搜索",
    createNewCurriculum: "创建新大纲",
    curriculumStatus: "大纲状态",
    curriculumName: "大纲名称",
    action: "操作",
    assignBaby: "分配宝宝",
    babyList: "宝宝列表",
    curriculumAssignedBabyList: "大纲分配宝宝列表",
    babyAutoAssignTip: "宝宝将自动分配至最新发布的大纲版本",
    addNewBaby: "添加新宝宝",
    babyName: "宝宝姓名",
    ID: "ID",
    gender: "性别",
    area: "所在区域",
    primaryCaregiver: "主照料人",
    contactPhone: "联系电话",
    delete: "删除",
  },
  error: {
    serviceError: "服务异常，请稍后重试",
    networkError: "网络异常，请稍后重试",
    wrongOldPassword: "旧密码错误",
    userExists: "账户名称: {{login}} 已经存在",
    idExists: "ID: {{id}} 已经存在",
    noPrimaryCaregiver: "请至少设置一个主看护人",
    emptyMedia: "有媒体组件没有上传文件！"
  },
  module: {
    createNewModule: "创建新模块",
    moduleManagement: "模块管理",
    copyMoudle: "复制模块",
    deleteModule: "删除模块",
    deleteModuleWarning: "删除后模块内容将无法恢复是否继续？",
    editModule: "编辑模块",
    saveToDraft: "保存至草稿",
    saveAndPublish: "保存并发布",
    unpublishedDraft: "本模块有1个尚未发布的草稿：",
    moduleInformation: "模块基本信息",
    moduleName: "模块名称",
    enterModuleNameWithLimit: "请输入模块名称，限40个字符",
    moduleNumber: "模块编号",
    enterModuleNumberWithLimit: "请输入模块编号，限20个字符",
    moduleDescription: "模块描述",
    enterModuleDescriptionWithLimit: "请输入模块描述，限200个字符",
    moduleTheme: "模块主题",
    selectModuleTheme: "请选择模块主题",
    moduleContent: "模块内容",
    atLeastOneComponent: "至少添加一个组件",
    unsavedChangesWarning: "当前页面有未保存或未提交的内容，离开后将丢失已编辑内容，您确定要离开吗?",
    moduleNameTooLong: "模块名称最多40个字符",
    moduleNumberTooLong: "模块编号最多20个字符",
    moduleDescriptionTooLong: "模块描述最多200个字符",
    loginApp: "登录APP",
    myAccount: "个人中心",
    scan: "扫码预览"
  },
  modules: {
    moduleManagement: "模块管理",
    searchModulePlaceholder: "请输入模块名称搜索",
    createNewModule: "创建新模块",
    moduleStatus: "模块状态",
    moduleNumber: "模块编号",
    moduleName: "模块名称",
    moduleTheme: "模块主题",
  },
  case: {
    option: "选项 {{index}}",
    selectOptionEndJump: "请选择选项结束跳转至",
    enterOptionText: "请输入选项文本，限20个字符",
    maxNestedLevels: "选项组件嵌套层级最多为3级",
    addText: "添加文本",
    addMedia: "添加媒体",
    addChoice: "添加选择",
  },
  media: {
    mediaComponent: "媒体组件",
    clickToUploadImage: "点击上传图片",
    supportedImageFormats: "支持JPG/PNG/GIF",
    maxImageSize: "大小不超过5M",
    recommendedImageRatio: "建议尺寸为 16:10",
    clickToUploadVideo: "点击上传视频",
    supportedVideoFormats: "支持MP4",
    maxVideoSize: "大小不超过1G",
    recommendedVideoRatio: "建议尺寸为 16:10",
    enterMediaDescription: "请输入媒体描述文本",
  },
  moduleComponents: {
    addComponent: "添加组件：",
    addTextComponent: "添加文本组件",
    addMediaComponent: "添加媒体组件",
    addChoiceComponent: "添加选择组件",
    addPageBreakComponent: "添加翻页分割组件",
  },
  pageFooter: {
    pageBreakLine: "翻页分割线",
    remove: "移除",
  },
  questionRadio: {
    textQuestion: "文本问题",
    singleChoiceQuestion: "单选问题",
    multipleChoiceQuestion: "多选问题",
    questionText: "题干文本",
    enterQuestionText: "请输入题干文本",
    required: "必填！",
    option: "选项",
    pleaseEnterContent: "请输入内容",
    clickToAddOption: "点击添加选项",
    addTextBox: "附文本框",
    remove: "移除",
    cantBeEmpty: "不能为空！",
  },
  questionText: {
    textQuestion: "文本问题",
    singleChoiceQuestion: "单选问题",
    multipleChoiceQuestion: "多选问题",
    enterText: "请输入叙述文本内容",
    required: "必填！",
  },
  surveyComponents: {
    addComponent: "添加组件：",
    addTextQuestion: "添加文本问题",
    addSingleChoiceQuestion: "添加单选问题",
    addMultipleChoiceQuestion: "添加多选问题",
  },
  switch: {
    choiceComponent: "选择组件",
    addOption: "添加选项",
  },
  text: {
    script: "叙述文本",
    instruction: "提示文本",
    reference: "参考文本",
    textComponent: "文本组件",
    enterTextContent: "请输入文本内容",
    type: "类型",
  },
  container: {
    remove: "移除",
  },
  action: {
    continueCurrentLevel: "继续本层级内容",
    jumpToAnotherModuleAndEnd: "跳转至其他模块并结束本模块",
    jumpToAnotherModuleAndContinue: "跳转至其他模块并返回继续本层级的内容",
  },
  survey: {
    createNewSurvey: "创建新问卷",
    questionOrChoiceCannotBeEmpty: "题干或选项不能为空！",
    atLeastOneQuestion: "至少添加一个问题",
    unsavedChangesWarning: "当前页面有未保存或未提交的内容，离开后将丢失已编辑内容，您确定要离开吗?",
    surveyManagement: "问卷管理",
    deleteSurvey: "删除问卷",
    deleteSurveyWarning: "删除后，问卷内容将无法恢复，是否继续？",
    editSurvey: "编辑问卷",
    saveToDraft: "保存至草稿",
    saveAndPublish: "保存并发布",
    unpublishedDraft: "本问卷有1个尚未发布的草稿：",
    surveyInformation: "问卷基本信息",
    surveyName: "问卷名称",
    enterSurveyName: "请输入问卷名称",
    enterSurveyNameWithLimit: "请输入问卷名称，限40个字符",
    surveyContent: "问卷内容",
  },
  surveys: {
    surveyManagement: "问卷管理",
    searchSurveyPlaceholder: "请输入问卷名称搜索",
    createNewSurvey: "创建新问卷",
    surveyStatus: "问卷状态",
    surveyName: "问卷名称",
  },
  statusTag: {
    published: "已发布",
    draft: "草稿",
  },
  config: {
    draftSaveSuccessfully: "草稿保存成功",
    addSuccessfully: "添加成功",
    publishSuccessfully: "发布成功",
    curriculumPublishedMessage: "大纲已发布，可以添加宝宝后在app端查看",
    modulePublishedMessage: "模块已发布，可在课堂编辑时关联此模块",
    passwordChangedSuccessfully: "密码修改成功",
    deleteSuccessfully: "删除成功",
  },
  validation: {
    sessionNumber: {
      required: "Please enter session number",
    },
    sessionName: {
      required: "Please enter session name",
    },
    sessionDescription: {
      required: "Please enter session description",
    },
    applicableBabyStage: {
      required: "Please set applicable baby stage",
    },
    applicableDays: {
      required: "Please enter days",
    },
    modulesIncluded: {
      required: "Please enter module(s) included",
    },
  },
  antd: {
    local: zhCN
  },
};
