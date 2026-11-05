import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const SheetOverlay = forwardRef<
  ComponentRef<typeof SheetPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      "motion-safe:data-[state=open]:animate-overlay-in motion-safe:data-[state=closed]:animate-overlay-out [animation-fill-mode:forwards]",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

/** Left-side drawer. Render a SheetTitle inside it (use sr-only to hide it). */
const SheetContent = forwardRef<
  ComponentRef<typeof SheetPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      aria-describedby={undefined}
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-full w-72 max-w-[85vw] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg",
        "motion-safe:data-[state=open]:animate-sheet-in motion-safe:data-[state=closed]:animate-sheet-out [animation-fill-mode:forwards]",
        className,
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        aria-label="Close menu"
        className="absolute right-3 top-4 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" aria-hidden="true" />
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

const SheetTitle = forwardRef<
  ComponentRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle };
