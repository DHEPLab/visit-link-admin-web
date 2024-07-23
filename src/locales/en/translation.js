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
    antd: enUs,
}