"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@supabase/supabase-js"
import type { SupportMessage } from "@/types/database"

interface LiveChatProps {
  ticketId: string
  isOpen: boolean
  onClose: () => void
}

export function LiveChat({ ticketId, isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    if (!isOpen || !ticketId) return

    // Initialize Supabase client for realtime
    supabaseRef.current = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/support/tickets/${ticketId}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages || [])
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()

    // Subscribe to real-time messages
    const channel = supabaseRef.current
      .channel(`ticket:${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload: { new: SupportMessage }) => {
          const newMsg: SupportMessage = payload.new
          setMessages((prev) => [...prev, newMsg])
        }
      )
      .subscribe((status: string) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      channel.unsubscribe()
    }
  }, [ticketId, isOpen])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending || !ticketId) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      })

      if (response.ok) {
        setNewMessage("")
      } else {
        console.error("Failed to send message")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-card rounded-2xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined text-primary">forum</span>
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                isConnected ? "bg-tertiary" : "bg-destructive"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold">Live Support</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <span className="material-symbols-outlined text-4xl">chat_bubble</span>
            <p className="mt-2">Start a conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_role === "tenant" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender_role === "tenant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isSending || !isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending || !isConnected}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  )
}
