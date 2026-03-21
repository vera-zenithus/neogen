import React, { createContext, useContext, useState } from 'react'

type Lang = 'ko' | 'en'

interface LangContextType {
    lang: Lang
    toggleLang: () => void
}

const LangContext = createContext<LangContextType>({
    lang: 'ko',
    toggleLang: () => { },
})

export const useLang = () => useContext(LangContext)

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>('ko')
    const toggleLang = () => setLang((prev) => (prev === 'ko' ? 'en' : 'ko'))

    return (
        <LangContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LangContext.Provider>
    )
}
