import React from 'react';
import { render } from '@testing-library/react';
import Home from '../pages/Home';

test('renders text home page', () => {
  const { getByText } = render(<Home />);
  const text = getByText(/Home Page/i);
  expect(text).toBeInTheDocument();
});
