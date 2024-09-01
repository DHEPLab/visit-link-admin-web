import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect } from "react";
import Axios from "@/axiosConfig";
import store from "@/store";
import { apiAccountProfile } from "@/actions";
import { clearToken } from "@/utils/token";
import { Header, Menu, Message } from "@/components";
import { Role } from "@/constants/enums";
import styled from "styled-components";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const { t } = useTranslation("app");

  const loadProfile = useCallback(() => {
    Axios.get("/api/account/profile")
      .then((r) => store.dispatch(apiAccountProfile(r)))
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
