import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// The base path should match vite.config.js `base`
// This ensures routes like /bootbucket/page1 work
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/bootbucket">
      <App />
    </BrowserRouter>
  </StrictMode>
);
