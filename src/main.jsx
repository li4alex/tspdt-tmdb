'use client';
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "./index.css"
import App from "./App.jsx"

ModuleRegistry.registerModules([AllCommunityModule]);


// Render GridExample
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);