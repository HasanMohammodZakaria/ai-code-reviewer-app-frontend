import { createBrowserRouter } from "react-router-dom";
import { HomeRedirect } from "../components/auth/home-redirect";
import { PlaceholderPage } from "../components/common/placeholder-page";
import { AppShell } from "../components/layout/app-shell";
import { DashboardPage } from "../pages/dashboard-page";
import { ForgotPasswordPage } from "../pages/forgot-password-page";
import { LoginPage } from "../pages/login-page";
import { NewProjectPage } from "../pages/new-project-page";
import { ProjectsPage } from "../pages/projects-page";
import { RegisterPage } from "../pages/register-page";
import { ResetPasswordPage } from "../pages/reset-password-page";
import { ProjectDetailPage } from "../pages/project-detail-page";
import { ReviewDetailPage } from "../pages/review-detail-page";
import { auth, guest } from "./auth";

export const router = createBrowserRouter([
  { path: "/", element: <HomeRedirect /> },

  // Public pages: logged-in users are sent to their home
  {
    element: guest(),
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // Logged-in pages. One shared shell keeps the sidebar mounted when a
  // teacher moves between teacher pages and shared pages (e.g. Settings).
  {
    element: auth(),
    children: [
      {
        element: <AppShell />,
        children: [
          // Any logged-in user
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/new", element: <NewProjectPage /> },
          { path: "/projects/:id", element: <ProjectDetailPage /> },
          { path: "/reviews/:id", element: <ReviewDetailPage /> },
          { path: "/settings", element: <PlaceholderPage title="Settings" /> },

          // Teachers only
          {
            element: auth({ role: "teacher" }),
            children: [
              {
                path: "/teacher",
                element: <PlaceholderPage title="Teacher overview" />,
              },
              {
                path: "/teacher/students",
                element: <PlaceholderPage title="Students" />,
              },
              {
                path: "/teacher/students/:id",
                element: <PlaceholderPage title="Student detail" />,
              },
              {
                path: "/teacher/compare",
                element: <PlaceholderPage title="Compare" />,
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <PlaceholderPage title="404 Not found" /> },
]);
