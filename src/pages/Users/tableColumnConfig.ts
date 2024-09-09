import i18next from "@/i18n";
import { ColumnType } from "antd/es/table/interface";

const t = i18next.getFixedT(null, "users");

export const realName: ColumnType = {
  title: t("name"),
  align: "center",
  width: 100,
  dataIndex: ["user", "realName"],
};

export const phone: ColumnType = {
  title: t("phone"),
  width: 200,
  dataIndex: ["user", "phone"],
};

export const username: ColumnType = {
  title: t("username"),
  dataIndex: ["user", "username"],
  width: 200,
};
