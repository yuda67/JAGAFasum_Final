import { RouterProvider } from "react-router"
import { router } from "./routes"
import AuthProvider from "./context/AuthProvider"
import ToastProvider from "./context/ToastProvider"

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  )
}
