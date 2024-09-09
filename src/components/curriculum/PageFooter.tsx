import React from "react";

import Container, { ContainerProps } from "./Container";
import PageFooterTitle from "./PageFooterTitle";

type PageFooterProps = ContainerProps;

const PageFooter: React.FC<PageFooterProps> = (props) => {
  return (
    <Container
      component={
        <PageFooterTitle
          onRemove={props.onRemove}
          readonly={props.readonly}
          focus={props.focus}
          onFocus={props.onFocus}
        />
      }
      {...props}
    />
  );
};

export default PageFooter;
