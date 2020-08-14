import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import factory from './factory';
import ModuleComponents from './ModuleComponents';

describe('<ModuleComponents />', () => {
  it('should render', () => {
    const components = [factory.createText()];
    render(
      <Formik initialValues={{ components }}>
        {({ values }) => <ModuleComponents value={values.components} />}
      </Formik>
    );
  });
});
