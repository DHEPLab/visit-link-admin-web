import enUs from "antd/es/locale/en_US";
import PageFooter from "../../components/curriculum/PageFooter";

export default {
  signIn: {
    login: "Login",
    username: {
      lable: "username",
      placeholder: "Enter username",
      required: "Please enter username",
    },
    password: {
      lable: "Enter password",
      placeholder: "Enter password",
      required: "Please enter password",
    },
    errorMessage: "Incorrect username or password",
    success: {
      title: "Log In Successfully",
      message: "Please proceed to use the system.",
    },
  },
  header: {
    myAccount: "My Account",
    logOut: "Log Out",
    exportData: "Export Data",
    dataCategory: "Data Category",
    timeRange: "Time Range",
    completeVisits: "Completed Visits (Completed, Expired)",
    incompleteVisits: "Incomplete Visits (To Start, Not Completed, Cancelled)",
    chw: "CHW",
    baby: "Baby",
  },
  app: {
    logoutSuccess: "Log Out Successfully",
    logoutMessage: "To access the system, please log in again.",
  },
  roles: {
    ROLE_CHW: "CNW",
    ROLE_SUPERVISOR: "Supervisor",
    ROLE_ADMIN: "Admin",
  },
  menu: {
    curriculumManagement: "Curriculum Management",
    moduleManagement: "Module Management",
    surveyManagement: "Survey Management",
    accountManagement: "Account Management",
    babyManagement: "Baby Management",
  },
  babies: {
    babyManagement: "Baby Management",
    batchNewBabies: "Batch New Baby",
    newBaby: "New Baby",
    approved: "Approved",
    unreviewed: "Unreviewed",
    pending: "pending",
    importFromExcel: "Import from Excel",
    searchBabyInputPlaceholder: "Search by Baby name/ID/Area",
    babyName: "Baby Name",
    id: "ID",
    chwID: "CHW ID",
    gender: "Gender",
    area: "Area",
    chw: "CHW",
    completedSession: "Completed Session(s)",
    registerDate: "Initial Date",
    babyStatus: "Baby Status",
    active: "active",
    archive: "archive",
    currentProgress: "Current Progress",
    lastModifyAt: "Modify Date",
    sessions: "session(s)",
  },
  baby: {
    noSelectedChwWarning: "Please select at least one CHW",
    reactiveBaby: "Reactive Baby",
    archiveBaby: "Archive Baby",
    reactiveBabyConfirm: "Confirm to reactive Baby",
    babyManagement: "Baby Management",
    cancel: "Cancel",
    reactive: "Reactive",
    archive: "Archive",
    approve: "Approve",
    archiveTip:
      "After archive, community workers will be unable to continue viewing, modifying, or visiting this baby. Do you wish to proceed?",
    archiveReason: "Archive reason",
    archiveBabyTitle: "Are you sure to approve the application to archive the baby account?",
    later: "Later",
    babyInfo: "Baby Info",
    approveArchiveTip:
      "Please verify the baby account information that the CHW has requested to archive. Once the request is approved, the baby account will be removed from the community worker's app and will no longer be displayed, but the baby data will be retained in the approved baby list.",
    modifyBaby: "Modify Baby Information",
    modifyBabyTitle: "Are you sure to approve the application to modify baby information?",
    approveModifyTip:
      "Please review the baby account information modified by the CHW. Once the request is approved, the baby's account information will be updated.",
    batchNewBabiesTitle: "Are you sure to approve the batch new baby",
    batchNewBabiesTip:
      "Please verify the information submitted by the CHW for the new baby account and set the baby ID to approve the account creation request. Once the request is approved, the baby ID cannot be changed.",
    id: "Baby ID",
    waitingApproval: "Waiting Approval",
    visitHistory: "Visit History",
    visitStatus: "Visit Status",
    visitTime: "Visit Time",
    sessionContent: "Session Content",
    reasonOfUncompleteOrExpired: "Reason of Uncomplete/ Expired",
    deleteMasterWarning:
      "The primary caregiver cannot be deleted. Please replace the primary caregiver before performing this operation.",
    changeMasterConfirm: "设置当前看护人为主看护人时会替换原来的看护人，是否继续？",
    proceed: "Proceed",
    confirm: "Confirm",
    caregiverList: "Caregiver List",
    maxTo4Caregiver: "A maximum of 4 caregivers can be added",
    newCaregiver: "New Caregiver",
    deleteCaregiver: "Delete Caregiver",
    deleteCaregiverConfirm: "Are you sure to delete this caregiver?",
    master: "Primary Caregiver",
    editCaregiver: "Edit Caregiver",
    yes: "Yes",
    no: "No",
    name: "Name",
    gender: "Gender",
    growthStage: "Growth Stage",
    dueDay: "Due Day",
    birthDay: "Bitth Day",
    supplementaryFood: "Infant Supplementary Food",
    add: "Add",
    noAdd: "No Add",
    feedingMethods: "Feeding Methods",
    area: "Area",
    address: "Address",
    comments: "Comments",
    relatives: "Relatives",
    repeatRelatives: "Relatives cannot be selected repeatedly",
    contactPhone: "Phone",
    wechat: "Wechat",
    caregiverName: "Caregiver Name",
    operate: "Operation",
    delete: "Delete",
    edit: "Edit",
    chw: "CHW",
    chwID: "CHW ID",
    chooseCHW: "Choose the CHW",
    changeCHW: "Change CHW",
    assignCHW: "Assign CHW",
    reviewType: "Review Type",
    modifyDate: "Modify Date",
  },
  myAccount: {
    myAccount: "My Account",
    generalInformation: "General Information",
    edit: "Edit",
    name: "Name",
    phoneNumber: "Phone Number",
    permissions: "Permissions",
    accountInformation: "Account Information",
    username: "Username",
    password: "Password",
    editGeneralInformation: "Edit General Information",
    resetPassword: "Reset Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    passwordNotMatch: "The two passwords you entered do not match.",
    passwordChangedTip: "Password Reset Complete",
    reLoginTip: "Please log in again.",
  },
  users: {
    accountManagement: "Account Management",
    createNewUser: "Create New Account",
    chw: "CHW",
    supervisor: "Supervisor",
    admin: "Admin",
    generalInformation: "General Information",
    permissions: "Permissions",
    id: "ID",
    name: "Name",
    area: "Area",
    phone: "Phone",
    username: "Username",
    password: "Password",
    searchChwPlaceholder: "Search by CHW Name/ID/Area",
    babyCount: "Baby",
    accountInformation: "Account Information",
  },
  user: {
    accountManagement: "Account Management",
    accountInformation: "Account Information",
    aeleteAccount: "Delete Account",
    chw: "CHW",
    supervisor: "Supervisor",
    username: "Username",
    password: "Password",
    id: "ID",
    name: "Name",
    phone: "Phone",
    area: "Area",
    generalInformation: "General Information",
    edit: "Edit",
    resetPassword: "Reset Password",
    editGeneralInformation: "Edit General Information",
    deleteSuperviser: "Delete Superviser",
    delete: "Delete",
    cancel: "Cancel",
    deleteSuperviserMessage:
      "Attention! After deleting, the account will become inactive and cannot be recovered, and all CHW under the supervisor will be in an unassigned state.",
    deleteChw: "Delete CHW",
    generalDeleteMessage: "Attention! After deleting, the account will become inactive and cannot be recovered.",
    babyNotEmptyMessage:
      "Please transfer the baby under this CHW's responsibility to another CHW before proceeding with the deletion.",
    selectBabyPlaceholder: "Please choose a CHW to transfer baby.",
    confirmResetPassword: "Are you sure you want to rest your password?",
    resetPasswordMessage:
      "Please remember the latest password you changed. It will no longer be displayed after submission. After the reset, the original password will be unavailable.",
    newPassword: "New Password",
    babyList: "Baby List",
    newBaby: "New Baby",
    babyName: "Name",
    gender: "Gender",
    master: "Primary Caregiver",
    operate: "Operate",
    unbind: "Unbind",
    unbindSuccessfully: "Unbind Successfully",
    unbindBaby: "Unbind Baby",
    unbindBabyMessage:
      "After unbinding the baby, the baby will be in an unallocated state and will not appear in the baby list on the CHW app. The CHW will also be unable to conduct home visits for the baby. Are you sure you want to continue?",
    assignBaby: "Assign Baby",
    assignChw: "Assgin CHW",
    unbindChw: "Unbind CHW",
    unbindChwMessage: "Are you sure to unbind this CHW?",
    assignNewChw: "Assign New CHW",
    saveSuccessfully: "Save Successfully",
  },
  common: {
    wordBreak: " ",
    enter: "Please Enter ",
    unit: {
      day: "day(s)",
      person: "person",
      item: "item(s)",
    },
    excel: {
      downloadTemplate: "Download Template",
      importData: "Import Data",
      finishImport: "Finish",
      importSuccess: "Import Success",
      clickToUploadExcel: "Click to upload Excel",
      support: "Support xls/xlsx",
      filesizeMaxTo5M: "Max size up to 5M",
      batchImportCountSuggest: "Suggest: No more than 500 items/per time",
      verifiedDataCount: "Successfully verified",
    },
    confirm: "Comfirm",
    add: "Add",
    delete: "Delete",
    submit: "Submit",
    cancel: "Cancel",
    total: "Total",
    close: "Close",
    row: "row",
    babyName: "name",
    errorItem: "Error Item",
    searchInputByNameIDAreaPlaceholder: "Search by CHW Name/ID/Area",
    /* eslint-disable no-template-curly-in-string */
    validateMessages: {
      // node_modules/rc-field-form/lib/interface.d.ts
      required: "${label} is required!",
      string: {
        min: "${label} must be at least ${min} characters",
        max: "${label} must be no longer than ${max} characters",
      },
    },
  },
  enum: {
    FeedingPattern: {
      BREAST_MILK: "Breast Milk",
      MILK_POWDER: "Milk Powder",
      MIXED: "Mixed",
      TERMINATED: "Terminated",
    },
    Gender: {
      MALE: "Male",
      FEMALE: "Female",
      UNKNOWN: "Unknown",
    },
    BabyStage: {
      EDC: "EDC",
      BIRTH: "Birth",
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
      EDC: "Pregnant",
      BIRTH: "Born",
    },
  },
  curriculum: {
    createNewCurriculum: "Create New Curriculum",
    curriculumManagement: "Curriculum Management",
    saveToDraft: "Save to draft",
    publish: "Publish",
    unpublishedDraft: "This curriculum has an unpublished draft:",
    editDate: "Edit Date",
    deleteDraft: "Delete Draft",
    editDraft: "Edit Draft",
    curriculumInformation: "Curriculum Information",
    curriculumName: "Curriculum Name",
    enterCurriculumName: "Please enter curriculum name, no more than 100 characters",
    curriculumDescription: "Curriculum Description",
    enterCurriculumDescription: "Please enter curriculum description, no more than 1000 characters",
    sessions: "Sessions",
    pleaseNote: "Please note",
    sessionApplicabilityWarning:
      "1. Session applicability time that does not match the added matching rule's time range will result in the loss of sessions added within the matching rule.",
    modifyApplicabilityWarning:
      "2. Modifying the applicability time may render some visit plans unavailable. Please inform the community workers promptly.",
    addNewSession: "Add New Session",
    editSession: "Edit Session",
    sessionNumber: "Session Number",
    sessionName: "Session Name",
    sessionDescription: "Session Description",
    applicableBaby: "Applicable Baby",
    pregnant: "Pregnant",
    born: "Born",
    modulesIncluded: "Module(s) Included",
    survey: "Survey",
    textSurvey: "Text Survey",
    cancel: "Cancel",
    submit: "Submit",
    enterSessionNumber: "Please enter session number",
    enterSessionName: "Please enter session name",
    enterSessionDescription: "Please enter session description",
    enterDays: "Please enter days",
    enterModulesIncluded: "Please enter module(s) included",
    endDayGreaterThanStart: "The end day must be greater than the start day.",
    curriculumRangeMatchingRule: "Curriculum and Range Matching Rule",
    addRule: "Add Rule",
    editMatchingRule: "Edit Matching Rule",
    ruleName: "Rule Name",
    sessionsIncluded: "Session(s) Included",
    delete: "Delete",
    edit: "Edit",
    deleteCurriculum: "Delete Curriculum",
    deleteCurriculumWarning:
      "After deleting the curriculum, all scheduled home visits for the babies assigned to the curriculum will be cleared. These babies will not be able to find matching session(s) when scheduling home visits. Do you want to continue?",
    editCurriculum: "Edit Curriculum",
    unsavedChangesWarning:
      "The current page has unsaved or unsubmitted content. If you leave, you will lose the edited content. Are you sure you want to leave?",
    applicableDays: "Applicable Days",
    to: "to",
    applicableDaysOverlap: "Applicable days cannot overlap",
    rule: "Rule",
    applicableBabyGrowthPeriod: "Applicable Baby Growth Period",
    operation: "Operation",
    deleteRule: "Delete Rule",
    deleteRuleConfirmation: "Are you sure you want to delete this rule? This action cannot be undone.",
  },
  curriculums: {
    curriculumManagement: "Curriculum Management",
    searchByCurriculumName: "Search by curriculum name",
    createNewCurriculum: "Create New Curriculum",
    curriculumStatus: "Curriculum Status",
    curriculumName: "Curriculum Name",
    action: "Action",
    assignBaby: "Assign Baby",
    babyList: "Baby List",
    curriculumAssignedBabyList: "Curriculum Assigned Baby List",
    babyAutoAssignTip: "Babies will be automatically assigned to the latest published curriculum version",
    addNewBaby: "Add New Baby",
    babyName: "Baby Name",
    ID: "ID",
    gender: "Gender",
    area: "Area",
    primaryCaregiver: "Primary Caregiver",
    contactPhone: "Contact Phone",
    delete: "Delete",
  },
  error: {
    serviceError: "Service error, please try again later.",
    networkError: "Network error, please try again later.",
    wrongOldPassword: "Wrong old password",
    userExists: "Username: {{login}} exsits",
    idExists: "ID: {{id}} exsits",
  },
  module: {
    createNewModule: "Create New Module",
    moduleManagement: "Module Management",
    deleteModule: "Delete Module",
    deleteModuleWarning: "After deletion, the module content cannot be recovered. Do you want to continue?",
    editModule: "Edit Module",
    saveToDraft: "Save to draft",
    saveAndPublish: "Save and Publish",
    unpublishedDraft: "This module has an unpublished draft:",
    moduleInformation: "Module Information",
    moduleName: "Module Name",
    enterModuleName: "Please enter module name, no more than 40 characters",
    moduleNumber: "Module Number",
    enterModuleNumber: "Please enter module number, no more than 20 characters",
    moduleDescription: "Module Description",
    enterModuleDescription: "Please enter module description, no more than 200 characters",
    moduleTheme: "Module Theme",
    selectModuleTheme: "Please select module theme",
    moduleContent: "Module Content",
    atLeastOneComponent: "Please add at least one component",
    unsavedChangesWarning:
      "The current page has unsaved or unsubmitted content. If you leave, you will lose the edited content. Are you sure you want to leave?",
  },
  modules: {
    moduleManagement: "Module Management",
    searchModulePlaceholder: "Search by module name",
    createNewModule: "Create New Module",
    moduleStatus: "Module Status",
    moduleNumber: "Module Number",
    moduleName: "Module Name",
    moduleTheme: "Module Theme",
  },
  case: {
    option: "Option {{index}}",
    selectOptionEndJump: "Please select where to jump after this option",
    enterOptionText: "Please enter option text, up to 20 characters",
    maxNestedLevels: "Option components can be nested up to 3 levels",
    addText: "Add Text",
    addMedia: "Add Media",
    addChoice: "Add Choice",
  },
  media: {
    mediaComponent: "Media Component",
    clickToUploadImage: "Click to Upload Picture",
    supportedImageFormats: "Supports JPG/PNG/GIF",
    maxImageSize: "File size should not exceed 5MB",
    recommendedImageRatio: "Recommended aspect ratio is 16:10",
    clickToUploadVideo: "Click to Upload Video",
    supportedVideoFormats: "Supports MP4",
    maxVideoSize: "File size should not exceed 1GB",
    recommendedVideoRatio: "Recommended aspect ratio is 16:10",
    enterMediaDescription: "Please enter media description text",
  },
  moduleComponents: {
    addComponent: "Add Component:",
    addTextComponent: "Add Text Component",
    addMediaComponent: "Add Media Component",
    addChoiceComponent: "Add Choice Component",
    addPageBreakComponent: "Add Page Break Component",
  },
  PageFooter: {
    pageBreakLine: "Page Break Line",
    remove: "Remove",
  },
  antd: enUs,
};
