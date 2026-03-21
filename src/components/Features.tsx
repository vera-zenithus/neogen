import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Globe, FileDown, Cloud, BarChart3 } from 'lucide-react'
import { useLang } from '../context/LangContext'
import translations from '../i18n/translations'

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  FileDown: <FileDown className="w-6 h-6" />,
  Cloud: <Cloud className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
}

const Features: React.FC = () => {
  const { lang } = useLang()
  const t = translations[lang].features

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800/30 to-navy-900" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />

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

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {t.items.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="glass-card p-6 group hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:from-cyan-500/30 group-hover:to-teal-500/30 group-hover:border-cyan-500/40 transition-all duration-300">
                {iconMap[feature.icon]}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-100 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
