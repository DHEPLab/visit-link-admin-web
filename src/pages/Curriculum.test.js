import React from 'react';
import Axios from 'axios';
import { render, act } from '@testing-library/react';
import { useParams, useLocation } from 'react-router-dom';

import Curriculum from './Curriculum';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: () => ({ networks: {} }),
}));

jest.mock('axios');

test('should render create page', () => {
  useParams.mockImplementation(() => ({}));
  useLocation.mockImplementation(() => ({ pathname: '/curriculums/create' }));
  const { queryByText, queryByTestId } = render(<Curriculum />);
  expect(queryByText(/创建新课程/)).toBeInTheDocument();
  expect(queryByTestId('basic-form')).toBeInTheDocument();
  expect(queryByTestId('readonly-form')).not.toBeInTheDocument();
});

test('should render readonly page', async () => {
  useParams.mockImplementation(() => ({ id: 1 }));
  useLocation.mockImplementation(() => ({ pathname: '/curriculum/1' }));
  Axios.get.mockResolvedValue({
    data: {
      name: 'Curriculum Name',
      description: 'Curriculum Description',
      lessons: [],
      schedules: [],
    },
    headers: {},
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Curriculum />);
  });

  const { queryByText, queryAllByText, queryByTestId } = renderResult;
  expect(queryAllByText(/Curriculum Name/).length).toBe(2);
  expect(queryByText(/Curriculum Description/)).toBeInTheDocument();
  expect(queryByTestId('basic-form')).not.toBeInTheDocument();
  expect(queryByTestId('readonly-form')).toBeInTheDocument();
});

test('should render readonly page and has draft', async () => {
  useParams.mockImplementation(() => ({ id: 2 }));
  useLocation.mockImplementation(() => ({ pathname: '/curriculum/2' }));
  Axios.get.mockResolvedValue({
    data: {
      name: 'Curriculum Name',
      description: 'Curriculum Description',
      lessons: [],
      schedules: [],
    },
    headers: {
      'x-draft-id': 3,
      'x-draft-date': '2020-07-13T19:55:37',
    },
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Curriculum />);
  });

  const { queryByText } = renderResult;
  expect(queryByText(/本课程有1个尚未发布的草稿：/)).toBeInTheDocument();
  expect(queryByText(/2020\/07\/13/)).toBeInTheDocument();
});
