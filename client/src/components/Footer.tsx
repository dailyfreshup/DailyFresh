import { Link } from "react-router-dom";
import { assets, footerData } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-[#123524] text-white mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link to="/">
              <img
                src={assets.logo}
                alt="DailyFresh"
                className="w-32 object-contain pb-4"
              />
            </Link>

            <div className="flex gap-3 pt-1 justify-center md:justify-start">
              {footerData.brand.socials.map((social, i) => {
                const Icon = social.icon;

                return (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sections */}
          {footerData.sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
                {section.title}
              </h3>

              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
              Contact
            </h3>

            <ul className="space-y-3">
              {footerData.contact.map((item, i) => {
                const Icon = item.icon;

                return (
                  <li
                    key={i}
                    className="flex items-center justify-center md:justify-start gap-3 text-sm text-white/75"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-white/50">{footerData.bottom.copyright}</p>

          <div className="flex flex-wrap justify-center gap-5">
            {footerData.bottom.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
