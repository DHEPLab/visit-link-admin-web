import React from "react";
import styled from "styled-components";
import Iconfont from "./Iconfont";

export default function QuestionButton({ icon, title }) {
  return (
    <Container>
      <Line>
        <Iconfont type={icon} size={27} />
        <Title>{title}</Title>
      </Line>
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
  margin-bottom: 10px;
`;

const Title = styled.span`
  margin-left: 10px;
  color: #ff794f;
  font-weight: bold;
`;

const Line = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: justify;
`;
