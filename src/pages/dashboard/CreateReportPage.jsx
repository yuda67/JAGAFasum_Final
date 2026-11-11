import { useNavigate, useOutletContext } from "react-router"
import Button from "../../components/ui/Button/Button"
import PhotoUpload from "../../components/report/PhotoUpload/PhotoUpload"
import CategoryPicker from "../../components/report/CategoryPicker/CategoryPicker"
import ReportField from "../../components/report/ReportField/ReportField"
import LocationField from "../../components/report/LocationField/LocationField"
import { AlertIcon } from "../../components/icons/UiIcons"
import { ArrowRightIcon } from "../../components/icons/DashboardIcons"
import useReportForm from "../../hooks/useReportForm"
import useToast from "../../hooks/useToast"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import { createReport as submitReport } from "../../services/reportService"
import { REPORT_LIMITS } from "../../utils/validation"
import { createReport } from "../../data/content"
import "./CreateReportPage.css"

export default function CreateReportPage() {
  useDocumentTitle("Buat Laporan — JAGAFasum")
  const { user } = useOutletContext()
  const { show } = useToast()
  const navigate = useNavigate()
  const form = useReportForm()
  const { values, errors } = form

  const handleSubmit = form.handleSubmit(async (formValues) => {
    const result = await submitReport(user.userId, {
      ...formValues,
      photo: formValues.photo.dataUrl,
    })
    if (result.ok) {
      show(createReport.success)
      navigate("/dashboard/laporan", { state: { highlight: result.report.id } })
    }
    return result
  })

  return (
    <div className="create-report dash-container">
      <h1 className="dash-title">{createReport.title}</h1>

      <form className="create-report__form" onSubmit={handleSubmit} noValidate>
        <PhotoUpload
          ref={form.register("photo")}
          value={values.photo}
          onChange={(photo) => form.setField("photo", photo)}
          error={errors.photo}
        />

        <div className="create-report__fields">
          <ReportField
            ref={form.register("title")}
            label={createReport.titleField.label}
            placeholder={createReport.titleField.placeholder}
            value={values.title}
            onChange={(event) => form.setField("title", event.target.value)}
            error={errors.title}
            maxLength={REPORT_LIMITS.title}
            required
          />

          <CategoryPicker
            ref={form.register("category")}
            value={values.category}
            onChange={(category) => form.setField("category", category)}
            error={errors.category}
          />

          <ReportField
            ref={form.register("description")}
            label={createReport.description.label}
            placeholder={createReport.description.placeholder}
            value={values.description}
            onChange={(event) =>
              form.setField("description", event.target.value)
            }
            error={errors.description}
            maxLength={REPORT_LIMITS.description}
            multiline
            required
          />

          <LocationField
            ref={form.register("location")}
            value={values.location}
            onChange={(location) => form.setField("location", location)}
            error={errors.location}
          />

          {form.formError && (
            <p className="create-report__alert" role="alert">
              <AlertIcon />
              {form.formError}
            </p>
          )}

          <div className="create-report__actions">
            <Button
              variant="outline"
              className="create-report__reset"
              onClick={form.reset}
              disabled={!form.isDirty || form.loading}
            >
              {createReport.reset}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="create-report__submit"
              loading={form.loading}
            >
              {form.loading ? createReport.submitting : createReport.submit}
              {!form.loading && <ArrowRightIcon className="create-report__arrow" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
