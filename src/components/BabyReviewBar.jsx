import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { Space, Button } from "antd";
import { useTranslation } from "react-i18next";

import { ReviewActionFromApp } from "../constants/enums";

export default function BabyReviewBar({ baby, onApprove, onReject }) {
  const { t } = useTranslation("baby");

  return (
    <Container>
      <Title>
        {t("reviewType")}：{ReviewActionFromApp[baby.actionFromApp]}{" "}
      </Title>
      <Flex>
        {baby.closeAccountReason && <Label>{t("archiveReason")}：</Label>}
        <Value>{baby.closeAccountReason}</Value>
        <Label>{t("modifyDate")}：</Label>
        {baby.lastModifiedAt && <Value>{dayjs(baby.lastModifiedAt).format("YYYY/MM/DD")}</Value>}
        <Space size="large">
          {baby.actionFromApp === "MODIFY" && (
            <EditButton ghost type="primary" onClick={onReject}>
              {t("reject")}
            </EditButton>
          )}
          <EditButton ghost type="primary" onClick={onApprove}>
            {t("approve")}
          </EditButton>
        </Space>
      </Flex>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 70px;
  margin-bottom: 20px;
  background-color: #ff9472;
  color: #fff;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  color: #ffede2;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Value = styled.div`
  margin-right: 30px;
`;

const EditButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    background: #fff !important;
    border: none;
  }
`;
