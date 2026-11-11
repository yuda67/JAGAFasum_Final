import { Link, useNavigate } from "react-router"
import Button from "../components/ui/Button/Button"
import TextField from "../components/ui/TextField/TextField"
import { AlertIcon } from "../components/icons/UiIcons"
import useAuth from "../hooks/useAuth"
import useToast from "../hooks/useToast"
import useAuthForm from "../hooks/useAuthForm"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { PASSWORD_HINT, validateRegister } from "../utils/validation"
import { getFirstName } from "../utils/format"
import "./AuthForm.css"

export default function RegisterPage() {
  useDocumentTitle("Create account — JAGAFasum")
  const { register } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const form = useAuthForm({
    initialValues: { name: "", email: "", password: "" },
    validate: validateRegister,
    fieldOrder: ["name", "email", "password"],
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await register(values)
    if (result.ok) {
      show(
        `Akun berhasil dibuat. Selamat datang, ${getFirstName(result.user.name)}!`,
      )
      navigate("/dashboard", { replace: true })
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
        Create your <span className="auth-form__accent--register">account</span>
      </h1>

      <div className="auth-form__fields">
        <TextField
          label="Full name"
          autoComplete="name"
          {...form.fieldProps("name")}
        />
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
          autoComplete="new-password"
          hint={PASSWORD_HINT}
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
          {form.loading ? "Creating account…" : "Create account"}
        </Button>
      </div>

      <p className="auth-form__switch">
        Already have an account?
        <Link to="/login" className="auth-form__link auth-form__link--spaced">
          Log in
        </Link>
      </p>
    </form>
  )
}
