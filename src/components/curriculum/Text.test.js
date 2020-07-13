import React from 'react';
import { render } from '@testing-library/react';

import Text from './Text';

test('should render Text value', () => {
  const { getByText } = render(
    <Text name="component.0.value" value={{ html: 'Hello World' }} onChange={jest.fn()} />
  );
  expect(getByText('Hello World')).toBeInTheDocument();
});

test('should render readonly Text', () => {
  const { queryByText } = render(
    <Text name="component.0.value" readonly value={{ html: 'Hello World' }} onChange={jest.fn()} />
  );
  expect(queryByText(/Hello World/).parentNode.parentNode.classList.contains('ql-disabled')).toBe(
    true
  );
  expect(queryByText(/叙述文本/)).not.toBeInTheDocument();
});
