import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap } from 'lucide-react'
import { useLang } from '../context/LangContext'
import translations from '../i18n/translations'

const Pricing: React.FC = () => {
  const { lang } = useLang()
  const t = translations[lang].pricing

  const [loading, setLoading] = React.useState<string | null>(null)

  const handleCheckout = async (plan: any) => {
    if (plan.price === '0') {
      window.location.href = plan.href
      return
    }

    if (plan.price === 'custom') {
      window.location.href = plan.href
      return
    }

    setLoading(plan.name)
    try {
      // Vite 프록시(/api)를 통해 호출하여 CORS 회피
      const response = await fetch('https://accounting-psi-pearl.vercel.app/api/paddle-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.name.toLowerCase() === 'pro' ? 'pro_monthly' : plan.name.toLowerCase(),
          email: '', // 홈페이지에서는 이메일 없이 시작하거나 입력 팝업 필요
          uid: 'guest_' + Math.random().toString(36).substring(7)
        })
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Checkout URL not found')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(lang === 'ko' ? '결제 창을 여는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' : 'Error opening checkout. Please try again later.')
    } finally {
      setLoading(null)
    }
  }

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
              className={`relative flex flex-col h-full p-8 rounded-3xl ${
                plan.highlighted
                  ? 'bg-navy-800 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Star className="w-3 h-3 fill-white" />
                  {lang === 'ko' ? 'EARLY BIRD (런칭 한정 특가)' : 'Early Bird Launch Special'}
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
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
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
                <button
                  onClick={() => handleCheckout({ ...plan, name: 'Pro_Yearly' })}
                  disabled={loading !== null}
                  className="w-full text-center py-2.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:-translate-y-0.5 mb-2 disabled:opacity-50"
                >
                  {loading === 'Pro_Yearly' ? (
                    lang === 'ko' ? '연결 중...' : 'Connecting...'
                  ) : (
                    lang === 'ko' ? '연간 결제 $99/년 (약 5개월 무료)' : 'Annual $99/yr — Save $69'
                  )}
                </button>
              )}

              {/* CTA Button */}
              <button
                onClick={() => handleCheckout(plan)}
                disabled={loading !== null}
                className={`w-full text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5'
                    : 'bg-white/10 text-white hover:bg-white/15 border border-white/10 hover:border-white/20 hover:-translate-y-0.5'
                } disabled:opacity-50`}
              >
                {loading === plan.name ? (
                  lang === 'ko' ? '연결 중...' : 'Connecting...'
                ) : (
                  <>
                    {plan.highlighted && <Zap className="w-4 h-4" />}
                    {plan.cta}
                  </>
                )}
              </button>
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
            ? '언제든 취소 가능 · 연간 결제 시 약 41% 절약'
            : 'Cancel anytime · Save approx. 41% with annual billing'}
        </motion.p>
      </div>
    </section>
  )
}

export default Pricing
