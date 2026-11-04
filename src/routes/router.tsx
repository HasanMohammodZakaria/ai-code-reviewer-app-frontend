import { createBrowserRouter } from "react-router-dom";
import { HomeRedirect } from "../components/auth/home-redirect";
import { PlaceholderPage } from "../components/common/placeholder-page";
import { auth, guest } from "./auth";

export const router = createBrowserRouter([
  { path: "/", element: <HomeRedirect /> },

  // Public pages: logged-in users are sent to their home
  {
    element: guest(),
    children: [
      { path: "/login", element: <PlaceholderPage title="Login" /> },
      { path: "/register", element: <PlaceholderPage title="Register" /> },
      {
        path: "/forgot-password",
        element: <PlaceholderPage title="Forgot password" />,
      },
      {
        path: "/reset-password",
        element: <PlaceholderPage title="Reset password" />,
      },
    ],
  },

  // Any logged-in user (the app shell will wrap these later)
  {
    element: auth(),
    children: [
      { path: "/dashboard", element: <PlaceholderPage title="Dashboard" /> },
      { path: "/projects", element: <PlaceholderPage title="My projects" /> },
      {
        path: "/projects/new",
        element: <PlaceholderPage title="New project" />,
      },
      {
        path: "/projects/:id",
        element: <PlaceholderPage title="Project detail" />,
      },
      {
        path: "/reviews/:id",
        element: <PlaceholderPage title="Review detail" />,
      },
      { path: "/settings", element: <PlaceholderPage title="Settings" /> },
    ],
  },

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

  { path: "*", element: <PlaceholderPage title="404 Not found" /> },
]);
