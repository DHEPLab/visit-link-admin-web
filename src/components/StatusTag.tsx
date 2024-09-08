import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

interface StatusTagProps {
  value: boolean;
  trueText?: string;
  falseText?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ value, trueText, falseText }) => {
  const { t } = useTranslation("statusTag");

  if (value) {
    return <TrueContainer>{trueText ?? t("published")}</TrueContainer>;
  }
  return <FalseContainer>{falseText ?? t("draft")}</FalseContainer>;
};

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

export default StatusTag;
