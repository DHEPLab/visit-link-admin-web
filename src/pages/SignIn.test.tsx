import setup from "../tests/setup";
import SignIn from "./SignIn";

test("renders button sign in page", () => {
  const { getByText } = setup(<SignIn />);
  const text = getByText("Login");
  expect(text).toBeInTheDocument();
});
