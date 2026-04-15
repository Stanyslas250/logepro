"use client"

import { useState } from "react"

export function SupportHero() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <section className="mb-12 relative overflow-hidden rounded-[2rem] bg-primary p-12 lg:p-20 text-white">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Comment pouvons-nous assister votre <br />
          <span className="text-primary-fixed">excellence</span> aujourd&apos;hui ?
        </h1>
        <form onSubmit={handleSearch} className="relative max-w-lg">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des guides, documentation ou tutoriels..."
            className="w-full bg-white/10 backdrop-blur-md border-none focus:ring-2 focus:ring-white/30 rounded-2xl py-4 pl-12 pr-6 placeholder:text-white/60 text-white text-lg"
          />
        </form>
      </div>
      {/* Artistic background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent transform rotate-12 scale-150"></div>
      </div>
    </section>
  )
}
