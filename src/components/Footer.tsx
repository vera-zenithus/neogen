import React from 'react'
import { Mail, ExternalLink } from 'lucide-react'
import { NeoGenIcon, NeoGenWordmark } from './NeoGenLogo'
import { useLang } from '../context/LangContext'
import translations from '../i18n/translations'

const Footer: React.FC = () => {
  const { lang } = useLang()
  const t = translations[lang].footer

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/5 bg-navy-900">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <NeoGenWordmark className="text-xl" />
            </div>
            <p className="text-sm text-slate-500 mb-3">{t.tagline}</p>
            <a
              href="mailto:support@neogenworld.com"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              support@neogenworld.com
            </a>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t.links.product}</h4>
            <ul className="space-y-3">
              {[
                { label: t.links.features, href: '#features' },
                { label: t.links.pricing, href: '#pricing' },
                { label: t.links.docs, href: 'https://docs.neogenworld.com' },
                { label: t.links.changelog, href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t.links.company}</h4>
            <ul className="space-y-3">
              {[
                { label: t.links.about, href: 'https://zenithuslabs.com', external: true },
                { label: t.links.blog, href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {item.label}
                    {item.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t.links.legal}</h4>
            <ul className="space-y-3">
              {[
                { label: t.links.privacy, href: '#' },
                { label: t.links.terms, href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            &copy; {currentYear} {t.copyright}
          </p>
          <a
            href="https://zenithuslabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1"
          >
            by ZenithUs Labs
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
