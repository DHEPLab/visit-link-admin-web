import Card from "@/components/Card";
import { Button, Space } from "antd";
import Iconfont from "@/components/Iconfont";
import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { useTranslation } from "react-i18next";

type QuestionOperationBarProps = {
  stickyTop: number;
  onAddTextQuestion: MouseEventHandler;
  onAddRadioQuestion: MouseEventHandler;
  onAddCheckboxQuestion: MouseEventHandler;
};

const QuestionOperationBar: React.FC<QuestionOperationBarProps> = (props) => {
  const { stickyTop, onAddTextQuestion, onAddRadioQuestion, onAddCheckboxQuestion } = props;
  const { t } = useTranslation("surveyComponents");

  return (
    <div>
      <StickyContainer top={stickyTop}>
        <Card title={t("addComponent")}>
          <Space direction="vertical" size="large">
            <Button type="primary" onClick={onAddTextQuestion}>
              <Iconfont type="iconquestion-text" /> {t("addTextQuestion")}
            </Button>
            <Button type="primary" onClick={onAddRadioQuestion}>
              <Iconfont type="iconquestion-radio" /> {t("addSingleChoiceQuestion")}
            </Button>
            <Button type="primary" onClick={onAddCheckboxQuestion}>
              <Iconfont type="iconquestion-checkbox" /> {t("addMultipleChoiceQuestion")}
            </Button>
          </Space>
        </Card>
      </StickyContainer>
    </div>
  );
};

const StickyContainer = styled("div").withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "top",
})<{ top: number }>`
  position: relative;
  top: ${({ top }) => top}px;
  height: 360px;
  margin-left: 40px;
  box-shadow: 0 4px 12px 0 rgba(255, 148, 114, 0.3);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

export default QuestionOperationBar;
