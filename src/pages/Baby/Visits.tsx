import { useTranslation } from "react-i18next";
import useFetch from "@/hooks/useFetch.ts";
import Card from "@/components/Card.tsx";
import ZebraTable from "@/components/ZebraTable";
import { VisitStatus } from "@/constants/enums";
import dayjs from "dayjs";
import React from "react";
import { VisitsResponse } from "@/models/res/Visit";
import { Lesson } from "@/models/res/Lesson";

const Visits: React.FC<{ babyId: string }> = ({ babyId }) => {
  const { t } = useTranslation("baby");
  const [dataSource] = useFetch<VisitsResponse>(`/admin/babies/${babyId}/visits`, {}, []);

  return (
    <Card title={t("visitHistory")} noPadding>
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("visitStatus"),
            dataIndex: "status",
            width: 140,
            align: "center",
            render: (h) => VisitStatus[h as keyof typeof VisitStatus],
          },
          {
            title: t("visitTime"),
            dataIndex: "visitTime",
            width: 280,
            render: (h) => dayjs(h).format("LLLL"),
          },
          {
            title: t("sessionContent"),
            dataIndex: "lesson",
            width: 300,
            render: (h: Lesson) => h?.modules?.map((m) => m.label).join(", "),
          },
          {
            title: t("reasonOfUncompleteOrExpired"),
            dataIndex: "remark",
          },
          {
            title: t("locationInfo"),
            dataIndex: "distance",
            render: (v) => t("homeVisitDistance", { distance: v || 0 }),
          },
        ]}
      />
    </Card>
  );
};

export default Visits;
