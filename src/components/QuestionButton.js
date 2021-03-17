import React from "react";
import styled from "styled-components";
import {Row, Col} from 'antd';
import { Iconfont } from "./*";

export default function QuestionButton({ icon, title, children }) {
  return (
    <Container>
      <RowLine>
        <Col span={6}>
          <Iconfont type={icon} size={40} />
        </Col>
        <Text span={18}>
          <Title>{title}</Title>
        </Text>
      </RowLine>
    </Container>
  );
}

const Container = styled.div`
  background: #fff9f5;
  border: 1px solid #ffc3a0;
  border-radius: 8px;
  margin: 0 15px;
  cursor: pointer;
  /* text-align: center; */
  text-align: -webkit-center;
`;

const Title = styled.span`
  color: #ff794f;
  font-weight: bold;
`;

const Text = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: justify;
`

const RowLine = styled(Row)`
  width: 188px;
`