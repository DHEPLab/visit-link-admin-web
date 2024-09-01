import React from "react";
import styled from "styled-components";
import { message as AntdMessage } from "antd";

import Iconfont from "./Iconfont";

const Message = {
  success: (title, message, duration) => {
    AntdMessage.success({
      duration: duration || 1,
      content: <MessageContent {...{ title, message }} />,
      icon: <i />,
      style: {
        marginTop: "10%",
      },
    });
  },
};

export default Message;

function MessageContent({ title, message }) {
  return (
    <Container>
      <Iconfont type="iconsuccess" size={60} />
      <Title>{title}</Title>
      <MessageBody>{message}</MessageBody>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  padding-top: 20px;
  height: 190px;
  width: 370px;
  border-radius: 8px;
  background: #fff;
`;

const Title = styled.div`
  font-size: 16px;
  color: #ff794f;
  font-weight: bold;
  margin-top: 18px;
`;

const MessageBody = styled.div`
  color: #8e8e93;
  font-size: 14px;
  margin-top: 20px;
`;
