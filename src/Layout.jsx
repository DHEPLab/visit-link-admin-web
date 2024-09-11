import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React, { Suspense, useCallback, useEffect } from "react";
import axios from "axios";
import { clearToken } from "@/utils/token";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Message from "@/components/Message";
import { Role } from "@/constants/enums";
import styled from "styled-components";
import { useUserStore } from "@/store/user";
import { Flex, Spin } from "antd";

const Layout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("app");

  const { user, loadProfileSuccess } = useUserStore((state) => ({
    user: state.user,
    loadProfileSuccess: state.loadProfileSuccess,
  }));

  const loadProfile = useCallback(
    (signal) => {
      axios
        .get("/api/account/profile", { signal })
        .then((r) => {
          loadProfileSuccess(r.data);
        })
        .catch(() => navigate("/sign_in"));
    },
    [navigate],
  );

  useEffect(() => {
    const abortController = new AbortController();
    loadProfile(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [loadProfile]);

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
        <Suspense
          fallback={
            <Flex align="center" justify="center" style={{ width: "100%" }}>
              <Spin size="large" />
            </Flex>
          }
        >
          <Main id="route-view">
            <Outlet />
          </Main>
        </Suspense>
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
