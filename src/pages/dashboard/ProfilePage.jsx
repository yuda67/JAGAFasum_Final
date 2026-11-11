import { useId, useRef, useState } from "react"
import { useOutletContext } from "react-router"
import Button from "../../components/ui/Button/Button"
import {
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  DocumentIcon,
  MapPinIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
} from "../../components/icons/DashboardIcons"
import { AlertIcon, MailIcon, PhoneIcon } from "../../components/icons/UiIcons"
import useReports, { useCommunityReports } from "../../hooks/useReports"
import useAuth from "../../hooks/useAuth"
import useToast from "../../hooks/useToast"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import { getAccount } from "../../services/authService"
import { locateUser, reverseGeocode } from "../../services/locationService"
import {
  ACCEPTED_IMAGE_TYPES,
  cropSquareImage,
  validateImageFile,
} from "../../utils/image"
import { PROFILE_LIMITS, validateProfile } from "../../utils/validation"
import { formatDate, getInitials } from "../../utils/format"
import { profilePage as copy } from "../../data/content"
import "./ProfilePage.css"

const FIELD_ORDER = ["name", "domicile", "phone"]

/** Avatar: foto profil bila ada, selain itu inisial nama. */
function Avatar({ src, name, className = "" }) {
  return (
    <span className={`profile__avatar ${className}`.trim()} aria-hidden="true">
      {src ? <img src={src} alt="" /> : getInitials(name) || "?"}
    </span>
  )
}

/** "0812 3456 7890" agar nomor mudah dibaca. */
const formatPhone = (phone) =>
  phone ? phone.replace(/^(\+?\d{4})(\d{4})(\d+)$/, "$1 $2 $3") : ""

export default function ProfilePage() {
  useDocumentTitle("Profil — JAGAFasum")
  const { user } = useOutletContext()
  const { updateProfile } = useAuth()
  const { show } = useToast()
  const id = useId()
  const reports = useReports(user.userId)
  const allReports = useCommunityReports()
  const isAdmin = user.role === "admin"
  const resolvedByMe = allReports.filter(
    (report) => !report.duplicateOf && report.resolvedById === user.userId,
  ).length

  const [account, setAccount] = useState(() => getAccount(user.userId))
  const joinedAt = account?.createdAt ?? user.startedAt
  const saved = {
    name: account?.name ?? user.name,
    domicile: account?.domicile ?? "",
    phone: account?.phone ?? "",
    avatar: account?.avatar ?? null,
  }

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(saved)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [locating, setLocating] = useState(false)
  const fileRef = useRef(null)
  const fieldRefs = useRef({})

  // Hero memakai data draf saat mengedit → pratinjau langsung.
  const shown = editing ? draft : saved
  const dirty =
    draft.name.trim() !== saved.name ||
    draft.domicile.trim() !== saved.domicile ||
    draft.phone.replace(/[\s.\-()]/g, "") !== saved.phone ||
    draft.avatar !== saved.avatar

  const startEdit = () => {
    setDraft({ ...saved, phone: formatPhone(saved.phone) })
    setErrors({})
    setFormError("")
    setSubmitted(false)
    setEditing(true)
    requestAnimationFrame(() => fieldRefs.current.name?.focus())
  }

  const setField = (name, value) => {
    const next = { ...draft, [name]: value }
    setDraft(next)
    setFormError("")
    if (submitted) setErrors(validateProfile(next))
  }

  const handlePhoto = async (file) => {
    const problem = validateImageFile(file)
    if (problem) {
      setErrors((current) => ({ ...current, avatar: problem }))
      return
    }
    setPhotoBusy(true)
    try {
      const avatar = await cropSquareImage(file)
      setDraft((current) => ({ ...current, avatar }))
      setErrors(({ avatar: _removed, ...rest }) => rest)
    } catch (err) {
      setErrors((current) => ({ ...current, avatar: err.message }))
    } finally {
      setPhotoBusy(false)
    }
  }

  const fillLocation = async () => {
    setLocating(true)
    try {
      const point = await locateUser()
      const address = await reverseGeocode(point)
      // Ambil bagian wilayah saja (kecamatan, kota, provinsi), bukan nama jalan.
      const area = address
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .slice(-3)
      if (!area.length) throw new Error("empty")
      setField("domicile", area.join(", ").slice(0, PROFILE_LIMITS.domicile))
    } catch {
      setErrors((current) => ({ ...current, domicile: copy.locationFailed }))
    } finally {
      setLocating(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return
    setSubmitted(true)
    const nextErrors = validateProfile(draft)
    setErrors(nextErrors)
    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }
    if (!dirty) {
      setEditing(false)
      show(copy.noChanges, { tone: "info" })
      return
    }
    setSaving(true)
    const result = await updateProfile(draft)
    setSaving(false)
    if (!result.ok) {
      setFormError(result.formError)
      return
    }
    setAccount(result.account)
    setEditing(false)
    show(copy.saved)
  }

  const empty = <span className="profile__empty">{copy.empty}</span>
  const facts = [
    { id: "name", label: copy.name, value: saved.name, Icon: UserIcon },
    { id: "email", label: copy.email, value: user.email, Icon: MailIcon },
    {
      id: "domicile",
      label: copy.domicile,
      value: saved.domicile || empty,
      Icon: MapPinIcon,
    },
    {
      id: "phone",
      label: copy.phone,
      value: formatPhone(saved.phone) || empty,
      Icon: PhoneIcon,
    },
    {
      id: "joined",
      label: copy.joined,
      value: formatDate(joinedAt),
      Icon: CalendarIcon,
    },
    {
      id: "role",
      label: copy.role,
      value: isAdmin ? copy.roleAdmin : copy.roleCitizen,
      Icon: ShieldIcon,
    },
    isAdmin
      ? {
          id: "resolved",
          label: copy.resolved,
          value: String(resolvedByMe),
          Icon: CheckIcon,
        }
      : {
          id: "reports",
          label: copy.reports,
          value: String(reports.length),
          Icon: DocumentIcon,
        },
  ]

  const fieldProps = (name) => ({
    id: `${id}-${name}`,
    ref: (element) => {
      fieldRefs.current[name] = element
    },
    value: draft[name],
    onChange: (event) => setField(name, event.target.value),
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": `${id}-${name}-msg`,
    className: `pform__input${errors[name] ? " has-error" : ""}`,
  })

  const message = (name, hint) =>
    errors[name] ? (
      <p
        id={`${id}-${name}-msg`}
        className="pform__msg pform__msg--error"
        role="alert"
      >
        <AlertIcon />
        {errors[name]}
      </p>
    ) : (
      hint && (
        <p id={`${id}-${name}-msg`} className="pform__msg">
          {hint}
        </p>
      )
    )

  return (
    <div className="profile dash-container">
      <h1 className="dash-title">{copy.title}</h1>
      <p className="dash-lead">{copy.lead}</p>

      <section className="profile__card" aria-label="Informasi akun">
        <div className="profile__hero">
          <Avatar
            key={shown.avatar ?? "initials"}
            src={shown.avatar}
            name={shown.name}
          />
          <div className="profile__identity">
            <p className="profile__name">{shown.name.trim() || saved.name}</p>
            <p className="profile__email">{user.email}</p>
            {shown.domicile.trim() && (
              <p className="profile__place">
                <MapPinIcon /> {shown.domicile}
              </p>
            )}
          </div>
          {!editing && (
            <Button
              variant="lime"
              size="sm"
              className="profile__edit"
              onClick={startEdit}
            >
              {copy.edit}
            </Button>
          )}
        </div>

        {editing ? (
          <form className="pform" onSubmit={handleSubmit} noValidate>
            <div className="pform__head">
              <h2 className="pform__title">{copy.editTitle}</h2>
              <p className="pform__lead">{copy.editLead}</p>
            </div>

            <div className="pform__photo">
              <Avatar
                key={draft.avatar ?? "i"}
                src={draft.avatar}
                name={draft.name}
                className="pform__avatar"
              />
              <div className="pform__photo-body">
                <p className="pform__label">{copy.photo}</p>
                <div className="pform__photo-actions">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    loading={photoBusy}
                  >
                    <CameraIcon className="pform__btn-icon" />
                    {draft.avatar ? copy.photoChange : copy.photoUpload}
                  </Button>
                  {draft.avatar && (
                    <button
                      type="button"
                      className="pform__remove"
                      onClick={() =>
                        setDraft((current) => ({ ...current, avatar: null }))
                      }
                    >
                      <TrashIcon /> {copy.photoRemove}
                    </button>
                  )}
                </div>
                {message("avatar", copy.photoHint)}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="u-visually-hidden"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ""
                  if (file) handlePhoto(file)
                }}
              />
            </div>

            <div className="pform__grid">
              <div className="pform__field">
                <label htmlFor={`${id}-name`} className="pform__label">
                  {copy.name}
                  <span className="report-required" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  {...fieldProps("name")}
                  autoComplete="name"
                  maxLength={PROFILE_LIMITS.name}
                  placeholder={copy.namePlaceholder}
                />
                {message("name")}
              </div>

              <div className="pform__field">
                <label htmlFor={`${id}-email`} className="pform__label">
                  {copy.email}
                </label>
                <input
                  id={`${id}-email`}
                  className="pform__input is-locked"
                  value={user.email}
                  readOnly
                  aria-describedby={`${id}-email-msg`}
                />
                <p id={`${id}-email-msg`} className="pform__msg">
                  {copy.emailLocked}
                </p>
              </div>

              <div className="pform__field">
                <label htmlFor={`${id}-domicile`} className="pform__label">
                  {copy.domicile}
                  <span className="pform__optional">({copy.optional})</span>
                </label>
                <div className="pform__with-action">
                  <input
                    {...fieldProps("domicile")}
                    autoComplete="address-level2"
                    maxLength={PROFILE_LIMITS.domicile}
                    placeholder={copy.domicilePlaceholder}
                  />
                  <button
                    type="button"
                    className="pform__locate"
                    onClick={fillLocation}
                    disabled={locating}
                  >
                    {locating ? (
                      <span className="pform__spinner" aria-hidden="true" />
                    ) : (
                      <MapPinIcon />
                    )}
                    {locating ? copy.locating : copy.useLocation}
                  </button>
                </div>
                {message("domicile", copy.domicileHint)}
              </div>

              <div className="pform__field">
                <label htmlFor={`${id}-phone`} className="pform__label">
                  {copy.phone}
                  <span className="pform__optional">({copy.optional})</span>
                </label>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  placeholder={copy.phonePlaceholder}
                />
                {message("phone", copy.phoneHint)}
              </div>
            </div>

            {formError && (
              <p className="pform__alert" role="alert">
                <AlertIcon />
                {formError}
              </p>
            )}

            <div className="pform__actions">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                {copy.cancel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={saving}
              >
                {saving ? copy.saving : copy.save}
              </Button>
            </div>
          </form>
        ) : (
          <dl className="profile__facts">
            {facts.map(({ id: factId, label, value, Icon }, index) => (
              <div
                key={factId}
                className="profile__fact"
                style={{ "--i": index }}
              >
                <span className="profile__fact-icon" aria-hidden="true">
                  <Icon />
                </span>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  )
}
