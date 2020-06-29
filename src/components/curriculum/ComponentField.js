import React from 'react';
import { Field } from 'formik';

import { Text, Media } from './*';

export default function ComponentField({ name, component, index, onRemove }) {
  let As;
  switch (component.type) {
    case 'Text':
      As = Text;
      break;
    case 'Media':
      As = Media;
      break;
    default:
      As = <div>{component.type}</div>;
  }
  return <Field name={`${name}.${index}.value`} onRemove={onRemove} as={As} />;
}
