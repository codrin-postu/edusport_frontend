import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva([
  "group",
  "inline-flex",
  "h-full",
  "w-max",
  "items-center",
  "justify-center",
  "",
  "px-4",
  "py-2",
  "text-sm",
  "font-medium",
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "focus-visible:ring-ring/50",
  "outline-none",
  "transition-[color,box-shadow]",
  "focus-visible:ring-[3px]",
  "focus-visible:outline-1",
]);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px ml-1 size-4 transition duration-fast group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn([
        // slide-in from left when coming from start, from right when from end
        "data-[motion=from-start]:animate-in",
        "data-[motion=from-start]:slide-in-from-left-4",
        "data-[motion=from-end]:animate-in",
        "data-[motion=from-end]:slide-in-from-right-4",
        // slide-out to right when going to end, to left when going to start
        "data-[motion=to-start]:animate-out",
        "data-[motion=to-start]:slide-out-to-right-4",
        "data-[motion=to-end]:animate-out",
        "data-[motion=to-end]:slide-out-to-left-4",
        // fade for open/close
        "data-[motion^=from-]:fade-in",
        "data-[motion^=to-]:fade-out",
        "duration-fast",
        "top-0",
        "left-0",
        "w-full",
        "p-2",
        "pr-3",
        "md:absolute",
        "md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover",
        "group-data-[viewport=false]/navigation-menu:text-popover-foreground",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0",
        "group-data-[viewport=false]/navigation-menu:top-full",
        "group-data-[viewport=false]/navigation-menu:mt-2",
        "group-data-[viewport=false]/navigation-menu:overflow-hidden",
        "group-data-[viewport=false]/navigation-menu:border",
        "group-data-[viewport=false]/navigation-menu:shadow",
        "group-data-[viewport=false]/navigation-menu:duration-fast",
        "**:data-[slot=navigation-menu-link]:focus:ring-0",
        "**:data-[slot=navigation-menu-link]:focus:outline-none",
        className,
      ])}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-sticky flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn([
          "origin-top-center",
          "bg-popover",
          "text-popover-foreground",
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=closed]:zoom-out-95",
          "data-[state=open]:zoom-in-90",
          "relative",
          "mt-2",
          "h-[var(--radix-navigation-menu-viewport-height)]",
          "transition-[width,height]",
          "duration-fast",
          "ease-standard",
          "w-full",
          "overflow-hidden",
          "",
          "border",
          "shadow",
          "md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        ])}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn([
        "data-[active=true]:hover:bg-ui-accent",
        "data-[active=true]:bg-ui-accent/50",
        "data-[active=true]:text-ui-accent-foreground",
        "hover:bg-ui-accent",
        "hover:text-ui-accent-foreground",
        "focus-visible:ring-ring/50",
        "[&_svg:not([class*='text-'])]:text-ui-muted-foreground",
        "flex",
        "flex-col",
        "gap-1",
        "",
        "p-2",
        "text-sm",
        "transition-all",
        "outline-none",
        "focus-visible:ring-[3px]",
        "focus-visible:outline-1",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      ])}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn([
        "data-[state=visible]:animate-in",
        "data-[state=hidden]:animate-out",
        "data-[state=hidden]:fade-out",
        "data-[state=visible]:fade-in",
        "top-full",
        "z-raised",
        "flex",
        "h-1.5",
        "items-end",
        "justify-center",
        "overflow-hidden",
        className,
      ])}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
