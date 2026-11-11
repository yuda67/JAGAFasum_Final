import { Link, useLocation, useNavigate } from "react-router"
import Button from "../components/ui/Button/Button"
import TextField from "../components/ui/TextField/TextField"
import { AlertIcon } from "../components/icons/UiIcons"
import { ShieldIcon } from "../components/icons/DashboardIcons"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
import useAuthForm from "../hooks/useAuthForm"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { validateLogin } from "../utils/validation"
import { getFirstName } from "../utils/format"
import { adminLogin as copy } from "../data/content"
import "./AuthForm.css"
import "./AdminLoginPage.css"

const ADMIN_PAGES = [
  "/dashboard/kelola",
  "/dashboard/prioritas",
  "/dashboard/ulasan",
]

/** Login khusus admin/petugas: hanya menerima akun ber-role admin. */
export default function AdminLoginPage() {
  useDocumentTitle(copy.documentTitle)
  const { login } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const redirectTo = ADMIN_PAGES.some((path) => from?.startsWith(path))
    ? from
    : "/dashboard"

  const form = useAuthForm({
    initialValues: { email: "", password: "" },
    validate: validateLogin,
    fieldOrder: ["email", "password"],
    clearOnFormError: ["password"],
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await login(values, { role: "admin" })
    if (result.ok) {
      show(`${copy.welcome} ${getFirstName(result.user.name)}!`)
      navigate(redirectTo, { replace: true })
    }
    return result
  })

  return (
    <form
      className={`auth-form admin-login${form.shaking ? " is-shaking" : ""}`}
      onSubmit={handleSubmit}
      onAnimationEnd={(event) =>
        event.target === event.currentTarget && form.stopShaking()
      }
      noValidate
    >
      <p className="admin-login__eyebrow">
        <ShieldIcon />
        {copy.eyebrow}
      </p>
      <h1 className="auth-form__title admin-login__title">
        {copy.title[0]}{" "}
        <span className="auth-form__accent--login">{copy.title[1]}</span>
      </h1>
      <p className="admin-login__lead">{copy.lead}</p>

      <div className="auth-form__fields">
        <TextField
          label="Email admin"
          type="email"
          autoComplete="username"
          inputMode="email"
          {...form.fieldProps("email")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          {...form.fieldProps("password")}
        />
      </div>

      {form.formError && (
        <p className="auth-form__alert" role="alert">
          <AlertIcon />
          {form.formError}
        </p>
      )}

      <div className="auth-form__actions">
        <Button
          type="submit"
          variant="solid"
          className="auth-form__submit admin-login__submit"
          loading={form.loading}
        >
          {form.loading ? copy.submitting : copy.submit}
        </Button>
      </div>

      <p className="auth-form__switch">
        {copy.backToCitizen}
        <Link to="/login" className="auth-form__link">
          {copy.backToCitizenLink}
        </Link>
      </p>
    </form>
  )
}
