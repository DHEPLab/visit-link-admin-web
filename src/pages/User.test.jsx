import React from "react";
import setup from "../tests/setup";
import User from "./User";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const res = [
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
];

const server = setupServer(
  http.get("/admin/users/:id", () => {
    return HttpResponse.json(res);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test.skip("should render close account button when current role is chw", () => {
  const { getByText } = setup(<User />);
  const text = getByText(/Delete Account/);
  expect(text).toBeInTheDocument();
});
