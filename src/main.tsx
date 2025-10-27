import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import './index.css'
import App from './Routers'

import './i18n'            
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <HelmetProvider>
          {/* 동적 로딩시 깜빡임 방지용 (원하면 제거 가능) */}
          <Suspense fallback={null}>
            <App />
          </Suspense>
        </HelmetProvider>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>
)
