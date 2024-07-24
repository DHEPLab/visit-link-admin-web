import enUs from "antd/es/locale/en_US";

export default {
    signIn: {
        login: "login",
        username: {
            lable: "username",
            placeholder: "please enter the username"
        },
        password: {
            lable: "password",
            placeholder: "please enter the password"
        },
        errorMessage: "The account name/password you entered may be incorrect.",
        success: {
            title: "login success",
            message: "You have successfully logged into the system"
        }
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
        baby: "Baby"

    },
    app: {
        logoutSuccess: "Log Out Successfully",
        logoutMessage: "To access the system, please log in again."
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
        babyManagement: "Baby Management"
    },
    babies: {
        babyManagement: "Baby Management",
        batchNewBabies: "Batch New Baby",
        newBaby: "New Baby",
        approved: "reviewed",
        unreviewed: "waiting review",
        pending: "pending",
        importFromExcel: "Import from Excel",
        searchBabyInputPlaceholder: "Search by Baby name/ID/Area",
        babyName: "Baby Name",
        id: "ID",
        gender: 'Gender',
        area: 'Area',
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
        archiveTip: "After archive, community workers will be unable to continue viewing, modifying, or visiting this baby. Do you wish to proceed?",
        archiveReason: "Archive reason",
        archiveBabyTitle: "Are you sure to approve the application to archive the baby account?",
        later: "Later",
        babyInfo: "Baby Info",
        approveArchiveTip: "Please verify the baby account information that the CHW has requested to archive. Once the request is approved, the baby account will be removed from the community worker's app and will no longer be displayed, but the baby data will be retained in the approved baby list.",
        modifyBaby: "Modify Baby Information",
        modifyBabyTitle: "Are you sure to approve the application to modify baby information?",
        approveModifyTip: "Please review the baby account information modified by the CHW. Once the request is approved, the baby's account information will be updated.",
        batchNewBabiesTitle: "Are you sure to approve the batch new baby",
        batchNewBabiesTip: "Please verify the information submitted by the CHW for the new baby account and set the baby ID to approve the account creation request. Once the request is approved, the baby ID cannot be changed.",
        id: "Baby ID",
        waitingApproval: "Waiting Approval",
        visitHistory: "Visit History",
        visitStatus: "Visit Status",
        visitTime: "Visit Time",
        sessionContent: "Session Content",
        reasonOfUncompleteOrExpired: "Reason of Uncomplete/ Expired",
        deleteMasterWarning: "The primary caregiver cannot be deleted. Please replace the primary caregiver before performing this operation.",
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
        gender: 'Gender',
        growthStage: "Growth Stage",
        dueDay: "Due Day",
        birthDay: "Bitth Day",
        supplementaryFood: "Infant Supplementary Food",
        add: "Add",
        noAdd: "No Add",
        feedingMethods: "Feeding Methods",
        area: 'Area',
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
        assignCHW: "Assign CHW"
    },
    common: {
        enter: "Please Enter ",
        unit: {
            day: "day(s)"
        }
    },
    antd: enUs,
}