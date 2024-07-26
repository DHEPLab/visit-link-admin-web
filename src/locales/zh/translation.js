import zhCN from "antd/es/locale/zh_CN";

export default {
    signIn: {
        login: "登录",
        username: {
            lable: "账户名",
            placeholder: "请输入账户名",
            required: "请输入您的用户名"
        },
        password: {
            lable: "账户密码",
            placeholder: "请输入账户密码",
            required:"请输入您的密码"
        },
        errorMessage: "您输入的账号名称/账户密码可能有误",
        success: {
            title: "登录成功",
            message: "您已成功登录系统"
        }
    },
    header: {
        welcome: "{username}，欢迎您",
        myAccount: "个人中心",
        logOut: "退出",
        exportData: "数据导出",
        dataCategory: "数据类别",
        timeRange: "时间范围",
        completeVisits: "完成家访（已完成、已过期）",
        incompleteVisits: "未完成家访（待开始、未完成、已取消）",
        chw: "chw",
        baby: "宝宝"
    },
    app: {
        logoutSuccess: "您已退出登录",
        logoutMessage: "如您需进入系统，请重新登录"
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
        babyManagement: "宝宝管理"
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
        gender: '性别',
        area: '所在区域',
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
        approveArchiveTip: "请先核对社区工作者注销的宝宝账户信息。批准申请后，宝宝账户将从社区工作者 app 端移除，不再显示，但宝宝数据将保留在已审核宝宝列表中。",
        modifyBaby: "修改宝宝信息",
        modifyBabyTitle: "您确定要批准修改宝宝信息的申请吗？",
        approveModifyTip: "请先核对社区工作者修改的宝宝账户信息。批准申请后，宝宝账户信息将被修改。",
        batchNewBabiesTitle: "您确定要批准创建新宝宝账户的申请吗？",
        batchNewBabiesTip: "请先核对社区工作者提交的新宝宝账户信息，并设置宝宝ID，即可批准该账户新建申请。一旦批准申请后，宝宝ID将不可更改。",
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
        master: "主看护人",
        editCaregiver: "编辑看护人",
        maxTo4Caregiver: "看护人最多可添加4人",
        yes: "是",
        no: "否",
        name: "真实姓名",
        gender: '性别',
        growthStage: "成长阶段",
        dueDay: "预产期",
        birthDay: "出生日期",
        supplementaryFood: "辅食",
        add: "已添加",
        noAdd: "未添加",
        feedingMethods: "喂养方式",
        area: '所在区域',
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
        chw: "负责社区工作者",
        chwID: "社区工作者ID",
        chooseCHW: "选择社区工作者",
        changeCHW: "更改人员",
        assignCHW: "分配人员",
        reviewType: "审核类型",
        modifyDate: "修改日期",
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
        reLoginTip: "请您重新登录"
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
        searchChwPlaceholder: "请输入社区工作者姓名、ID或所在区域搜索",
        babyCount: "负责宝宝",
        accountInformation: "账户信息",
    },
    user: {
        accountManagement: "账户管理",
        accountInformation: "账户信息",
        aeleteAccount: "注销账户",
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
        unbindBaby: "解绑宝宝",
        unbindBabyMessage: "解绑宝宝后，该宝宝将处于未分配状态，且不会出现在社区工作者 app 端宝宝列表中，该工作者也无法对宝宝进行家访。确定要继续吗？",
        assignBaby: "分配新宝宝",
        assignChw: "分配新人员",
        unbindChw: "解绑社区工作者",
        unbindChwMessage: "确认要解绑此社区工作者？",
        assignNewChw: "分配新社区工作者",
    },
    common: {
        enter: "请输入",
        unit: {
            day: "天",
            person: "位(人)",
            items: "条",
        },
        excel: {
            downloadTemplate: "下载模板",
            importData: "导入数据",
            finishImport: "导入完成",
            clickToUploadExcel: "点击上传Excel",
            support: "支持 xls/xlsx",
            filesizeMaxTo5M: "大小不超过5M",
            batchImportCountSuggest: "单次导入数据最好不超过500条",
            verifiedDataCount: "成功校验数据",
        },
        confirm: "确定",
        add: "添加",
        submit: "提交",
        cancel: "放弃",
        total: "共",
        close: "关闭",
        row: "行号",
        babyName: "宝宝姓名",
        errorItem: "错误事项",
        searchInputByNameIDAreaPlaceholder: "请输入姓名、ID或所在区域搜索",
    },
    // enum: {
    //     FeedingPattern: {
    //         BREAST_MILK: "纯母乳喂养",
    //         MILK_POWDER: "纯奶粉喂养",
    //         MIXED: "母乳奶粉混合喂养",
    //         TERMINATED: "已终止母乳/奶粉喂养"
    //     },
    //     Gender: {
    //         MALE: "男",
    //         FEMALE: "女",
    //         UNKNOWN: "未知"
    //     },
    //     BabyStage: {
    //         EDC: "待产期",
    //         BIRTH: "已出生"
    //     },
    //     AssistedFood: {
    //         TRUE: "已添加",
    //         FALSE: "未添加"
    //     },
    //     RELATIVES: {
    //         MOTHER: "妈妈",
    //         FATHER: "爸爸",
    //         GRANDMOTHER: "奶奶",
    //         GRANDMA: "外婆",
    //         GRANDFATHER: "爷爷",
    //         GRANDPA: "外公",
    //         OTHER: "其他"
    //     }
    // },
    antd: zhCN,
}