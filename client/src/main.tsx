import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="flex min-h-screen items-center justify-center gap-2 bg-gray-200">
      <App />
    </main>
  </StrictMode>
);
