import { useCallback, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./auth-context"
import {
  getSession,
  loginUser,
  logoutUser,
  registerUser,
  SESSION_KEY,
  updateProfile as updateProfileRequest,
} from "../services/authService"

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  // Sinkronkan sesi bila pengguna login/keluar di tab lain.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === null || event.key === SESSION_KEY) setUser(getSession())
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const register = useCallback(async (values) => {
    const result = await registerUser(values)
    if (result.ok) setUser(result.user)
    return result
  }, [])

  const login = useCallback(async (values, options) => {
    const result = await loginUser(values, options)
    if (result.ok) setUser(result.user)
    return result
  }, [])

  const updateProfile = useCallback(async (values) => {
    const result = await updateProfileRequest(user?.userId, values)
    if (result.ok) setUser(result.user)
    return result
  }, [user?.userId])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      register,
      login,
      logout,
      updateProfile,
    }),
    [user, register, login, logout, updateProfile],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
