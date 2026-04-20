"use client"

import { useState } from "react"

interface BookingTrendsChartProps {
  data?: { day: string; bookings: number }[]
}

export function BookingTrendsChart({ data }: BookingTrendsChartProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly")

  const defaultData = [
    { day: "Lun", bookings: 12 },
    { day: "Mar", bookings: 19 },
    { day: "Mer", bookings: 15 },
    { day: "Jeu", bookings: 25 },
    { day: "Ven", bookings: 22 },
    { day: "Sam", bookings: 30 },
    { day: "Dim", bookings: 28 },
  ]

  const chartData = data && data.length > 0 ? data : defaultData
  const maxBookings = Math.max(...chartData.map((d) => d.bookings), 1)
  const total = chartData.reduce((s, d) => s + d.bookings, 0)

  const width = 800
  const height = 220
  const paddingX = 16
  const paddingY = 24
  const chartWidth = width - 2 * paddingX
  const chartHeight = height - 2 * paddingY

  const points = chartData.map((point, index) => {
    const x = paddingX + (index / Math.max(chartData.length - 1, 1)) * chartWidth
    const y = paddingY + (1 - point.bookings / maxBookings) * chartHeight
    return [x, y] as const
  })

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ")

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1][0]} ${height - paddingY} L ${points[0][0]} ${height - paddingY} Z`
      : ""

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Tendances
          </p>
          <p className="mt-1 text-[22px] font-semibold leading-none tracking-tight">
            {total}
            <span className="ml-1.5 text-[13px] font-normal text-muted-foreground">
              réservations
            </span>
          </p>
        </div>
        <div className="inline-flex rounded-md border border-border p-0.5">
          {(["weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                period === p
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "weekly" ? "7 jours" : "30 jours"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-56 w-full">
        <svg className="h-full w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="bt-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((r) => (
            <line
              key={r}
              x1={paddingX}
              x2={width - paddingX}
              y1={paddingY + r * chartHeight}
              y2={paddingY + r * chartHeight}
              stroke="var(--color-border)"
              strokeDasharray="2 4"
            />
          ))}
          {areaPath && <path d={areaPath} fill="url(#bt-grad)" />}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="var(--color-background)"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          ))}
        </svg>
        <div className="mt-2 flex justify-between px-2 text-[10.5px] text-muted-foreground">
          {chartData.map((p) => (
            <span key={p.day}>{p.day}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
