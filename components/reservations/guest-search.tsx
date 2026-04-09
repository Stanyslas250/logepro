"use client"

import { useState, useCallback, useRef } from "react"
import type { Guest } from "@/types/database"

interface GuestSearchProps {
  selectedGuest: Guest | null
  onSelect: (guest: Guest) => void
}

export function GuestSearch({ selectedGuest, onSelect }: GuestSearchProps) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchGuests = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/guests?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.guests ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setShowResults(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchGuests(value), 300)
  }

  const handleCreateGuest = async () => {
    if (!newName.trim()) return
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: newName.trim(),
          phone: newPhone.trim() || null,
          email: newEmail.trim() || null,
        }),
      })
      const data = await res.json()
      if (data.guest) {
        onSelect(data.guest)
        setShowNewForm(false)
        setShowResults(false)
        setSearch(data.guest.full_name)
        setNewName("")
        setNewPhone("")
        setNewEmail("")
      }
    } catch {
      // silently fail
    }
  }

  if (selectedGuest) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {selectedGuest.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{selectedGuest.full_name}</p>
            <p className="text-xs text-muted-foreground">
              {selectedGuest.email ?? selectedGuest.phone ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            onSelect(null as unknown as Guest)
            setSearch("")
          }}
          className="text-xs font-semibold text-destructive hover:underline"
        >
          Changer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">
          search
        </span>
        <input
          className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-muted focus:ring-2 focus:ring-primary/20 text-sm"
          placeholder="Rechercher par nom, email, ou téléphone..."
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && search.length >= 2 && (
        <div className="bg-card rounded-xl border border-border shadow-lg max-h-48 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Recherche...
            </div>
          )}
          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun client trouvé
            </div>
          )}
          {!loading &&
            results.map((guest) => (
              <button
                key={guest.id}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(guest)
                  setSearch(guest.full_name)
                  setShowResults(false)
                }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {guest.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{guest.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {guest.email ?? guest.phone ?? ""}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}

      {!showNewForm ? (
        <button
          onClick={() => setShowNewForm(true)}
          className="text-sm font-semibold text-primary px-4 py-2 hover:bg-primary/5 rounded-lg transition-colors"
        >
          + Ajouter un nouveau client
        </button>
      ) : (
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Nouveau Client
          </p>
          <input
            className="w-full p-3 rounded-lg border-none bg-card focus:ring-2 focus:ring-primary/20 text-sm"
            placeholder="Nom complet *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="w-full p-3 rounded-lg border-none bg-card focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder="Téléphone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-lg border-none bg-card focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateGuest}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Créer
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
