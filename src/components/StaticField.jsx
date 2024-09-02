import React from "react";
import styled from "styled-components";
import { SwapRightOutlined } from "@ant-design/icons";

export default function StaticField({ label, labelStyle= {}, children, history = "" }) {
  return (
    <Container>
      <Label style={labelStyle}>{label}</Label>
      <Value>
        {history && (
          <History>
            {`${history} `}
            <SwapRightOutlined />
          </History>
        )}
        {children}
      </Value>
    </Container>
  );
}

const History = styled.span`
  color: #b2b2b2;
  font-weight: 400;
  font-size: 18px;
  margin-right: 10px;
  .anticon-swap-right {
    font-size: 24px;
  }
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  & + & {
    margin-top: 20px;
  }
`;

const Label = styled.div`
  width: 100px;
  text-align: right;
  margin-right: 30px;
  font-size: 16px;
  color: #8e8e93;
`;

const Value = styled.div`
  color: #4a4a4a;
  font-weight: bold;
  flex: 1;
  word-wrap: break-word;
  word-break: break-all;
  flex-wrap: wrap;
`;
