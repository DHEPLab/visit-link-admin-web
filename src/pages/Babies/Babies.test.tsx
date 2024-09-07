import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import Babies from "./Babies";
import setup from "@/tests/setup";
import dayjs from "dayjs";

const babiesRes = {
  content: [
    {
      id: 39,
      identity: "zzz",
      name: "Tom",
      gender: "MALE",
      area: "zzz/aaa/xxx",
      chw: "",
      visitCount: 0,
      currentLessonName: null,
      longitude: null,
      latitude: null,
      showLocation: null,
      actionFromApp: null,
      lastModifiedAt: "2024-09-06T13:16:37",
      createdAt: "2024-09-06T13:16:37",
      deleted: false,
    },
    {
      id: 38,
      identity: "2024090607",
      name: "John",
      gender: "UNKNOWN",
      area: "LA",
      chw: "bian",
      visitCount: 0,
      currentLessonName: "lesson1",
      longitude: null,
      latitude: null,
      showLocation: null,
      actionFromApp: null,
      lastModifiedAt: "2024-09-06T07:49:23",
      createdAt: "2024-09-06T07:49:01",
      deleted: false,
    },
  ],
  pageable: {
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
    },
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    paged: true,
    unpaged: false,
  },
  totalPages: 3,
  totalElements: 26,
  last: false,
  number: 0,
  sort: {
    sorted: true,
    unsorted: false,
    empty: false,
  },
  size: 10,
  first: true,
  numberOfElements: 10,
  empty: false,
};

const server = setupServer(
  http.get("/admin/babies/approved", () => {
    return HttpResponse.json(babiesRes);
  }),
  http.get("/admin/babies/unreviewed", () => {
    return HttpResponse.json(babiesRes);
  }),
  http.post("/admin/babies", () => {
    return HttpResponse.json({});
  }),
);
const dispatchRequest = vi.fn();
server.events.on("request:start", dispatchRequest);

const user = userEvent.setup();

describe("Babies Page", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    dispatchRequest.mockReset();
  });
  afterAll(() => server.close());

  test("renders with correct tabs and default tab", () => {
    setup(<Babies />);

    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Unreviewed")).toBeInTheDocument();

    const approvedTab = screen.getByRole("tab", { name: "Approved" }).closest("div.ant-tabs-tab");
    expect(approvedTab).toHaveClass("ant-tabs-tab-active");

    expect(dispatchRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        request: expect.objectContaining({
          url: expect.stringMatching(/admin\/babies\/approved\?page=0&size=10$/),
        }),
      }),
    );
  });

  test("opens and closes BabyModalForm correctly", async () => {
    setup(<Babies />);

    await userEvent.click(screen.getByText("New Baby"));
    expect(screen.getByRole("dialog", { name: "New Baby" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog", { name: "New Baby" })).not.toBeInTheDocument();
  });

  test("submits form data correctly", async () => {
    setup(<Babies />);

    await userEvent.click(screen.getByText("New Baby"));

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Tom");
    await user.type(screen.getByRole("textbox", { name: "Baby ID" }), "123456789");
    await user.type(screen.getByRole("textbox", { name: "Due Date" }), dayjs().add(2, "days").format("YYYY-MM-DD"));
    await user.type(screen.getByRole("textbox", { name: "Area" }), "LA");
    await user.type(screen.getByRole("textbox", { name: "Address" }), "st 123");

    await userEvent.click(screen.getByText("Submit"));

    expect(dispatchRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          method: "POST",
          url: expect.stringMatching(/admin\/babies$/),
        }),
      }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    expect(dispatchRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          url: expect.stringMatching(/admin\/babies\/approved\?page=0&size=10$/),
        }),
      }),
    );
  });

  test("switches between tabs and refreshes the content", async () => {
    setup(<Babies />);
    await user.click(screen.getByRole("tab", { name: "Unreviewed" }));

    const approvedTab = screen.getByRole("tab", { name: "Unreviewed" }).closest("div.ant-tabs-tab");
    expect(approvedTab).toHaveClass("ant-tabs-tab-active");
  });

  test("opens and closes the import modal correctly", async () => {
    setup(<Babies />);

    await user.click(screen.getByText("Batch New Babies"));
    expect(screen.getByRole("dialog", { name: "Import from Excel" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog", { name: "Import from Excel" })).not.toBeInTheDocument();
  });
});
