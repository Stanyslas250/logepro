"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { OnboardingShell } from "@/components/onboarding/shell"
import { CounterInput } from "@/components/onboarding/counter-input"
import { FloorVisualizer } from "@/components/onboarding/floor-visualizer"
import { ArrowRightIcon, SparkleIcon } from "@/components/landing/icons"

export default function StructurePage() {
  const { floors, roomsPerFloor, totalRooms, maxRooms, plan, setFloors, setRoomsPerFloor } =
    useOnboarding()

  const maxFloorsForCurrentRooms = Math.max(1, Math.floor(maxRooms / roomsPerFloor))
  const maxRoomsForCurrentFloors = Math.max(1, Math.floor(maxRooms / floors))
  const isAtLimit = totalRooms >= maxRooms
  const usage = Math.min(100, Math.round((totalRooms / maxRooms) * 100))

  return (
    <OnboardingShell maxWidth="max-w-6xl">
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            <SparkleIcon className="size-3" />
            Étape 3 · Structure
          </span>
          Architecture de votre hôtel
        </span>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          Modélisez votre{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
              bâtiment
            </span>
            <svg
              className="absolute -bottom-1.5 left-0 w-full text-primary/40"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path d="M2 9 Q 75 2, 150 6 T 298 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Définissez le nombre d&apos;étages et de chambres. Vous pourrez
          affiner chaque numéro plus tard.
        </p>
      </div>

      {/* Bento grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls */}
        <div className="space-y-5 lg:col-span-5">
          {/* Floors */}
          <div className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-chart-2 text-primary-foreground shadow-sm">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold">Étages</h3>
              </div>
              <span className="rounded-full border border-border/60 bg-card/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Total · {floors}
              </span>
            </div>
            <CounterInput
              value={floors}
              onChange={setFloors}
              max={Math.min(20, maxFloorsForCurrentRooms)}
            />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Chaque étage peut contenir une configuration différente de chambres.
            </p>
          </div>

          {/* Rooms */}
          <div className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-(--success)/15 text-(--success)">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
                    <path d="M2 20h20" />
                    <path d="M14 12v.01" />
                  </svg>
                </div>
                <h3 className="font-heading text-base font-bold">
                  Chambres par étage
                </h3>
              </div>
              <span className="rounded-full border border-border/60 bg-card/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Moy. · {roomsPerFloor}
              </span>
            </div>
            <CounterInput
              value={roomsPerFloor}
              onChange={setRoomsPerFloor}
              max={Math.min(30, maxRoomsForCurrentFloors)}
              accentClass="text-(--success) hover:bg-(--success)"
            />

            {/* Capacity progress */}
            <div className="mt-6 space-y-3 border-t border-border/50 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Capacité totale
                </span>
                <span className="font-heading text-xl font-extrabold bg-linear-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  {totalRooms}{" "}
                  <span className="text-xs font-semibold text-muted-foreground">
                    unités
                  </span>
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isAtLimit
                      ? "bg-linear-to-r from-destructive to-amber-500"
                      : "bg-linear-to-r from-(--success) to-chart-1"
                  )}
                  style={{ width: `${usage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Limite forfait{" "}
                  <span className="font-semibold capitalize text-foreground">
                    {plan}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-bold",
                    isAtLimit ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {totalRooms} / {maxRooms}
                </span>
              </div>

              {isAtLimit && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  Limite atteinte. Passez à un forfait supérieur pour ajouter
                  plus de chambres.
                </p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Vous pourrez personnaliser chaque numéro de chambre et ses
              caractéristiques depuis le tableau de bord.
            </p>
          </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-7">
          <FloorVisualizer floors={floors} roomsPerFloor={roomsPerFloor} />
        </div>
      </div>

      {/* Sticky actions */}
      <div className="sticky bottom-4 mt-10 flex items-center justify-between rounded-2xl border border-border/40 bg-card/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <Link
          href="/onboarding/forfait"
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="size-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
          Retour
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/onboarding/acces"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Passer
          </Link>
          <Link
            href="/onboarding/acces"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-chart-2 px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Continuer
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </OnboardingShell>
  )
}
