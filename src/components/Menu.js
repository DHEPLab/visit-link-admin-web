import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Iconfont from "./Iconfont";
import { useTranslation } from "react-i18next";

export default function Menu() {
  const { user } = useSelector((state) => state.users);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const { t } = useTranslation('menu');


  return (
    <Container>
      <MenuItemGroup>
        {isAdmin && (
          <>
            <li>
              <ActivableLink title={t('curriculumManagement')} to="/curriculums" icon="iconcurriculum" />
            </li>
            <li>
              <ActivableLink title={t('moduleManagement')} to="/modules" icon="iconmodule" />
            </li>
            <li>
              <ActivableLink title={t('surveyManagement')} to="/surveys" icon="iconwenjuan" />
            </li>
          </>
        )}
        <li>
          <ActivableLink title={t('accountManagement')} to="/users" icon="iconuser" />
        </li>
        <li>
          <ActivableLink title={t('babyManagement')} to="/babies" icon="iconbaby" />
        </li>
      </MenuItemGroup>
    </Container>
  );
}

function ActivableLink({ to, icon, title }) {
  const location = useLocation();
  const active = location.pathname.includes(to);
  const className = active && "active";

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

