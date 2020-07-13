import React from 'react';
import Axios from 'axios';
import { render, act } from '@testing-library/react';
import { useParams, useLocation } from 'react-router-dom';

import Module from './Module';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('axios');

test('should render create module page', () => {
  useParams.mockImplementation(() => ({}));
  useLocation.mockImplementation(() => ({ pathname: '/modules/create' }));
  const { queryByText, queryByTestId } = render(<Module />);
  expect(queryByText(/创建新模块/)).toBeInTheDocument();
  expect(queryByTestId('basic-form')).toBeInTheDocument();
  expect(queryByTestId('readonly-form')).not.toBeInTheDocument();
});

test('should render readonly module page', async () => {
  useParams.mockImplementation(() => ({ id: 1 }));
  useLocation.mockImplementation(() => ({ pathname: '/modules/1' }));
  Axios.get.mockResolvedValue({
    data: {
      name: 'Module Name',
      number: 'M1',
      description: 'Module Description',
      topic: 'BABY_FOOD',
      components: [],
    },
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Module />);
  });

  const { queryByText, queryAllByText, queryByTestId } = renderResult;
  expect(queryAllByText(/Module Name/).length).toBe(2);
  expect(queryByText(/M1/)).toBeInTheDocument();
  expect(queryByText(/Module Description/)).toBeInTheDocument();
  expect(queryByText(/婴儿辅食/)).toBeInTheDocument();
  expect(queryByTestId('basic-form')).not.toBeInTheDocument();
  expect(queryByTestId('readonly-form')).toBeInTheDocument();
});
