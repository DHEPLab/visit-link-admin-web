import React from "react";
import styled from "styled-components";
import { message as AntdMessage } from "antd";

import Iconfont from "./Iconfont";

const Message = {
  success: (title: string, message: string, duration?: number) => {
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

const MessageContent: React.FC<{ title: string; message: string }> = ({ title, message }) => {
  return (
    <Container>
      <Iconfont type="iconsuccess" size={60} />
      <Title>{title}</Title>
      <MessageBody>{message}</MessageBody>
    </Container>
  );
};

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

export default Message;
