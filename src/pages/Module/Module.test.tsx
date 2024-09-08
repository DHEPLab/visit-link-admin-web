import testSetup from "@/tests/setup";
import { Routes, Route } from "react-router-dom";

import Module from "./Module";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { waitFor } from "@testing-library/react";

const server = setupServer(http.get("/admin/modules", () => HttpResponse.json({ content: [] })));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock("@/hooks/usePrompt");

it("should render create page", () => {
  const { queryByText, queryByTestId } = testSetup(
    <Routes>
      <Route
        path="/modules/create"
        element={
          <div id="route-view">
            <Module />
          </div>
        }
      />
    </Routes>,
    ["/modules/create"],
  );

  expect(queryByText("Create New Module")).toBeInTheDocument();
  expect(queryByTestId("basic-form")).toBeInTheDocument();
  expect(queryByTestId("readonly-form")).not.toBeInTheDocument();
});

it("should render readonly page", async () => {
  server.use(
    http.get(`/admin/modules/:id`, () =>
      HttpResponse.json({
        name: "Module Name From Server",
        number: "M1",
        description: "Module Description From Server",
        topic: "BABY_FOOD",
        components: [
          {
            type: "Text",
            key: 1724924456529,
            value: {
              html: "<p>Module Content</p>",
              type: "script",
            },
          },
        ],
      }),
    ),
  );

  const { queryByText, queryAllByText, queryByTestId } = testSetup(
    <Routes>
      <Route
        path="/modules/:id"
        element={
          <div id="route-view">
            <Module />
          </div>
        }
      />
    </Routes>,
    ["/modules/1"],
  );

  await waitFor(() => {
    expect(queryAllByText("Module Name From Server")).toHaveLength(2);
    expect(queryByText("M1")).toBeInTheDocument();
    expect(queryByText("Module Description From Server")).toBeInTheDocument();
    expect(queryByText("Infant complementary feeding")).toBeInTheDocument();
    expect(queryByTestId("basic-form")).not.toBeInTheDocument();
    expect(queryByTestId("readonly-form")).toBeInTheDocument();
  });
});

it("should render readonly page and has draft", async () => {
  server.use(
    http.get(`/admin/modules/:id`, () =>
      HttpResponse.json(
        {
          name: "Module Name",
          number: "M1",
          description: "Module Description",
          topic: "BABY_FOOD",
          components: [
            {
              type: "Text",
              key: 1724924456529,
              value: {
                html: "<p>Module Content</p>",
                type: "script",
              },
            },
          ],
        },
        {
          headers: {
            "x-draft-id": "3",
            "x-draft-date": "2020-07-10T19:55:37",
          },
        },
      ),
    ),
  );

  const { queryByText } = testSetup(
    <Routes>
      <Route
        path="/modules/:id"
        element={
          <div id="route-view">
            <Module />
          </div>
        }
      />
    </Routes>,
    ["/modules/2"],
  );

  await waitFor(() => {
    expect(queryByText("This module has an unpublished draft:")).toBeInTheDocument();
    expect(queryByText("2020/07/10")).toBeInTheDocument();
  });
});
