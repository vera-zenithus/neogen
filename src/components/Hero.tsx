import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, TrendingUp, Shield, Zap } from 'lucide-react'
import { useLang } from '../context/LangContext'
import translations from '../i18n/translations'

const Hero: React.FC = () => {
  const { lang } = useLang()
  const t = translations[lang].hero

  const stats = [
    { label: lang === 'ko' ? '정확도' : 'Accuracy', value: '99.9%' },
    { label: lang === 'ko' ? '지원 통화' : 'Currencies', value: '100+' },
    { label: lang === 'ko' ? '활성 사용자' : 'Active Users', value: '5K+' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 bg-navy-900">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-cyan-500/20 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
        {/* Orb left */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        />
        {/* Orb right */}
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative section-container py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            {t.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            <span className="text-white">{t.title1}</span>
            <br />
            <span className="gradient-text">{t.title2}</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <a
              href="https://neogenworld.com/app"
              className="btn-primary text-base px-8 py-4 group"
            >
              {t.cta1}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#features"
              className="btn-secondary text-base px-8 py-4 group"
            >
              <Play className="w-4 h-4" />
              {t.cta2}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="glass-card p-6 shadow-2xl shadow-black/50 animate-glow">
            {/* Mock dashboard header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="text-xs text-slate-500 font-mono">NeoGen Dashboard</div>
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {lang === 'ko' ? '실시간' : 'Live'}
              </div>
            </div>

            {/* Mock chart area */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: lang === 'ko' ? '총 자산' : 'Total Assets', value: '$124,500', change: '+12.4%', up: true },
                { label: lang === 'ko' ? '순이익' : 'Net Income', value: '$18,230', change: '+8.7%', up: true },
                { label: lang === 'ko' ? '부채비율' : 'Debt Ratio', value: '24.3%', change: '-3.2%', up: false },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-white">{item.value}</div>
                  <div className={`text-xs font-medium mt-1 flex items-center gap-1 ${item.up ? 'text-teal-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {item.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock journal entries */}
            <div className="space-y-2">
              <div className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">
                {lang === 'ko' ? '최근 분개' : 'Recent Journal Entries'}
              </div>
              {[
                { date: '2026-03-21', desc: lang === 'ko' ? '매출 발생 — 클라이언트 A' : 'Revenue — Client A', debit: '$5,200', credit: '', verified: true },
                { date: '2026-03-20', desc: lang === 'ko' ? '운영비 지출' : 'Operating Expenses', debit: '', credit: '$1,450', verified: true },
                { date: '2026-03-19', desc: lang === 'ko' ? '외화 환전 (USD → KRW)' : 'FX Conversion (USD → KRW)', debit: '$3,000', credit: '', verified: false },
              ].map((entry, i) => (
                <div key={i} className="flex items-center gap-4 py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="text-xs text-slate-600 font-mono w-20 shrink-0">{entry.date}</div>
                  <div className="text-sm text-slate-300 flex-1 truncate">{entry.desc}</div>
                  <div className="text-sm font-mono text-teal-400 w-20 text-right">{entry.debit}</div>
                  <div className="text-sm font-mono text-red-400 w-20 text-right">{entry.credit}</div>
                  <div className="shrink-0">
                    {entry.verified
                      ? <Shield className="w-3.5 h-3.5 text-cyan-500" />
                      : <div className="w-3.5 h-3.5 rounded-full border border-yellow-500/50" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
