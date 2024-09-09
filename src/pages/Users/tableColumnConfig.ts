import i18next from "@/i18n";

const t = i18next.getFixedT(null, "users");

export const realName = {
  title: t("name"),
  align: "center",
  width: 100,
  dataIndex: ["user", "realName"],
};

export const phone = {
  title: t("phone"),
  width: 200,
  dataIndex: ["user", "phone"],
};

export const username = {
  title: t("username"),
  dataIndex: ["user", "username"],
  width: 200,
};
