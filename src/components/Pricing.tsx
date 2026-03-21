import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap } from 'lucide-react'
import { useLang } from '../context/LangContext'
import translations from '../i18n/translations'

const Pricing: React.FC = () => {
  const { lang } = useLang()
  const t = translations[lang].pricing

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            {t.label}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t.description}
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {t.plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-cyan-500/20 to-teal-500/10 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                  : 'glass-card'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/30">
                    <Star className="w-3 h-3 fill-white" />
                    {lang === 'ko' ? '가장 인기' : 'Most Popular'}
                  </div>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-cyan-300' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                {plan.price === 'custom' ? (
                  <div>
                    <span className="text-4xl font-extrabold text-white">{lang === 'ko' ? '문의' : 'Custom'}</span>
                    <div className="text-sm text-slate-500 mt-1">{lang === 'ko' ? '규모에 따라 협의' : 'Tailored to your scale'}</div>
                  </div>
                ) : (
                  <div>
                    {plan.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-500 text-sm line-through">${plan.originalPrice}{t.monthly}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {lang === 'ko' ? '얼리 액세스' : 'Early Access'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-slate-400 text-sm">$</span>
                      <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                      {parseInt(plan.price) > 0 && (
                        <span className="text-slate-400 text-sm">{t.monthly}</span>
                      )}
                    </div>
                    {parseInt(plan.price) === 0 && (
                      <div className="text-sm text-slate-500 mt-1">
                        {lang === 'ko' ? '영구 무료' : 'Forever free'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      plan.highlighted
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Annual CTA for Pro */}
              {plan.highlighted && (
                <a
                  href="https://buy.stripe.com/test_9B68wI6Bpfe91XL79u6Zy01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:-translate-y-0.5 mb-2"
                >
                  {lang === 'ko' ? '연간 결제 $99/년 (17% 절약)' : 'Annual $99/yr — Save 17%'}
                </a>
              )}

              {/* CTA Button */}
              <a
                href={plan.href}
                target={plan.href.startsWith('https://buy.stripe.com') || plan.href.startsWith('https://app.') ? '_blank' : undefined}
                rel={plan.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                className={`w-full text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5'
                    : 'bg-white/10 text-white hover:bg-white/15 border border-white/10 hover:border-white/20 hover:-translate-y-0.5'
                }`}
              >
                {plan.highlighted && <Zap className="w-4 h-4" />}
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-slate-500 text-sm mt-10"
        >
          {lang === 'ko'
            ? '신용카드 필요 없음 · 언제든 취소 가능 · 연간 결제 시 20% 할인'
            : 'No credit card required · Cancel anytime · Save 20% with annual billing'}
        </motion.p>
      </div>
    </section>
  )
}

export default Pricing
