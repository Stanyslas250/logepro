"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/components/onboarding/onboarding-context"
import { Stepper } from "@/components/onboarding/stepper"
import { CounterInput } from "@/components/onboarding/counter-input"
import { FloorVisualizer } from "@/components/onboarding/floor-visualizer"

export default function StructurePage() {
  const { floors, roomsPerFloor, totalRooms, maxRooms, plan, setFloors, setRoomsPerFloor } =
    useOnboarding()

  const maxFloorsForCurrentRooms = Math.max(1, Math.floor(maxRooms / roomsPerFloor))
  const maxRoomsForCurrentFloors = Math.max(1, Math.floor(maxRooms / floors))
  const isAtLimit = totalRooms >= maxRooms

  return (
    <div className="flex flex-1 flex-col p-10">
      {/* Header */}
      <header className="mx-auto mb-12 w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight">
              Configurez votre structure
            </h1>
            <p className="mt-2 text-muted-foreground">
              Définissez l&apos;architecture de votre établissement pour une
              gestion précise.
            </p>
          </div>
          <Stepper currentStep={2} totalSteps={4} />
        </div>
      </header>

      {/* Bento Grid */}
      <section className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="col-span-5 space-y-6">
          {/* Floors Card */}
          <div className="rounded-xl border border-border/50 bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary p-2 text-primary">
                  <svg
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-bold">Étages</h3>
              </div>
              <span className="rounded bg-muted px-2 py-1 text-xs font-bold uppercase tracking-tighter">
                Total: {floors}
              </span>
            </div>
            <CounterInput value={floors} onChange={setFloors} max={Math.min(20, maxFloorsForCurrentRooms)} />
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Chaque étage peut contenir une configuration différente de
              chambres.
            </p>
          </div>

          {/* Rooms Card */}
          <div className="rounded-xl border border-border/50 bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                  <svg
                    className="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
                    <path d="M2 20h20" />
                    <path d="M14 12v.01" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-bold">
                  Chambres par étage
                </h3>
              </div>
              <span className="rounded bg-muted px-2 py-1 text-xs font-bold uppercase tracking-tighter">
                Moyenne: {roomsPerFloor}
              </span>
            </div>
            <CounterInput
              value={roomsPerFloor}
              onChange={setRoomsPerFloor}
              max={Math.min(30, maxRoomsForCurrentFloors)}
              accentClass="text-emerald-600 hover:bg-emerald-500"
            />
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-tight text-muted-foreground">
                  Capacité Totale Estimée
                </span>
                <span className="font-heading text-xl font-bold text-primary">
                  {totalRooms} unités
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-tight text-muted-foreground">
                  Limite du forfait{" "}
                  <span className="capitalize">{plan}</span>
                </span>
                <span className={cn(
                  "font-heading text-sm font-bold",
                  isAtLimit ? "text-destructive" : "text-muted-foreground"
                )}>
                  {totalRooms} / {maxRooms}
                </span>
              </div>
              {isAtLimit && (
                <p className="text-xs text-destructive">
                  Vous avez atteint la limite de chambres pour votre forfait.
                  Passez à un forfait supérieur pour ajouter plus de chambres.
                </p>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p className="text-sm leading-snug text-muted-foreground">
              Vous pourrez personnaliser chaque numéro de chambre
              individuellement dans l&apos;étape suivante.
            </p>
          </div>
        </div>

        {/* Right Column: Visualizer */}
        <div className="col-span-7">
          <FloorVisualizer floors={floors} roomsPerFloor={roomsPerFloor} />
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="mx-auto mt-auto flex w-full max-w-5xl items-center justify-between border-t border-border py-10">
        <Link
          href="/onboarding/forfait"
          className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-muted-foreground transition-all hover:bg-muted"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Retour
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/onboarding/acces"
            className="rounded-xl px-6 py-3 font-medium text-muted-foreground hover:text-foreground"
          >
            Passer pour le moment
          </Link>
          <Link
            href="/onboarding/acces"
            className="flex items-center gap-3 rounded-xl bg-linear-to-r from-primary to-primary/80 px-8 py-4 font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Finaliser la structure
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  )
}
