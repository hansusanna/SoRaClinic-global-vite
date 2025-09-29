
import { useState } from 'react'

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
type Palette = 'zinc' | 'slate'

export default function PaletteDemo() {
  const [palette, setPalette] = useState<Palette>('zinc')

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // noop
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Tailwind Palette Preview <span className="text-zinc-500">({palette})</span>
        </h2>
        <div className="inline-flex gap-2 rounded-xl border border-zinc-200 p-1 bg-white">
          {(['zinc', 'slate'] as Palette[]).map((p) => (
            <button
              key={p}
              onClick={() => setPalette(p)}
              className={`px-3 py-1.5 rounded-lg text-sm transition
                ${p === palette ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 스와치 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {shades.map((shade) => {
          const bg = `bg-${palette}-${shade}`
          const txt = shade >= 500 ? 'text-white' : 'text-zinc-900'
          const border = shade <= 200 ? 'border border-zinc-200' : ''

          const label = `${palette}-${shade}`

          return (
            <button
              key={label}
              onClick={() => copy(bg)}
              className={`h-24 rounded-xl ${bg} ${txt} ${border} shadow-sm hover:shadow-md transition flex items-end`}
              title={`클릭하면 "${bg}" 복사`}
            >
              <div className="w-full bg-white/50 backdrop-blur-sm text-xs text-zinc-800 px-2 py-1 rounded-b-xl flex justify-between">
                <span className="font-medium">{label}</span>
                <span className="text-zinc-600">copy</span>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-sm text-zinc-500">
        * 밝은 톤(50–200)은 어두운 텍스트가, 진한 톤(500+)은 흰 텍스트가 어울려요.
        색을 클릭하면 해당 <code>bg-…</code> 클래스가 클립보드에 복사됩니다.
      </p>
    </div>
  )
}
