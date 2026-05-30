import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() =>
  import("@/pages/Home").then((m) => ({ default: m.HomePage })),
);
const CarsPage = lazy(() =>
  import("@/pages/Cars").then((m) => ({ default: m.CarsPage })),
);
const CarDetailPage = lazy(() =>
  import("@/pages/CarDetail").then((m) => ({ default: m.CarDetailPage })),
);
const CheckoutPage = lazy(() =>
  import("@/pages/Checkout").then((m) => ({ default: m.CheckoutPage })),
);
const AccountPage = lazy(() =>
  import("@/pages/Account").then((m) => ({ default: m.AccountPage })),
);
const MembershipPage = lazy(() =>
  import("@/pages/Membership").then((m) => ({ default: m.MembershipPage })),
);
const AdminPage = lazy(() =>
  import("@/pages/Admin").then((m) => ({ default: m.AdminPage })),
);
const BlogPage = lazy(() =>
  import("@/pages/Blog").then((m) => ({ default: m.BlogPage })),
);
const BlogPostPage = lazy(() =>
  import("@/pages/BlogPost").then((m) => ({ default: m.BlogPostPage })),
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster richColors position="top-right" theme="dark" />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const carsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cars",
  component: CarsPage,
});
const carDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cars/$carId",
  component: CarDetailPage,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});
const membershipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/membership",
  component: MembershipPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});
const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: BlogPostPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  carsRoute,
  carDetailRoute,
  checkoutRoute,
  accountRoute,
  membershipRoute,
  adminRoute,
  blogRoute,
  blogPostRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
