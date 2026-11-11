import Reveal from "../../ui/Reveal/Reveal"
import Skyline from "../Skyline/Skyline"
import { about } from "../../../data/content"
import "./About.css"

export default function About() {
  return (
    <section className="about" id="tentang" aria-labelledby="about-title">
      <div className="about__inner">
        <Reveal
          as="h2"
          id="about-title"
          variant="slide-left"
          className="about__title"
        >
          {about.title}
        </Reveal>
        <div className="about__body">
          <Reveal as="h3" delay={120} className="about__subtitle">
            {about.subtitle}
          </Reveal>
          <Reveal as="p" delay={240} className="about__text">
            {about.body}
          </Reveal>
        </div>
      </div>
      <Skyline className="about__skyline" />
    </section>
  )
}
