import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import { useLang } from '../context/LangContext'

const API_URL = import.meta.env.VITE_API_URL || 'https://neogen-api.neogenworld.workers.dev'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const placeholders = {
  ko: '회계나 분개에 대해 질문해보세요...',
  en: 'Ask about accounting or journal entries...',
}

const greetings = {
  ko: '안녕하세요! 저는 **Neo**입니다. NeoGen의 AI 회계 어시스턴트예요. 복식부기, 분개, 재무 분석에 대해 무엇이든 질문해주세요.',
  en: "Hi! I'm **Neo**, NeoGen's AI accounting assistant. Ask me anything about double-entry bookkeeping, journal entries, or financial analysis.",
}

const NeoChat: React.FC = () => {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: greetings[lang] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json() as { content?: Array<{ text: string }>; error?: string }
      const reply = data.content?.[0]?.text ?? data.error ?? 'Error'
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: lang === 'ko' ? '연결 오류가 발생했습니다.' : 'Connection error occurred.' }])
    } finally {
      setLoading(false)
    }
  }

  const renderContent = (text: string) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/40 flex items-center justify-center text-white ${open ? 'hidden' : ''}`}
        aria-label="Chat with Neo"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 bg-navy-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Neo</p>
                  <p className="text-xs text-cyan-400">{lang === 'ko' ? 'AI 회계 어시스턴트' : 'AI Accounting Assistant'}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white rounded-br-sm'
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-bl-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={placeholders[lang]}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white disabled:opacity-40 transition-opacity hover:opacity-90 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default NeoChat
