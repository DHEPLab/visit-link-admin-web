import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Iconfont from "@/components/Iconfont";

interface DetailHeaderProps {
  icon: string;
  menu: string;
  title: string;
  role?: string;
  extra?: React.ReactNode;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ icon, menu, title, role, extra }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Flex>
        <Iconfont type={icon} />
        <Menu onClick={() => navigate(-1)}>{menu}</Menu>
        <Iconfont type="iconarrow-gray" size={10} />
        <Title>{title}</Title>
        {role && <Role>{role}</Role>}
      </Flex>
      {extra}
    </Container>
  );
};

const Container = styled.div`
  height: 76px;
  background: #fff;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Role = styled.div`
  padding: 4px 20px;
  border-radius: 4px;
  background: #eee;
  color: #4a4a4a99;
  margin-left: 30px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.div`
  color: #ff794f;
  font-weight: 500;
  margin-left: 8px;
  margin-right: 10px;
  cursor: pointer;
`;

const Title = styled.div`
  font-weight: bold;
  margin-left: 10px;
`;

export default DetailHeader;
