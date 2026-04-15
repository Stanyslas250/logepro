"use client"

import { useState } from "react"
import type { SupportTicket } from "@/types/database"

interface NewTicketFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ticket: Omit<SupportTicket, "id" | "ticket_number" | "created_by" | "created_at" | "updated_at">) => void
}

export function NewTicketForm({ isOpen, onClose, onSubmit }: NewTicketFormProps) {
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        status: "open",
      })
      setSubject("")
      setDescription("")
      setPriority("medium")
      onClose()
    } catch (error) {
      console.error("Failed to create ticket:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Create Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "low", label: "Low", color: "text-tertiary" },
                { value: "medium", label: "Medium", color: "text-amber-600" },
                { value: "high", label: "High", color: "text-destructive" },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value as "low" | "medium" | "high")}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    priority === p.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className={`material-symbols-outlined text-sm ${p.color}`}>
                    {p.value === "high" ? "priority_high" : p.value === "medium" ? "remove" : "priority_low"}
                  </span>
                  <span className="ml-2 text-sm">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your issue..."
              rows={5}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!subject.trim() || !description.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
