import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export default function () {
  return (
    <Menu>
      <MenuItemGroup>
        <li>
          <ActivableLink to="/curriculums">课程管理</ActivableLink>
        </li>
        <li>
          <ActivableLink to="/modules">模块管理</ActivableLink>
        </li>
        <li>
          <ActivableLink to="/users">账户管理</ActivableLink>
        </li>
        <li>
          <ActivableLink to="/babies">宝宝管理</ActivableLink>
        </li>
      </MenuItemGroup>
    </Menu>
  );
}

function ActivableLink({ to, icon, activeIcon, children }) {
  const location = useLocation();
  const active = location.pathname.includes(to);
  const className = active && 'active';
  // const type = active ? activeIcon : icon;

  return (
    <StyledLink to={to} className={className}>
      {/* {type && <Iconfont type={type} />} */}
      {children}
    </StyledLink>
  );
}

const Menu = styled.div`
  width: 248px;
  background: linear-gradient(
    180deg,
    rgba(255, 148, 114, 1) 0%,
    rgba(242, 112, 156, 1) 100%
  );
  padding-top: 50px;
  height: 100%;
  color: #fff;
`;

const MenuItemGroup = styled.ul`
  list-style: none;
  padding-inline-start: 0;
`;

const StyledLink = styled(Link)`
  display: block;
  color: white;
  font-size: 16px;
  opacity: 0.5;
  height: 80px;
  line-height: 80px;
  width: 100%;
  padding-left: 18px;
  &.active,
  &.active:hover {
    opacity: 1;
    color: #fff;
    font-weight: bold;
    border-left: 8px solid #fff;
    background: rgba(247, 247, 247, 0.3);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  svg {
    margin-right: 14px;
  }

  &:hover {
    color: white;
  }
`;
