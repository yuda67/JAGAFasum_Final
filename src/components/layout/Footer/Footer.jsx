import Logo from "../../ui/Logo/Logo"
import { MailIcon, PhoneIcon, PinIcon } from "../../icons/UiIcons"
import { brand, contact } from "../../../data/content"
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer" id="kontak">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo className="footer__logo" decorative />
          <span className="footer__name">{brand.name}</span>
        </div>

        <h2 className="footer__heading">{contact.heading}</h2>

        <ul className="footer__contacts">
          <li>
            <a className="footer__link" href={`mailto:${contact.email}`}>
              <MailIcon className="footer__icon footer__icon--mail" />
              <span>{contact.email}</span>
            </a>
          </li>
          <li>
            <a className="footer__link" href={contact.phone.href}>
              <PhoneIcon className="footer__icon footer__icon--phone" />
              <span>{contact.phone.display}</span>
            </a>
          </li>
          <li>
            <a
              className="footer__link footer__link--address"
              href={contact.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PinIcon className="footer__icon footer__icon--pin" />
              <span>
                {contact.address.lines.map((line) => (
                  <span key={line} className="footer__line">
                    {line}
                  </span>
                ))}
                <span className="u-visually-hidden">
                  {" "}
                  (buka di Google Maps, tab baru)
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
