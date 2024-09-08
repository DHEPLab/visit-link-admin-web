import React from "react";
import styled from "styled-components";

import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/user";
import ActivableLink from "@/components/ActivableLink";

const Menu: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role === "ROLE_ADMIN";
  const isSuperAdmin = user?.role === "ROLE_SUPER_ADMIN";
  const { t } = useTranslation("menu");

  return (
    <Container>
      <MenuItemGroup>
        {isSuperAdmin && (
          <li>
            <ActivableLink title={t("projectManagement")} to="/projects" icon="iconproject" />
          </li>
        )}
        {isAdmin && (
          <>
            <li>
              <ActivableLink title={t("curriculumManagement")} to="/curriculums" icon="iconcurriculum" />
            </li>
            <li>
              <ActivableLink title={t("moduleManagement")} to="/modules" icon="iconmodule" />
            </li>
            <li>
              <ActivableLink title={t("surveyManagement")} to="/surveys" icon="iconwenjuan" />
            </li>
          </>
        )}
        {!isSuperAdmin && (
          <>
            <li>
              <ActivableLink title={t("accountManagement")} to="/users" icon="iconuser" />
            </li>
            <li>
              <ActivableLink title={t("babyManagement")} to="/babies" icon="iconbaby" />
            </li>
          </>
        )}
      </MenuItemGroup>
    </Container>
  );
};

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

export default Menu;
