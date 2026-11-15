import { ShoppingCart, TrendingUp, UtensilsCrossed, Wallet } from 'lucide-react'
import { CHART_GROUPS } from '../../constants/categories'
import { cn } from '../../utils/cn'

// Karşılama ekranının arka plan süslemeleri

const floatingCard =
  'absolute rounded-2xl border border-white/70 bg-white/90 p-3 shadow-xl shadow-brand-900/10 backdrop-blur max-[1439px]:hidden motion-safe:animate-float'

const DONUT_SHARES = [32, 22, 17, 11, 18]
const donutGradient = `conic-gradient(${CHART_GROUPS.map((group, index) => {
  const start = DONUT_SHARES.slice(0, index).reduce((sum, share) => sum + share, 0)
  return `${group.color} ${start}% ${start + DONUT_SHARES[index]}%`
}).join(', ')})`

const WEEK_BARS = [30, 45, 92, 40, 58, 72, 36]

export function WelcomeDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-400/25 blur-3xl" />
      <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-violet-400/25 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />

      <div className="absolute inset-0 bg-[radial-gradient(var(--color-brand-200)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] [background-size:22px_22px]" />

      {/* Sol üst: bakiye kartı */}
      <div className={cn(floatingCard, 'top-[16%] left-[5%] w-44 -rotate-6')}>
        <p className="text-xs text-slate-500">Bakiye</p>
        <p className="text-lg font-semibold text-emerald-600 tabular-nums">₺12.350,00</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
          <TrendingUp size={11} />
          Artıda
        </span>
      </div>

      {/* Sağ üst: para girişi */}
      <div
        className={cn(floatingCard, 'top-[14%] right-[5%] flex items-center gap-3 rotate-6 [animation-delay:1.2s]')}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Wallet size={17} />
        </span>
        <span>
          <span className="block text-xs text-slate-500">Para eklendi</span>
          <span className="block text-sm font-semibold text-emerald-600 tabular-nums">+₺10.000,00</span>
        </span>
      </div>

      {/* Sol alt: günlere göre mini çubuk grafik */}
      <div className={cn(floatingCard, 'bottom-[9%] left-[5%] w-48 rotate-3 [animation-delay:2.4s]')}>
        <p className="mb-2 text-xs text-slate-500">Günlere göre</p>
        <div className="flex h-16 items-end gap-1.5">
          {WEEK_BARS.map((height, index) => (
            <span
              key={index}
              className={cn(
                'flex-1 rounded-md',
                index === 2 ? 'bg-linear-to-b from-brand-600 to-violet-400' : 'bg-slate-100',
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      {/* Sağ alt: mini halka grafik */}
      <div
        className={cn(floatingCard, 'right-[6%] bottom-[10%] flex items-center gap-3 -rotate-3 [animation-delay:3.6s]')}
      >
        <span className="relative h-14 w-14 rounded-full" style={{ background: donutGradient }}>
          <span className="absolute inset-[9px] rounded-full bg-white" />
        </span>
        <span className="space-y-1">
          {CHART_GROUPS.slice(0, 3).map((group) => (
            <span key={group.id} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: group.color }} />
              {group.name}
            </span>
          ))}
        </span>
      </div>

      <span
        className="absolute top-[48%] left-[2.5%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg shadow-brand-900/10 max-[1439px]:hidden motion-safe:animate-float [animation-delay:0.6s]"
      >
        <ShoppingCart size={19} />
      </span>
      <span
        className="absolute top-[46%] right-[3%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-500 shadow-lg shadow-brand-900/10 max-[1439px]:hidden motion-safe:animate-float [animation-delay:3s]"
      >
        <UtensilsCrossed size={19} />
      </span>
    </div>
  )
}
