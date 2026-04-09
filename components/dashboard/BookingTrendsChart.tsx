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

  const chartData = data || defaultData
  const maxBookings = Math.max(...chartData.map(d => d.bookings))

  const generatePath = () => {
    const width = 800
    const height = 200
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    const points = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth
      const y = padding + (1 - point.bookings / maxBookings) * chartHeight
      return `${x},${y}`
    })

    // Create smooth curve path
    let path = `M ${points[0]}`
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1].split(",").map(Number)
      const [x2, y2] = points[i].split(",").map(Number)
      const cx = (x1 + x2) / 2
      path += ` Q ${cx},${y1} ${cx},${(y1 + y2) / 2} T ${x2},${y2}`
    }

    return path
  }

  const generateAreaPath = () => {
    const width = 800
    const height = 200
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    const points = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * chartWidth
      const y = padding + (1 - point.bookings / maxBookings) * chartHeight
      return `${x},${y}`
    })

    let path = `M ${points[0]}`
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1].split(",").map(Number)
      const [x2, y2] = points[i].split(",").map(Number)
      const cx = (x1 + x2) / 2
      path += ` Q ${cx},${y1} ${cx},${(y1 + y2) / 2} T ${x2},${y2}`
    }
    path += ` L 760,200 L 40,200 Z`

    return path
  }

  return (
    <div className="bg-card rounded-xl p-6 space-y-6 border border-border shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Tendances des réservations</h3>
          <p className="text-xs text-muted-foreground">Performance des 7 derniers jours</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
              period === "weekly"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Hebdomadaire
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
              period === "monthly"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Mensuel
          </button>
        </div>
      </div>

      <div className="h-64 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 800 200">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={generateAreaPath()}
            fill="url(#chartGradient)"
          />
          <path
            d={generatePath()}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Data Points */}
          {chartData.map((point, index) => {
            const x = 40 + (index / (chartData.length - 1)) * 720
            const y = 40 + (1 - point.bookings / maxBookings) * 120
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                fill="hsl(var(--primary))"
                r="4"
              />
            )
          })}
        </svg>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {chartData.map((point) => (
            <span key={point.day}>{point.day}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
