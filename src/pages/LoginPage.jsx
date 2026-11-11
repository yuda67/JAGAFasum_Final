import { Link, useLocation, useNavigate } from "react-router"
import Button from "../components/ui/Button/Button"
import TextField from "../components/ui/TextField/TextField"
import { AlertIcon } from "../components/icons/UiIcons"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
import useAuthForm from "../hooks/useAuthForm"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { validateLogin } from "../utils/validation"
import { getFirstName } from "../utils/format"
import { adminLogin } from "../data/content"
import "./AuthForm.css"

export default function LoginPage() {
  useDocumentTitle("Log in — JAGAFasum")
  const { login } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  // Kembali ke halaman dashboard yang tadi diminta, bila ada.
  const redirectTo = location.state?.from?.startsWith("/dashboard")
    ? location.state.from
    : "/dashboard"
  const form = useAuthForm({
    initialValues: { email: "", password: "" },
    validate: validateLogin,
    fieldOrder: ["email", "password"],
    clearOnFormError: ["password"],
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await login(values)
    if (result.ok) {
      show(`Selamat datang kembali, ${getFirstName(result.user.name)}!`)
      navigate(redirectTo, { replace: true })
    }
    return result
  })

  return (
    <form
      className={`auth-form${form.shaking ? " is-shaking" : ""}`}
      onSubmit={handleSubmit}
      onAnimationEnd={(event) =>
        event.target === event.currentTarget && form.stopShaking()
      }
      noValidate
    >
      <h1 className="auth-form__title">
        Welcome <span className="auth-form__accent--login">back</span>
      </h1>

      <div className="auth-form__fields">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
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
          className="auth-form__submit"
          loading={form.loading}
        >
          {form.loading ? "Logging in…" : "Log in"}
        </Button>
      </div>

      <p className="auth-form__switch">
        New?
        <Link to="/register" className="auth-form__link">
          Create an account
        </Link>
      </p>
      <p className="auth-form__switch auth-form__switch--admin">
        {adminLogin.citizenLinkLead}
        <Link to="/admin/login" className="auth-form__link">
          {adminLogin.citizenLink}
        </Link>
      </p>
    </form>
  )
}
