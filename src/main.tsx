import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";
import { ToastProvider } from "@heroui/react";
import { App } from "./App.tsx";
// @ts-ignore
import "@fontsource-variable/inter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        <App />
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
);
