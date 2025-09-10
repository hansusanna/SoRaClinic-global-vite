import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' //SEO 최적화 컴포넌트

import './index.css'
import App from './Routers.tsx'

createRoot(document.getElementById('root')!).render(
 <BrowserRouter>
  <StrictMode>
    <HelmetProvider>   
        <App />      
    </HelmetProvider>
  </StrictMode>
   </BrowserRouter> 
)
 


