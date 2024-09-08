import { Link, useLocation } from "react-router-dom";
import Iconfont from "@/components/Iconfont";
import React from "react";
import styled from "styled-components";

interface ActivableLinkProps {
  to: string;
  icon?: string;
  title: string;
}

const ActivableLink: React.FC<ActivableLinkProps> = ({ to, icon, title }) => {
  const location = useLocation();
  const active = location.pathname.includes(to);
  const className = active ? "active" : undefined;

  return (
    <StyledLink to={to} className={className}>
      <ActiveBar className="active-bar" />
      <Wrapper>
        {icon && <Iconfont opacity={active ? 1 : 0.5} type={icon} size={20} />}
        {title}
      </Wrapper>
      <Iconfont type="iconarrow" size={10} />
    </StyledLink>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveBar = styled.div`
  position: absolute;
  width: 8px;
  height: 100%;
  left: 0;
  top: 0;
  background: #fff;
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  display: none;
`;

const StyledLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 16px;
  opacity: 0.5;
  height: auto;
  min-height: 80px;
  line-height: 20px;
  padding: 20px 40px;
  margin: 2px 0;
  font-weight: 400;
  white-space: normal;
  overflow: visible;

  &.active,
  &.active:hover,
  &:hover {
    opacity: 1;
    color: #fff;
    font-weight: bold;
    background: rgba(247, 247, 247, 0.3);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    .active-bar {
      display: block;
    }
  }

  svg {
    margin-right: 14px;
  }

  &:hover {
    color: white;
  }
`;

export default ActivableLink;
