import React from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../reducers";

export default function testSetup(component, history = createMemoryHistory()) {
  const store = createStore(rootReducer);
  return {
    ...render(
      <Provider store={store}>
        <Router history={history}>{component}</Router>
      </Provider>,
    ),
    history,
    store,
  };
}
