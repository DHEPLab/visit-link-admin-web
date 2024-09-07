import { waitFor, within, screen } from "@testing-library/react";

import Baby from "./Baby";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import testSetup from "@/tests/setup";
import { Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

const res = {
  createdAt: "2020-06-17T15:03:32",
  lastModifiedAt: "2020-07-27T10:20:11",
  createdBy: "admin",
  lastModifiedBy: "admin",
  id: 7,
  name: "Baby Name",
  identity: "babyid",
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
};

const caresRes = [
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
];

const server = setupServer(
  http.get("/admin/babies/modify-records", () => HttpResponse.json([])),
  http.get("/admin/carers/modify-records", () => HttpResponse.json([])),
  http.get("/admin/users/chw", () => HttpResponse.json({ content: [] })),
  http.get("/admin/babies/:id/visits", () => HttpResponse.json([])),
  http.get("/admin/babies/:id/carers", () => HttpResponse.json(caresRes)),
  http.get("/admin/babies/:id", () => HttpResponse.json(res)),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("should render", async () => {
  const dispatchRequest = vi.fn();
  server.events.on("request:start", dispatchRequest);

  testSetup(
    <Routes>
      <Route path="/babies/:id" element={<Baby />} />
    </Routes>,
    ["/babies/1"],
  );
  await waitFor(() => expect(dispatchRequest).toBeCalled());

  const babyInfo = screen.getByTestId("baby-info");

  expect(within(babyInfo).getByText("Baby Name")).toBeInTheDocument();
  await user.click(screen.getByTestId("add-carer"));
  expect(screen.getByRole("dialog", { name: "New Caregiver" })).toBeInTheDocument();
});
