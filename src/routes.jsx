import { createBrowserRouter, Navigate } from "react-router"
import RootLayout from "./layouts/RootLayout"
import AuthLayout from "./layouts/AuthLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NotFoundPage from "./pages/NotFoundPage"
import DashboardHomePage from "./pages/dashboard/DashboardHomePage"
import CreateReportPage from "./pages/dashboard/CreateReportPage"
import MyReportsPage from "./pages/dashboard/MyReportsPage"
import ProfilePage from "./pages/dashboard/ProfilePage"
import AdminLoginPage from "./pages/AdminLoginPage"
import ManageReportsPage from "./pages/dashboard/admin/ManageReportsPage"
import PriorityPage from "./pages/dashboard/admin/PriorityPage"
import ReviewsPage from "./pages/dashboard/admin/ReviewsPage"
import { AdminOnly, CitizenOnly } from "./components/routing/RoleGuard"

// BASE_URL bisa berupa path ("/") atau URL lengkap saat deploy → ambil path-nya saja.
const basename = new URL(import.meta.env.BASE_URL, window.location.origin)
  .pathname

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        {
          Component: AuthLayout,
          children: [
            { path: "login", Component: LoginPage },
            { path: "register", Component: RegisterPage },
            { path: "admin/login", Component: AdminLoginPage },
          ],
        },
        { path: "admin", element: <Navigate to="/admin/login" replace /> },
        {
          path: "dashboard",
          Component: DashboardLayout,
          children: [
            { index: true, Component: DashboardHomePage },
            { path: "profil", Component: ProfilePage },
            {
              Component: CitizenOnly,
              children: [
                { path: "buat-laporan", Component: CreateReportPage },
                { path: "laporan", Component: MyReportsPage },
              ],
            },
            {
              Component: AdminOnly,
              children: [
                { path: "kelola", Component: ManageReportsPage },
                { path: "prioritas", Component: PriorityPage },
                { path: "ulasan", Component: ReviewsPage },
              ],
            },
          ],
        },
        { path: "*", Component: NotFoundPage },
      ],
    },
  ],
  { basename },
)
