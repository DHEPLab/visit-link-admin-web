import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Iconfont from './Iconfont';

export default function Menu() {
  const { user } = useSelector((state) => state.users);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <Container>
      <MenuItemGroup>
        {isAdmin && (
          <>
            <li>
              <ActivableLink title="大纲管理" to="/curriculums" icon="iconcurriculum" />
            </li>
            <li>
              <ActivableLink title="模块管理" to="/modules" icon="iconmodule" />
            </li>
          </>
        )}
        <li>
          <ActivableLink title="账户管理" to="/users" icon="iconuser" />
        </li>
        <li>
          <ActivableLink title="宝宝管理" to="/babies" icon="iconbaby" />
        </li>
      </MenuItemGroup>
    </Container>
  );
}

function ActivableLink({ to, icon, title }) {
  const location = useLocation();
  const active = location.pathname.includes(to);
  const className = active && 'active';

  return (
    <StyledLink to={to} className={className}>
      {active && <ActiveBar />}
      <Wrapper>
        {icon && <Iconfont opacity={active ? 1 : 0.5} type={icon} size={20} />}
        {title}
      </Wrapper>
      <Iconfont type="iconarrow" size={10} />
    </StyledLink>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  width: 248px;
  background: linear-gradient(180deg, rgba(255, 148, 114, 1) 0%, rgba(242, 112, 156, 1) 100%);
  padding-top: 10px;
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
