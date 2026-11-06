import { createBrowserRouter } from "react-router-dom";
import { HomeRedirect } from "../components/auth/home-redirect";
import { RouteErrorView } from "../components/common/route-error-view";
import { AppShell } from "../components/layout/app-shell";
import { RootLayout } from "../components/layout/root-layout";
import { auth, guest } from "./auth";

/**
 * Each page is loaded when it is first opened (code splitting), so the login
 * page does not download the charts and the code highlighter.
 */
const page =
  (load: () => Promise<Record<string, React.ComponentType>>, name: string) =>
  async () => {
    const module = await load();
    return { Component: module[name] };
  };

export const router = createBrowserRouter([
  {
    // Sets the tab title, resets scroll, and catches any page that crashes
    element: <RootLayout />,
    errorElement: <RouteErrorView />,
    children: [
      { path: "/", element: <HomeRedirect /> },

      // Public pages: logged-in users are sent to their home
      {
        element: guest(),
        children: [
          {
            path: "/login",
            lazy: page(() => import("../pages/login-page"), "LoginPage"),
            handle: { title: "Log in" },
          },
          {
            path: "/register",
            lazy: page(() => import("../pages/register-page"), "RegisterPage"),
            handle: { title: "Create account" },
          },
          {
            path: "/forgot-password",
            lazy: page(
              () => import("../pages/forgot-password-page"),
              "ForgotPasswordPage",
            ),
            handle: { title: "Forgot password" },
          },
          {
            path: "/reset-password",
            lazy: page(
              () => import("../pages/reset-password-page"),
              "ResetPasswordPage",
            ),
            handle: { title: "Reset password" },
          },
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
              {
                path: "/dashboard",
                lazy: page(
                  () => import("../pages/dashboard-page"),
                  "DashboardPage",
                ),
                handle: { title: "Dashboard" },
              },
              {
                path: "/projects",
                lazy: page(
                  () => import("../pages/projects-page"),
                  "ProjectsPage",
                ),
                handle: { title: "Projects" },
              },
              {
                path: "/projects/new",
                lazy: page(
                  () => import("../pages/new-project-page"),
                  "NewProjectPage",
                ),
                handle: { title: "New project" },
              },
              {
                path: "/projects/:id",
                lazy: page(
                  () => import("../pages/project-detail-page"),
                  "ProjectDetailPage",
                ),
                handle: { title: "Project" },
              },
              {
                path: "/reviews/:id",
                lazy: page(
                  () => import("../pages/review-detail-page"),
                  "ReviewDetailPage",
                ),
                handle: { title: "Review" },
              },
              {
                path: "/settings",
                lazy: page(
                  () => import("../pages/settings-page"),
                  "SettingsPage",
                ),
                handle: { title: "Settings" },
              },

              // Teachers only
              {
                element: auth({ role: "teacher" }),
                children: [
                  {
                    path: "/teacher",
                    lazy: page(
                      () => import("../pages/teacher-overview-page"),
                      "TeacherOverviewPage",
                    ),
                    handle: { title: "Class overview" },
                  },
                  {
                    path: "/teacher/students",
                    lazy: page(
                      () => import("../pages/teacher-students-page"),
                      "TeacherStudentsPage",
                    ),
                    handle: { title: "Students" },
                  },
                  {
                    path: "/teacher/students/:id",
                    lazy: page(
                      () => import("../pages/teacher-student-detail-page"),
                      "TeacherStudentDetailPage",
                    ),
                    handle: { title: "Student" },
                  },
                  {
                    path: "/teacher/compare",
                    lazy: page(
                      () => import("../pages/teacher-compare-page"),
                      "TeacherComparePage",
                    ),
                    handle: { title: "Compare students" },
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        path: "*",
        lazy: page(() => import("../pages/not-found-page"), "NotFoundPage"),
        handle: { title: "Page not found" },
      },
    ],
  },
]);
