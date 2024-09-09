import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "radash";
import styled from "styled-components";
import Iconfont from "../Iconfont";
import { Button, Card, Space } from "antd";
import { insertComponent } from "./utils/moduleComponentsUtils";
import CurriculumFactory from "@/components/curriculum/curriculumFactory";
import isPropValid from "@emotion/is-prop-valid";
import { ArrayHelpers } from "formik/dist/FieldArray";

/**
 * Use a new Component to solve the issue where changing the stickyTop causes the entire Form to re-render when the
 * focus is on the rich text editor, resulting in the toolbar jumping up and down. Now, when stickyTop changes,
 * only the ToolBar Component is re-rendered.
 **/
type ToolBarProps = {
  readonly?: boolean;
  helpers: ArrayHelpers;
  focus: number;
  setFocus: React.Dispatch<React.SetStateAction<number>>;
};

function stickyScrollListener(offsetTop: number, onChangeStickyTop: (stickyTop: number) => void) {
  const onScroll = debounce({ delay: 100 }, (event) => {
    const diffTop = event.target.scrollTop - offsetTop;
    onChangeStickyTop(diffTop > 0 ? diffTop : 0);
  });
  document.getElementById("route-view")?.addEventListener("scroll", onScroll);
  return () => {
    document.getElementById("route-view")?.removeEventListener("scroll", onScroll);
  };
}

const ToolBar: React.FC<ToolBarProps> = ({ readonly, helpers, focus, setFocus }) => {
  const [stickyTop, setStickyTop] = useState(0);
  const { t } = useTranslation("moduleComponents");

  useEffect(() => {
    if (!readonly) {
      return stickyScrollListener(687, setStickyTop);
    }
  }, [readonly]);

  if (readonly) return null;

  return (
    <ComponentToolBar data-testid={"module-components-toolbar"}>
      <StickyContainer top={stickyTop}>
        <Card title={t("addComponent")}>
          <Space direction="vertical" size="large">
            <Button
              type="primary"
              onClick={() => insertComponent(helpers, CurriculumFactory.createText(), focus, setFocus)}
            >
              <Iconfont type="icontext" /> {t("addTextComponent")}
            </Button>
            <Button
              type="primary"
              onClick={() => insertComponent(helpers, CurriculumFactory.createMedia(), focus, setFocus)}
            >
              <Iconfont type="iconmedia" /> {t("addMediaComponent")}
            </Button>
            <Button
              type="primary"
              onClick={() => insertComponent(helpers, CurriculumFactory.createSwitch(), focus, setFocus)}
            >
              <Iconfont type="iconswitch" /> {t("addChoiceComponent")}
            </Button>
            <PageButton
              type="primary"
              onClick={() => insertComponent(helpers, CurriculumFactory.createPageFooter(), focus, setFocus)}
            >
              {t("addPageBreakComponent")}
            </PageButton>
          </Space>
        </Card>
      </StickyContainer>
    </ComponentToolBar>
  );
};

const PageButton = styled(Button)`
  min-width: 200px;
  width: auto;
`;

const ComponentToolBar = styled.div``;

const StickyContainer = styled("div").withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "top",
})<{
  top: number;
}>`
  position: relative;
  top: ${({ top }) => top}px;
  height: 360px;
  margin-left: 40px;
  box-shadow: 0 4px 12px 0 rgba(255, 148, 114, 0.3);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

export default ToolBar;
