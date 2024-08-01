import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

export default function StatusTag({ value }) {
  const { t } = useTranslation("statusTag");

  if (value) {
    return <TrueContainer>{t("published")}</TrueContainer>;
  }
  return <FalseContainer>{t("draft")}</FalseContainer>;
}

const TrueContainer = styled.div`
  display: inline-block;
  width: 56px;
  height: 20px;
  line-height: 20px;
  background: #d7f3de;
  border-radius: 4px;
  color: #64cf7f;
  font-size: 12px;
  text-align: center;
`;

const FalseContainer = styled(TrueContainer)`
  color: #ff794f;
  background: #ffede2;
`;
