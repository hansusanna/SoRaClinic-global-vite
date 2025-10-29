import { createClient } from '@supabase/supabase-js'

console.log('VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY length =', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);

// .env 파일에서 환경 변수를 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경 변수가 설정되지 않았을 경우 에러를 발생시킵니다.
if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not set in .env file")
}
if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not set in .env file")
}

// Supabase 클라이언트를 생성하고 export 합니다.
// 이 파일을 import하여 앱 전체에서 Supabase 클라이언트를 재사용할 수 있습니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
