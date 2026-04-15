"use client"

import { useState } from "react"
import type { SupportAppointment } from "@/types/database"

interface AppointmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (appointment: Omit<SupportAppointment, "id" | "created_by" | "created_at">) => void
}

export function AppointmentForm({ isOpen, onClose, onSubmit }: AppointmentFormProps) {
  const [scheduledAt, setScheduledAt] = useState("")
  const [topic, setTopic] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set default to tomorrow at 10:00 AM
  useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)
    setScheduledAt(tomorrow.toISOString().slice(0, 16))
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduledAt || !topic.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        scheduled_at: scheduledAt,
        topic: topic.trim(),
        status: "pending",
      })
      setTopic("")
      onClose()
    } catch (error) {
      console.error("Failed to create appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Schedule a Success Call</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select a time that works for you (30-minute slots)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">Select a topic</option>
              <option value="Platform Overview">Platform Overview</option>
              <option value="Advanced Features">Advanced Features</option>
              <option value="Integration Help">Integration Help</option>
              <option value="Billing Questions">Billing Questions</option>
              <option value="Performance Review">Performance Review</option>
              <option value="Custom Workflow">Custom Workflow Setup</option>
              <option value="Other">Other (please specify)</option>
            </select>
          </div>

          {topic === "Other" && (
            <div>
              <label className="block text-sm font-medium mb-2">Please specify</label>
              <input
                type="text"
                placeholder="What would you like to discuss?"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">What to expect</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 30-minute one-on-one session</li>
              <li>• Screen sharing capabilities</li>
              <li>• Personalized recommendations</li>
              <li>• Q&A with our experts</li>
            </ul>
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
              disabled={!scheduledAt || !topic.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Scheduling..." : "Book Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
