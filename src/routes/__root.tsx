import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </div>
  ),
});
