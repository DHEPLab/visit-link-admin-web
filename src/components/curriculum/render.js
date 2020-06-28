import React from 'react';

import { Text, Media, Switch, PageFooter } from './*';

export default function render(components) {
  return <>{components.map(renderComponent)}</>;
}

function renderComponent(component) {
  switch (component.type) {
    case 'Text':
      return <Text {...component.props} />;
    case 'Media':
      return <Media {...component.props} />;
    case 'Switch':
      return <Switch {...component.props} />;
    case 'PageFooter':
      return <PageFooter {...component.props} />;
    default:
      return <div key={component.props.key}>UNKNOWN Type {component.type}</div>;
  }
}
