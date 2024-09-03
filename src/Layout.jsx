import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { clearToken } from "@/utils/token";
import { Header, Menu, Message } from "@/components";
import { Role } from "@/constants/enums";
import styled from "styled-components";
import { useUserStore } from "@/store/user";

const Layout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("app");

  const { user, loadProfileSuccess } = useUserStore((state) => ({
    user: state.user,
    loadProfileSuccess: state.loadProfileSuccess,
  }));

  const loadProfile = useCallback(() => {
    axios
      .get("/api/account/profile")
      .then((r) => {
        loadProfileSuccess(r.data);
      })
      .catch(() => navigate("/sign_in"));
  }, [navigate]);

  useEffect(loadProfile, [loadProfile]);

  function handleLogout() {
    clearToken();
    navigate("/sign_in");
    Message.success(t("logoutSuccess"), t("logoutMessage"));
  }

  return (
    <>
      <Header username={user.realName} role={Role[user.role]} onNavigate={navigate} onLogout={handleLogout} />
      <RouteContainer>
        <Menu />
        <Main id="route-view">
          <Outlet />
        </Main>
      </RouteContainer>
    </>
  );
};

const RouteContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Main = styled.div`
  flex: 1;
  padding: 30px;
  overflow: auto;
  max-height: calc(100vh - 80px);
`;

export default Layout;
