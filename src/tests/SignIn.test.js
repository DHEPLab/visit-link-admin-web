import React from 'react';
import setup from './setup';
import SignIn from '../pages/SignIn';

test('renders button sign in page', () => {
  const { getByText } = setup(<SignIn />);
  const text = getByText('登 录');
  expect(text).toBeInTheDocument();
});
