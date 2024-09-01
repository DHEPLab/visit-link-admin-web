import React from "react";
import styled from "styled-components";

export default function ContentHeader({ title, children }) {
  return (
    <ContentHeaderContainer>
      <Title>{title}</Title>
      <div>{children}</div>
    </ContentHeaderContainer>
  );
}

const ContentHeaderContainer = styled.div`
  height: 76px;
  width: 100%;
  margin-bottom: 20px;
  padding-left: 40px;
  padding-right: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  color: #ff794f;
  font-size: 24px;
  font-weight: bold;
`;
