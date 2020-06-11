import React from 'react';
import setup from './setup';
import SignIn from '../pages/SignIn';

test('renders text sign in page', () => {
  const { getByText } = setup(<SignIn />);
  const text = getByText(/Healthy Future/i);
  expect(text).toBeInTheDocument();
});
