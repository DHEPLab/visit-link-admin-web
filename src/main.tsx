import { StrictMode } from "react";
import "antd/dist/reset.css";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
