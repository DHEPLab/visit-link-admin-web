import React from "react";
import styled from "styled-components";
import { Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

export default function Card({ title, tooltip, children, extra, noPadding }) {
  return (
    <CardContainer>
      <TitleContainer>
        <Title>
          <label>{title}</label>
          {tooltip && (
            <Tooltip title={tooltip} placement="right">
              <InfoCircleFilled />
            </Tooltip>
          )}
        </Title>
        <div>{extra}</div>
      </TitleContainer>
      <Content noPadding={noPadding}>{children}</Content>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background: #fff;
  margin-bottom: 20px;
`;

const TitleContainer = styled.div`
  border-bottom: 2px solid #eee;
  height: 70px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  display: flex;
  align-items: center;

  label {
    font-size: 20px;
    font-weight: bold;
    color: #4a4a4a;
    margin-right: 5px;
  }
`;

const Content = styled.div`
  ${({ noPadding }) => !noPadding && "padding: 30px;"}
`;
