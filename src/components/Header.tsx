import React, { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { useLang } from '../context/LangContext'
import translations from '../i18n/translations'
import { NeoGenIcon, NeoGenWordmark } from './NeoGenLogo'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { lang, toggleLang } = useLang()
  const t = translations[lang].nav

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t.features, href: '#features' },
    { name: t.pricing, href: '#pricing' },
    { name: t.docs, href: 'https://docs.neogenworld.com' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy-900/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <NeoGenWordmark className="text-xl" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>

            <a
              href="https://app.neogenworld.com"
              className="btn-primary text-sm"
            >
              {t.startFree}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 text-slate-400"
            >
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-navy-800/95 backdrop-blur-xl rounded-2xl mt-2 shadow-xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-slate-400 hover:text-white font-medium border-b border-white/5 last:border-0 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="https://app.neogenworld.com"
                className="block w-full text-center py-3 mt-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-semibold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.startFree}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
