import React from 'react';
import { render } from '@testing-library/react';

import Text from './Text';

test('should render Text value', () => {
  const { getByText } = render(<Text value="Hello World" onChange={jest.fn()} />);
  expect(getByText('Hello World')).toBeInTheDocument();
});
