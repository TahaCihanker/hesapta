import { ChartPie, Plus, ReceiptText, Sparkles, Wallet } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClass } from '../ui/buttonStyles'
import { PageHeader } from '../ui/PageHeader'
import { WelcomeDecorations } from './WelcomeDecorations'

interface WelcomeCardProps {
  onAddMoney: () => void
  onLoadSample: () => void
}

const STEPS = [
  { icon: Wallet, title: 'Para ekle', text: 'Maaşından ya da birikiminden hesabına para aktar.' },
  { icon: ReceiptText, title: 'Harcamalarını gir', text: 'Her harcamayı kategorisiyle kaydet; bakiyenden düşsün.' },
  { icon: ChartPie, title: 'Özetini takip et', text: 'Ay ay nereye ne harcadığını grafiklerle gör.' },
]

// Kayıt yokken gösterilen karşılama ekranı
export function WelcomeCard({ onAddMoney, onLoadSample }: WelcomeCardProps) {
  return (
    <div className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-linear-to-br from-brand-50 via-white/60 to-violet-100/70 p-4 sm:p-6 lg:p-8">
      <WelcomeDecorations />

      <PageHeader title="Özet" />

      <div className="flex flex-1 items-center justify-center py-6">
        <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white bg-white/85 p-6 text-center shadow-2xl shadow-brand-900/10 backdrop-blur-sm sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-600 via-violet-500 to-brand-400" />

          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-2xl bg-brand-500/50 blur-xl" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 to-violet-500 text-white ring-8 ring-brand-50">
              <Wallet size={28} aria-hidden />
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            <span className="bg-linear-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              Hesapta
            </span>
            'ya hoş geldin
          </h2>
          <p className="mt-2 text-slate-500">
            Bakiyeni ve harcamalarını tek yerden takip et. Başlamak için üç adım yeterli.
          </p>

          <ol className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-brand-600 to-violet-500 text-xs text-white">
                    {index + 1}
                  </span>
                  {step.title}
                </span>
                <p className="mt-2 text-sm text-slate-500">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button type="button" className={buttonClass('primary')} onClick={onAddMoney}>
              <Wallet size={16} aria-hidden />
              Para ekle
            </button>
            <Link to="/harcama/yeni" className={buttonClass('secondary')}>
              <Plus size={16} aria-hidden />
              Harcama ekle
            </Link>
            <button type="button" className={buttonClass('ghost')} onClick={onLoadSample}>
              <Sparkles size={16} aria-hidden />
              Örnek verilerle dene
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
