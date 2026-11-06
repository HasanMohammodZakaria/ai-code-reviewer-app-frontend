import { createBrowserRouter } from "react-router-dom";
import { HomeRedirect } from "../components/auth/home-redirect";
import { PlaceholderPage } from "../components/common/placeholder-page";
import { AppShell } from "../components/layout/app-shell";
import { DashboardPage } from "../pages/dashboard-page";
import { ForgotPasswordPage } from "../pages/forgot-password-page";
import { LoginPage } from "../pages/login-page";
import { NewProjectPage } from "../pages/new-project-page";
import { ProjectDetailPage } from "../pages/project-detail-page";
import { ProjectsPage } from "../pages/projects-page";
import { RegisterPage } from "../pages/register-page";
import { ResetPasswordPage } from "../pages/reset-password-page";
import { ReviewDetailPage } from "../pages/review-detail-page";
import { SettingsPage } from "../pages/settings-page";
import { TeacherComparePage } from "../pages/teacher-compare-page";
import { TeacherOverviewPage } from "../pages/teacher-overview-page";
import { TeacherStudentDetailPage } from "../pages/teacher-student-detail-page";
import { TeacherStudentsPage } from "../pages/teacher-students-page";
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
          { path: "/settings", element: <SettingsPage /> },

          // Teachers only
          {
            element: auth({ role: "teacher" }),
            children: [
              { path: "/teacher", element: <TeacherOverviewPage /> },
              { path: "/teacher/students", element: <TeacherStudentsPage /> },
              {
                path: "/teacher/students/:id",
                element: <TeacherStudentDetailPage />,
              },
              { path: "/teacher/compare", element: <TeacherComparePage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <PlaceholderPage title="404 Not found" /> },
]);
