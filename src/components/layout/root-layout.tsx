import { useEffect } from "react";
import { Outlet, useLocation, useMatches } from "react-router-dom";

const APP_NAME = "AI Code Reviewer";

function hasTitle(handle: unknown): handle is { title: string } {
  return (
    typeof handle === "object" &&
    handle !== null &&
    "title" in handle &&
    typeof (handle as { title: unknown }).title === "string"
  );
}

/** Wraps every route: sets the browser tab title and scrolls to the top on a new page */
export function RootLayout() {
  const matches = useMatches();
  const { pathname } = useLocation();

  // The deepest route that declares a title wins
  const title = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasTitle)?.title;

  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Outlet />;
}
