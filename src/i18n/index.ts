// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

void i18n
  .use(HttpApi)
  .use(LanguageDetector) // 경로(path) 우선 감지
  .use(initReactI18next)
  .init({
    // 지원 언어와 폴백
    supportedLngs: ['ko', 'en', 'cn'],
    fallbackLng: 'ko',

    // 네임스페이스
    ns: ['common', 'navi', 'slides', 'options', 'form', 'contact', 'about'],
    defaultNS: 'common',

    // 치환 보안
    interpolation: { escapeValue: false },

    // 리소스 로딩 경로 (Vite BASE_URL 고려)
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/pages/{{ns}}.json`,
    },

    // 언어 감지: 경로 → 저장소 → 쿠키 → html → 브라우저
    detection: {
      order: ['path', 'localStorage', 'cookie', 'htmlTag', 'navigator'],
      lookupFromPathIndex: 0, // /ko/..., /en/..., /cn/...
      caches: [],             // 경로 우선 보장을 위해 캐시 비활성(원하면 ['localStorage'])
    },

    // 언어 코드 정규화
    cleanCode: true,        // en-US -> en, zh-CN -> zh
    lowerCaseLng: true,
    load: 'currentOnly',    // 'en-US' 같은 변형을 현재 코드로만 로드

    // 리액트 연동
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
    },

    // 옵션: 키 미존재 시 그대로 키 출력 방지
    // returnNull: false,
  })

export default i18n
