import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Iconfont from './Iconfont';

export default function () {
  return (
    <Menu>
      <MenuItemGroup>
        <li>
          <ActivableLink
            to="/curriculums"
            icon="iconiconzuocexuanguadaohangkechengguanliweixuanzhong"
            activeIcon="iconiconzuocexuanguadaohangkechengguanliyixuanzhong"
          >
            课程管理
          </ActivableLink>
        </li>
        <li>
          <ActivableLink
            to="/modules"
            icon="iconxingzhuangiconzuocexuanguadaohangyonghuguanliweixuanzhong"
            activeIcon="iconiconzuocexuanguadaohangmokuaiguanliyixuanzhong"
          >
            模块管理
          </ActivableLink>
        </li>
        <li>
          <ActivableLink
            to="/users"
            icon="iconiconzuocexuanguadaohangyonghuguanliweixuanzhong"
            activeIcon="iconiconzuocexuanguadaohangyonghuguanliyixuanzhong"
          >
            账户管理
          </ActivableLink>
        </li>
        <li>
          <ActivableLink
            to="/babies"
            icon="iconiconzuocexuanguadaohangbaobaoguanliweixuanzhong"
            activeIcon="iconiconzuocexuanguadaohangbaobaoguanliyixuanzhong"
          >
            宝宝管理
          </ActivableLink>
        </li>
      </MenuItemGroup>
    </Menu>
  );
}

function ActivableLink({ to, icon, activeIcon, children }) {
  const location = useLocation();
  const active = location.pathname.includes(to);
  const className = active && 'active';
  const type = activeIcon;

  return (
    <StyledLink to={to} className={className}>
      {active && <ActiveBar />}
      <Wrapper>
        {type && <Iconfont opacity={active ? 1 : 0.5} type={type} size={20} />}
        {children}
      </Wrapper>
      <Iconfont type="iconiconjiantoudaohang" size={10} />
    </StyledLink>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.div`
  width: 248px;
  background: linear-gradient(180deg, rgba(255, 148, 114, 1) 0%, rgba(242, 112, 156, 1) 100%);
  padding-top: 50px;
  height: 100%;
  color: #fff;
`;

const MenuItemGroup = styled.ul`
  list-style: none;
  padding-inline-start: 0;
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
`;

const StyledLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 16px;
  opacity: 0.5;
  height: 80px;
  line-height: 80px;
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  font-weight: 400;
  &.active,
  &.active:hover {
    opacity: 1;
    color: #fff;
    font-weight: bold;
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
