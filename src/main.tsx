import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { GoogleProvider } from "./components/auth/google-provider";
import { AuthProvider } from "./context/auth-provider";
import { ThemeProvider } from "./context/theme-provider";
import { queryClient } from "./lib/query-client";
import { router } from "./routes/router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </GoogleProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
