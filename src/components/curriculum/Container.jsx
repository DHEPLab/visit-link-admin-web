import React from "react";
import styled from "styled-components";
import { Button, Space } from "antd";
import { Iconfont } from "..";
import { useTranslation } from "react-i18next";
import isPropValid from "@emotion/is-prop-valid";

export default function Container({
  readonly,
  icon,
  title,
  extra,
  children,
  nested,
  hideMove,
  hideRemove,
  onRemove,
  onMoveUp,
  onMoveDown,
  noPadding,
  component,
  right,
  focus,
  onFocus,
}) {
  const { t } = useTranslation("container");
  return (
    <Flex>
      {!readonly && !hideMove && (
        <MoveContainer testid="move">
          <Space direction="vertical">
            <IconfontButton type="iconup" size={24} onClick={onMoveUp} />
            <IconfontButton type="icondown" size={24} onClick={onMoveDown} />
          </Space>
        </MoveContainer>
      )}
      {component ? (
        component
      ) : (
        <StyledContainer nested={nested} focus={focus}>
          <TitleContainer>
            <Title onClick={() => !readonly && onFocus?.()}>
              {icon && <Iconfont type={icon} style={{ marginRight: "8px" }} />}
              <div>{title}</div>
              <ExtraContainer>{extra}</ExtraContainer>
            </Title>
            {!readonly && !hideRemove && (
              <Button size="small" type="link" onClick={onRemove}>
                <Iconfont type="icontrash-orange" size={14} /> {t("remove")}
              </Button>
            )}
            {right}
          </TitleContainer>
          <Body nested={nested} noPadding={noPadding}>
            {children}
          </Body>
        </StyledContainer>
      )}
    </Flex>
  );
}

const ExtraContainer = styled.div`
  margin-left: 20px;
`;

const IconfontButton = styled(Iconfont)`
  cursor: pointer;
  display: block;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

const MoveContainer = styled.div`
  margin-right: 14px;
`;

const Flex = styled.div`
  display: flex;
`;

const TitleContainer = styled.div`
  display: flex;
  height: 40px;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #eee;
`;

const StyledContainer = styled.div`
  flex: 1;
  border: 2px solid #eee;
  border-radius: 10px;
  margin-bottom: ${({ nested }) => (nested ? 0 : 20)}px;
  ${({ focus }) =>
    focus &&
    `
    border: 2px dashed #FF794F;
  `}
`;

const Title = styled.div`
  font-weight: bold;
  color: #8e8e93;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Body = styled("div").withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "noPadding",
})`
  ${({ noPadding }) => !noPadding && "padding: 10px;"}
  ${({ nested }) => nested && "margin-bottom: -20px;"}
`;
