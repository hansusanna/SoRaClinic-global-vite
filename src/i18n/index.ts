
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { mapLang } from './pageLoader'   
// 공통 문자열 리소스 로드
import koCommon from '@/locales/ko/pages/common.json'
import enCommon from '@/locales/en/pages/common.json'
import cnCommon from '@/locales/cn/pages/common.json'

// 언어 감지(로컬스토리지 → 브라우저 언어 → 기본 en)
const detectLang = () => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
  if (saved) return mapLang(saved)
  if (typeof navigator !== 'undefined') return mapLang(navigator.language || 'en')
  return 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    ko: { common: koCommon },
    en: { common: enCommon },
    cn: { common: cnCommon }
  },
  lng: detectLang(),
  fallbackLng: ['en', 'ko'],
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false }
})

export async function setLanguage(lang: string) {
  const l = mapLang(lang)               // ← 소문자 L
  await i18n.changeLanguage(l)       
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', l)
    }
  } catch (err) {
    void err
  }
}

export default i18n
