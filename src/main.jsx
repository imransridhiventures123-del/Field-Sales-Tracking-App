// ============================================================
//  FILE: src/main.jsx
//  OWNER: Imran
//  PURPOSE: This is the FIRST file React runs.
//           It mounts the entire app into index.html's
//           <div id="root"> element.
//           You set this up ONCE on day 1 and rarely touch it.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";           // our main App component
import "./index.css";              // Tailwind CSS global styles

// Find the <div id="root"> in public/index.html
// and render the entire React app inside it.
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode runs extra checks during development only.
  // It shows double renders in dev — this is NORMAL, not a bug.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// NOTE: All providers (AuthProvider, VisitProvider, BrowserRouter)
// are inside App.jsx — not here. This keeps main.jsx clean.