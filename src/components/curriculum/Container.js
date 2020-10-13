import React from "react";
import styled from "styled-components";
import { Button, Space } from "antd";
import { Iconfont } from "../*";

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
}) {
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
        <StyledContainer nested={nested}>
          <TitleContainer>
            <Title>
              {icon && <Iconfont type={icon} style={{ marginRight: "8px" }} />}
              <div>{title}</div>
              <ExtraContainer>{extra}</ExtraContainer>
            </Title>
            {!readonly && !hideRemove && (
              <Button size="small" type="link" onClick={onRemove}>
                <Iconfont type="icontrash-orange" size={14} /> 移除
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
  cursor: point;
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
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const StyledContainer = styled.div`
  flex: 1;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: ${({ nested }) => (nested ? 0 : 20)}px;
  ${({ active }) =>
    active &&
    `
    border-color: #8E8E93;
    border-width: 2px;`}
`;

const Title = styled.div`
  font-weight: bold;
  color: #8e8e93;
  display: flex;
  align-items: center;
`;

const Body = styled.div`
  ${({ noPadding }) => !noPadding && "padding: 10px;"}
  ${({ nested }) => nested && "margin-bottom: -20px;"}
`;
