import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import { Space, Button } from "antd";

import Factory from "./factory";
import ComponentField from "./ComponentField";
import Iconfont from "../Iconfont";
import Card from "../Card";
import { useTranslation } from "react-i18next";
import { debounce } from "radash";

export function handleMoveUp(helpers, index, focus, setFocus) {
  if (index === 0) return;
  helpers.move(index, index - 1);
  if (focus === index) {
    setFocus(index - 1);
  }
}

export function handleMoveDown(helpers, index, focus, setFocus, componentSize) {
  if (index === componentSize - 1) return;
  helpers.move(index, index + 1);
  if (focus === index) {
    setFocus(index + 1);
  }
}

export function handleRemove(helpers, index, focus, setFocus) {
  helpers.remove(index);
  if (focus === index) {
    setFocus(-1);
  }
  if (focus > index) {
    setFocus(focus - 1);
  }
}

export function insertComponent(helpers, component, focus, setFocus) {
  if (focus === -1) {
    helpers.push(component);
  } else {
    helpers.insert(focus + 1, component);
    setFocus(focus + 1);
  }
}

export default function ModuleComponents({ value, readonly }) {
  const [focus, setFocus] = useState(-1);

  return (
    <FieldArray name="components">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {value.map((component, index) => (
                <ComponentField
                  key={component.key}
                  {...{ index, readonly, component, focus: focus === index }}
                  name="components"
                  onRemove={() => handleRemove(helpers, index, focus, setFocus)}
                  onMoveUp={() => handleMoveUp(helpers, index, focus, setFocus)}
                  onMoveDown={() => handleMoveDown(helpers, index, focus, setFocus, value.length)}
                  onFocus={() => setFocus(index)}
                />
              ))}
            </ComponentForm>
            <ToolBar {...{ readonly, helpers, focus, setFocus }} />
          </FieldArrayContainer>
        );
      }}
    </FieldArray>
  );
}

/**
 * 使用一个新的 Component 解决当焦点在富文本编辑器上时，改变 stickyTop 带来的重复渲染整个 Form 导致工具栏上下跳动的问题
 * 现在 stickyTop 改变时，只重新渲染 ToolBar Component
 */
function ToolBar({ readonly, helpers, focus, setFocus }) {
  const [stickyTop, setStickyTop] = useState(0);
  const { t } = useTranslation("moduleComponents");

  useEffect(() => {
    if (!readonly) {
      return stickyScrollListener(687, setStickyTop);
    }
  }, [readonly]);

  if (readonly) return null;

  return (
    <ComponentToolBar>
      <StickyContainer top={stickyTop}>
        <Card title={t("addComponent")}>
          <Space direction="vertical" size="large">
            <Button type="primary" onClick={() => insertComponent(helpers, Factory.createText(), focus, setFocus)}>
              <Iconfont type="icontext" /> {t("addTextComponent")}
            </Button>
            <Button type="primary" onClick={() => insertComponent(helpers, Factory.createMedia(), focus, setFocus)}>
              <Iconfont type="iconmedia" /> {t("addMediaComponent")}
            </Button>
            <Button type="primary" onClick={() => insertComponent(helpers, Factory.createSwitch(), focus, setFocus)}>
              <Iconfont type="iconswitch" /> {t("addChoiceComponent")}
            </Button>
            <PageButton
              type="primary"
              onClick={() => insertComponent(helpers, Factory.createPageFooter(), focus, setFocus)}
            >
              {t("addPageBreakComponent")}
            </PageButton>
          </Space>
        </Card>
      </StickyContainer>
    </ComponentToolBar>
  );
}

function stickyScrollListener(offsetTop, onChangeStickyTop) {
  const onScroll = debounce({ delay: 100 }, (event) => {
    const diffTop = event.target.scrollTop - offsetTop;
    onChangeStickyTop(diffTop > 0 ? diffTop : 0);
  });
  document.getElementById("route-view").addEventListener("scroll", onScroll);
  return () => {
    document.getElementById("route-view").removeEventListener("scroll", onScroll);
  };
}

const PageButton = styled(Button)`
  min-width: 200px;
  width: auto;
`;

const FieldArrayContainer = styled.div`
  display: flex;
`;

const ComponentForm = styled.div`
  flex: 1;
`;

const ComponentToolBar = styled.div``;

const StickyContainer = styled.div`
  position: relative;
  top: ${({ top }) => top}px;
  height: 360px;
  margin-left: 40px;
  box-shadow: 0px 4px 12px 0px rgba(255, 148, 114, 0.3);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;
