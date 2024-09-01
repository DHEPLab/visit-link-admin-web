import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../reducers";

export default function testSetup(component) {
  const store = createStore(rootReducer);
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>{component}</MemoryRouter>
      </Provider>,
    ),
    history,
    store,
  };
}
