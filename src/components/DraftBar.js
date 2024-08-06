import React from "react";
import moment from "moment";
import styled from "styled-components";
import { Space, Button } from "antd";
import { useTranslation } from "react-i18next";

import { DeleteConfirmModal } from "./*";

export default function DraftBar({ title, onClick, onRemove, lastModifiedDraftAt }) {
  const { t } = useTranslation("curriculum");
  return (
    <Container>
      <Title>{title}</Title>
      <Flex>
        <Label> {t("editData")}：</Label>
        <Date>{moment(lastModifiedDraftAt).format("YYYY/MM/DD")}</Date>
        <Space size="large">
          <DeleteConfirmModal title={t("deleteDraft")} content={t("deleteDraftWarn")} onConfirm={onRemove}>
            <DeleteButton ghost>{t("deleteDraft")}</DeleteButton>
          </DeleteConfirmModal>
          <EditButton ghost type="primary" onClick={onClick}>
            {t("editDraft")}
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

const Date = styled.div`
  margin-right: 30px;
`;

const EditButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    background: #fff !important;
    border: none;
  }
`;

const DeleteButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    border-color: #fff !important;
    color: #fff !important;
  }
`;
