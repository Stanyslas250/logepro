"use client"

import { cn } from "@/lib/utils"

interface FloorVisualizerProps {
  floors: number
  roomsPerFloor: number
}

export function FloorVisualizer({ floors, roomsPerFloor }: FloorVisualizerProps) {
  const displayedFloors = Array.from({ length: Math.min(floors, 8) }, (_, i) => i)
  const cols = Math.min(roomsPerFloor, 8)

  return (
    <div className="gradient-border relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 size-64 rounded-full bg-chart-2/10 blur-3xl" />

      <div className="relative z-10 mb-10 flex items-center justify-between">
        <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground">
          Aperçu Architectural
        </h3>
        <div className="flex gap-2">
          <span className="rounded-full border border-border bg-card/80 px-3 py-1 text-[10px] font-bold text-primary shadow-sm backdrop-blur-sm">
            BÂTIMENT A
          </span>
          <span className="rounded-full border border-border bg-card/40 px-3 py-1 text-[10px] font-bold text-muted-foreground backdrop-blur-sm">
            VUE 2D
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-end justify-center">
        <div className="w-full max-w-md space-y-3">
          {displayedFloors
            .reverse()
            .map((floorIdx) => {
              const floorNum = floorIdx + 1
              const isGround = floorIdx === 0

              if (isGround) {
                return (
                  <div key={floorIdx} className="group relative">
                    <div className="flex gap-2">
                      <div className="flex h-20 flex-1 items-center justify-center rounded-lg bg-linear-to-br from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-[1.02]">
                        <div className="flex flex-col items-center gap-1">
                          <svg
                            className="size-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Réception & Lobby
                          </span>
                        </div>
                      </div>
                      <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-card/80 text-[10px] font-bold text-primary">
                        0F
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={floorIdx} className="group relative">
                  <div className="flex gap-2">
                    <div className="flex h-16 flex-1 items-center justify-center rounded-lg bg-card shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                      <div
                        className="grid w-full gap-1 px-4"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                        }}
                      >
                        {Array.from({ length: cols }, (_, r) => (
                          <div
                            key={r}
                            className={cn(
                              "h-2 rounded-full",
                              floorNum === floors
                                ? "bg-primary/40"
                                : "bg-primary"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-card/60 text-[10px] font-bold text-muted-foreground">
                      {floorNum}F
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-end border-t border-border/50 pt-6">
        <p className="text-[11px] font-medium text-muted-foreground">
          Validé par l&apos;algorithme d&apos;optimisation LogePro
        </p>
      </div>
    </div>
  )
}
