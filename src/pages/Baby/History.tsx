import { useTranslation } from "react-i18next";
import { FamilyTies, FeedingPattern, Gender } from "@/constants/enums.ts";
import Card from "@/components/Card.tsx";
import ZebraTable from "@/components/ZebraTable.tsx";
import dayjs from "dayjs";
import styled from "styled-components";
import React from "react";
import { ModifyRecord } from "@/models/res/ModifyRecord";

interface HistoryProps {
  title: string;
  dataSource: { number: number } & ModifyRecord[];
  columnValues: { [key: string]: string };
}

const History: React.FC<HistoryProps> = ({ title, dataSource, columnValues }) => {
  const { t } = useTranslation(["baby", "common", "enum"]);

  function getValue(key: string, value: string) {
    switch (key) {
      case "gender":
        return Gender[value as keyof typeof Gender];
      case "assistedFood":
        return value ? t("AssistedFood.TRUE", { ns: "enum" }) : t("AssistedFood.FALSE", { ns: "enum" });
      case "feedingPattern":
        return FeedingPattern[value as keyof typeof FeedingPattern];
      case "master":
        return value ? t("yes") : t("no");
      case "familyTies":
        return FamilyTies[value as keyof typeof FamilyTies];
      default:
        return value;
    }
  }

  return (
    <Card title={title} noPadding>
      <ZebraTable
        rowKey="number"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("time"),
            dataIndex: "lastModifiedAt",
            width: 200,
            align: "center",
            render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: t("content"),
            dataIndex: "newValue",
            render: (_value, record) => {
              const { columnName, newValue, oldValue, roleName, userName } = record;
              const changeValues = (columnName || [])
                .filter((name) => name !== "chw")
                .map((name, index) => {
                  return columnValues[name]
                    ? {
                        columnName: columnValues[name],
                        oldValue: getValue(name, oldValue[index]),
                        newValue: getValue(name, newValue[index]),
                      }
                    : null;
                })
                .filter((e) => !!e);
              return (
                <div>
                  {changeValues.map((e, i) => {
                    const obj = e || {};
                    return (
                      <div key={i}>
                        <BlobFont>{`${roleName} ${userName}`}</BlobFont>
                        {t("changed")}
                        <BlobFont>{obj.columnName}</BlobFont>
                        {t("from")}
                        <BlobFont>{obj.oldValue}</BlobFont>
                        {t("to")}
                        <BlobFont>{obj.newValue}</BlobFont>；
                      </div>
                    );
                  })}
                </div>
              );
            },
          },
        ]}
      />
    </Card>
  );
};

const BlobFont = styled.span`
  font-weight: bold;
  color: #ff9c78;
  margin: 0 2px;
`;

export default History;
