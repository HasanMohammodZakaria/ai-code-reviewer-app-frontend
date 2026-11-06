import { Outlet } from "react-router-dom";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const MAIN_ID = "main-content";

/** Layout route for public pages: site header, the page, site footer */
export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* First Tab stop: lets keyboard users skip the header */}
      <a
        href={`#${MAIN_ID}`}
        onClick={(event) => {
          // Move focus without adding a #hash to the URL (the router owns the URL)
          event.preventDefault();
          document.getElementById(MAIN_ID)?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-60 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main
        id={MAIN_ID}
        tabIndex={-1}
        className="flex-1 focus-visible:outline-none"
      >
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
