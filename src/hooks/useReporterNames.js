import { useMemo } from "react"
import { getUserNames } from "../services/authService"
import { DUMMY_USER_ID, DUMMY_USER_NAME } from "../data/dummyReports"

/** Fungsi userId → nama pelapor (akun di browser ini + pelapor dummy). */
export default function useReporterNames() {
  return useMemo(() => {
    const names = { ...getUserNames(), [DUMMY_USER_ID]: DUMMY_USER_NAME }
    return (userId) => names[userId] ?? "Warga"
  }, [])
}
