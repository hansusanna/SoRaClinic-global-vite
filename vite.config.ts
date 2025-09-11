import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',//배포전까지는 배포시에는 /dist 로 수정할것 또는 서버의 도메인을 포함한 index.html 존재하는 경로
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
