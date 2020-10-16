import React from "react";
import setup from "../tests/setup";
import User from "./User";
import { useFetch } from "../utils";

jest.mock("../utils", () => ({
  ...jest.requireActual("../utils"),
  useFetch: jest.fn(),
}));

test("should render close account button when current role is chw", () => {
  useFetch
    .mockReturnValueOnce([
      {
        id: 29,
        username: "developer",
        realName: "开发者",
        phone: "15893993333",
        role: "ROLE_CHW",
        lastModifiedPasswordAt: null,
        chw: {
          id: 19,
          identity: "developer",
          tags: ["JS", "海滨镇"],
          supervisor: {
            id: 42,
            username: "dudao003",
            realName: "督导三号",
            phone: "13522223333",
            role: "ROLE_SUPERVISOR",
            lastModifiedPasswordAt: "2020-09-04T14:23:27",
            chw: null,
          },
        },
      },
    ])
    .mockReturnValue([[]]);
  const { getByText } = setup(<User />);
  const text = getByText(/注销账户/);
  expect(text).toBeInTheDocument();
});
