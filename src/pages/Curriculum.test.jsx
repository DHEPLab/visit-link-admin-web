import React from "react";
import Axios from "axios";
import { render, act } from "@testing-library/react";
import { useParams, useLocation } from "react-router-dom";

import Curriculum from "./Curriculum";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useLocation: vi.fn(),
    Prompt: () => <div />,
  };
});

vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSelector: () => ({ networks: {} }),
  };
});

vi.mock("axios");

test("should render create page", async () => {
  useParams.mockImplementation(() => ({}));
  useLocation.mockImplementation(() => ({ pathname: "/curriculums/create" }));
  Axios.get.mockResolvedValue({
    data: {
      content: [],
    },
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Curriculum />);
  });
  const { queryByText, queryByTestId } = renderResult;
  expect(queryByText(/Create New Curriculum/)).toBeInTheDocument();
  expect(queryByTestId("basic-form")).toBeInTheDocument();
  expect(queryByTestId("readonly-form")).not.toBeInTheDocument();
});

test("should render readonly page", async () => {
  useParams.mockImplementation(() => ({ id: 1 }));
  useLocation.mockImplementation(() => ({ pathname: "/curriculum/1" }));
  Axios.get.mockResolvedValue({
    data: {
      name: "Curriculum-Name From API",
      description: "Curriculum Description",
      lessons: [],
      schedules: [],
    },
    headers: {},
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Curriculum />);
  });

  const { queryAllByText, queryByTestId } = renderResult;
  expect(queryAllByText(/Curriculum Name/).length).toBe(1);
  expect(queryAllByText(/Curriculum Description/).length).toBeGreaterThan(1);
  expect(queryByTestId("basic-form")).not.toBeInTheDocument();
  expect(queryByTestId("readonly-form")).toBeInTheDocument();
});

test("should render readonly page and has draft", async () => {
  useParams.mockImplementation(() => ({ id: 2 }));
  useLocation.mockImplementation(() => ({ pathname: "/curriculum/2" }));
  Axios.get.mockResolvedValue({
    data: {
      name: "Curriculum Name",
      description: "Curriculum Description",
      lessons: [],
      schedules: [],
    },
    headers: {
      "x-draft-id": 3,
      "x-draft-date": "2020-07-13T19:55:37",
    },
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Curriculum />);
  });

  const { queryByText } = renderResult;
  expect(queryByText(/This curriculum has an unpublished draft:/)).toBeInTheDocument();
  expect(queryByText(/2020\/07\/13/)).toBeInTheDocument();
});
