import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useFetch } from "../utils";

import Baby from "./Baby";

jest.mock("react-router-dom", () => ({
  useParams: () => 1,
  useHistory: jest.fn(),
}));

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  useFetch: jest.fn(),
}));

it("should render", () => {
  useFetch
    .mockReturnValueOnce([
      {
        createdAt: "2020-06-17T15:03:32",
        lastModifiedAt: "2020-07-27T10:20:11",
        createdBy: "admin",
        lastModifiedBy: "admin",
        id: 7,
        name: "baby3",
        identity: "baby3",
        gender: "FEMALE",
        stage: "BIRTH",
        edc: null,
        birthday: "2020-05-31",
        feedingPattern: "MIXED",
        assistedFood: true,
        area: "天津市/市辖区/河东区/大直沽街道",
        location: "nxnnznznnznzn",
        remark: "12389123123123",
        chw: {
          createdAt: "2020-06-10T15:05:26",
          lastModifiedAt: "2020-06-17T17:08:13",
          createdBy: "admin",
          lastModifiedBy: "admin",
          id: 4,
          username: "chw3",
          realName: "chw3",
          phone: "15829920100",
          role: "ROLE_CHW",
          chw: {
            createdAt: "2020-06-10T15:05:26",
            lastModifiedAt: "2020-07-27T09:26:13",
            createdBy: "admin",
            lastModifiedBy: "admin",
            id: 2,
            identity: "111",
            tags: ["a", "b", "c"],
            supervisor: null,
          },
        },
      },
    ])
    .mockImplementation(() => [
      [
        {
          createdAt: null,
          lastModifiedAt: "2020-06-17T15:04:05",
          createdBy: "admin",
          lastModifiedBy: "admin",
          id: 11,
          name: "eeeee333",
          phone: "15738839999",
          wechat: "15738839999",
          familyTies: "GRANDMOTHER",
          master: true,
        },
      ],
    ]);
  const { getByText, getByLabelText, getByTestId } = render(<Baby />);
  expect(getByText(/eeeee333/)).toBeInTheDocument();
  fireEvent.click(getByTestId("add-carer"));
  expect(getByLabelText(/亲属关系/)).toBeInTheDocument();
});
