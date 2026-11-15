// Grafiklerde üzerine gelinen parçanın bilgi kutusu
export interface TooltipData {
  left: number // %
  top: number // %
  title: string
  value: string
}

export function ChartTooltip({ left, top, title, value }: TooltipData) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg"
      style={{ left: `${left}%`, top: `calc(${top}% - 8px)` }}
      role="status"
    >
      <p className="text-slate-300">{title}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  )
}
