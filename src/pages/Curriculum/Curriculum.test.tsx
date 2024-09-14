import { waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";

import Curriculum from "./Curriculum";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import testSetup from "@/tests/setup";

vi.mock("@/hooks/usePrompt");

const server = setupServer(http.get("/admin/questionnaires", () => HttpResponse.json({ content: [] })));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render create page", () => {
  const { queryByText, queryByTestId } = testSetup(
    <Routes>
      <Route
        path="/curriculums/create"
        element={
          <div id="route-view">
            <Curriculum />
          </div>
        }
      />
    </Routes>,
    ["/curriculums/create"],
  );

  expect(queryByText(/Create New Curriculum/)).toBeInTheDocument();
  expect(queryByTestId("basic-form")).toBeInTheDocument();
  expect(queryByTestId("readonly-form")).not.toBeInTheDocument();
});

test("should render readonly page", async () => {
  server.use(
    http.get("/admin/curriculums/1", () =>
      HttpResponse.json({
        name: "Curriculum-Name From API",
        description: "Curriculum Description",
        sessions: [],
        schedules: [],
      }),
    ),
  );

  const { queryAllByText, queryByTestId } = testSetup(
    <Routes>
      <Route
        path="/curriculums/:id"
        element={
          <div id="route-view">
            <Curriculum />
          </div>
        }
      />
    </Routes>,
    ["/curriculums/1"],
  );

  await waitFor(() => {
    expect(queryAllByText(/Curriculum Name/).length).toBe(1);
    expect(queryAllByText(/Curriculum Description/).length).toBeGreaterThan(1);
    expect(queryByTestId("basic-form")).not.toBeInTheDocument();
    expect(queryByTestId("readonly-form")).toBeInTheDocument();
  });
});

test("should render readonly page and has draft", async () => {
  server.use(
    http.get("/admin/curriculums/2", () =>
      HttpResponse.json(
        {
          name: "Curriculum-Name From API",
          description: "Curriculum Description",
          sessions: [],
          schedules: [],
        },
        {
          headers: {
            "x-draft-id": "3",
            "x-draft-date": "2020-07-13T19:55:37",
          },
        },
      ),
    ),
  );

  const { queryByText } = testSetup(
    <Routes>
      <Route
        path="/curriculums/:id"
        element={
          <div id="route-view">
            <Curriculum />
          </div>
        }
      />
    </Routes>,
    ["/curriculums/2"],
  );

  await waitFor(() => {
    expect(queryByText(/This curriculum has an unpublished draft:/)).toBeInTheDocument();
    expect(queryByText(/2020\/07\/13/)).toBeInTheDocument();
  });
});
