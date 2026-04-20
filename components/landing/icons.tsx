import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg width="16" height="16" {...base} {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l2.39 5.26L20 9l-5.26 2.39L12 17l-2.39-5.26L4 9l5.61-1.74L12 2zM20 16l.9 2.1 2.1.9-2.1.9L20 22l-.9-2.1L17 19l2.1-.9L20 16z" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg width="20" height="20" {...base} {...props}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg width="20" height="20" {...base} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function LayoutIcon(props: IconProps) {
  return (
    <svg width="24" height="24" {...base} {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg width="24" height="24" {...base} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function ChartIcon(props: IconProps) {
  return (
    <svg width="24" height="24" {...base} {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M3 20h18" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg width="24" height="24" {...base} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg width="24" height="24" {...base} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg width="24" height="24" {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg width="20" height="20" {...base} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 7h4v4H7c0 2 1 3 3 3v2c-4 0-6-2-6-6V7zm10 0h4v4h-4c0 2 1 3 3 3v2c-4 0-6-2-6-6V7z" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
