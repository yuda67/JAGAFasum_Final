import { reportCategories, reportStatuses } from "../../data/content"
import { CATEGORY_ICONS } from "../icons/DashboardIcons"

const categoriesById = Object.fromEntries(
  reportCategories.map((category) => [category.id, category]),
)

/** Label & ikon kategori laporan (cadangan: "Fasilitas Lainnya"). */
export function getCategoryMeta(id) {
  const category = categoriesById[id] ?? categoriesById.other
  return { ...category, Icon: CATEGORY_ICONS[category.id] }
}

export const getStatusLabel = (status) =>
  reportStatuses[status]?.label ?? reportStatuses.pending.label
