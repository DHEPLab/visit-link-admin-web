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
    welcome: "Welcome, {username}",
    role: "Role: {role}",
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
    antd: enUs,
}