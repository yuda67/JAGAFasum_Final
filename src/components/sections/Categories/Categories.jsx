import Reveal from "../../ui/Reveal/Reveal"
import {
  BusIcon,
  PedestrianIcon,
  TrafficLightIcon,
  TrainIcon,
} from "../../icons/CategoryIcons"
import { categories } from "../../../data/content"
import "./Categories.css"

const ICONS = {
  bus: BusIcon,
  traffic: TrafficLightIcon,
  sidewalk: PedestrianIcon,
  train: TrainIcon,
}

export default function Categories() {
  return (
    <ul className="categories" aria-label="Kategori fasilitas umum">
      {categories.map((category, index) => {
        const Icon = ICONS[category.id]
        return (
          <Reveal
            as="li"
            key={category.id}
            variant="pop"
            delay={index * 110}
            className={`category category--${category.id}`}
          >
            <span className="category__circle">
              {Icon && <Icon className="category__icon" />}
            </span>
            <span className="category__label">{category.label}</span>
          </Reveal>
        )
      })}
    </ul>
  )
}
