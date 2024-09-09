import { useTranslation } from "react-i18next";
import { Button } from "antd";
import Iconfont from "@/components/Iconfont";
import styled from "styled-components";
import React, { MouseEventHandler } from "react";
import isPropValid from "@emotion/is-prop-valid";

interface PageFooterTitleProps {
  onRemove?: MouseEventHandler;
  readonly?: boolean;
  focus?: boolean;
  onFocus?: VoidFunction;
}

const PageFooterTitle: React.FC<PageFooterTitleProps> = ({ onRemove, readonly, focus, onFocus }) => {
  const { t } = useTranslation("pageFooter");

  return (
    <TitleContainer focus={focus}>
      <Title onClick={() => !readonly && onFocus?.()}>{t("pageBreakLine")}</Title>
      <SplitLine />
      {!readonly && (
        <Button size="small" type="link" onClick={onRemove}>
          <Iconfont type="icontrash-orange" size={14} /> {t("remove")}
        </Button>
      )}
    </TitleContainer>
  );
};

const SplitLine = styled.div`
  height: 4px;
  flex: 1;
  background-image: linear-gradient(to right, #ff794f 50%, rgba(255, 255, 255, 0) 0%);
  background-position: bottom;
  background-size: 14px 3px;
  background-repeat: repeat-x;
  margin: 0 30px;
`;

const Title = styled.div`
  color: #8e8e93;
  font-weight: bold;
  cursor: pointer;
`;

const TitleContainer = styled("div").withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "focus",
})<{ focus?: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  border: 2px solid #eee;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  padding: 0 30px;
  justify-content: space-between;

  ${({ focus }) =>
    focus &&
    `
    border: 2px dashed #FF794F;
  `}
`;

export default PageFooterTitle;
