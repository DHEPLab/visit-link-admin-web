import React from "react";
import Axios from "axios";
import { render, act } from "@testing-library/react";
import { useParams, useLocation } from "react-router-dom";

import Module from "./Module";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock("axios");

it.skip("should render create page", () => {
  useParams.mockImplementation(() => ({}));
  useLocation.mockImplementation(() => ({ pathname: "/modules/create" }));
  const { queryByText, queryByTestId } = render(
    <div id="route-view">
      <Module />
    </div>,
  );
  expect(queryByText(/创建新模块/)).toBeInTheDocument();
  expect(queryByTestId("basic-form")).toBeInTheDocument();
  expect(queryByTestId("readonly-form")).not.toBeInTheDocument();
});

it.skip("should render readonly page", async () => {
  useParams.mockImplementation(() => ({ id: 1 }));
  useLocation.mockImplementation(() => ({ pathname: "/modules/1" }));
  Axios.get.mockResolvedValue({
    data: {
      name: "Module Name",
      number: "M1",
      description: "Module Description",
      topic: "BABY_FOOD",
      components: [],
    },
    headers: {},
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
  expect(queryByTestId("basic-form")).not.toBeInTheDocument();
  expect(queryByTestId("readonly-form")).toBeInTheDocument();
});

it.skip("should render readonly page and has draft", async () => {
  useParams.mockImplementation(() => ({ id: 2 }));
  useLocation.mockImplementation(() => ({ pathname: "/modules/2" }));
  Axios.get.mockResolvedValue({
    data: {
      name: "Module Name",
      number: "M1",
      description: "Module Description",
      topic: "BABY_FOOD",
      components: [],
    },
    headers: {
      "x-draft-id": 3,
      "x-draft-date": "2020-07-10T19:55:37",
    },
  });
  let renderResult;
  await act(async () => {
    renderResult = render(<Module />);
  });

  const { queryByText } = renderResult;
  expect(queryByText(/本模块有1个尚未发布的草稿：/)).toBeInTheDocument();
  expect(queryByText(/2020\/07\/10/)).toBeInTheDocument();
});
