// ---------------------------------------------------------------------------
// Platform schema types (shared across all tenants)
// ---------------------------------------------------------------------------

export type PlanType = "trial" | "starter" | "pro" | "business"

export type OrganizationStatus = "active" | "suspended" | "archived"

export interface Organization {
  id: string
  name: string
  slug: string
  schema_name: string
  plan: PlanType
  status: OrganizationStatus
  settings: Record<string, unknown>
  group_id: string | null
  created_at: string
  updated_at: string
}

export type MemberRole =
  | "owner"
  | "admin"
  | "receptionist"
  | "housekeeper"
  | "accountant"

export interface Membership {
  id: string
  user_id: string
  organization_id: string
  role: MemberRole
  created_at: string
}

export interface Invitation {
  id: string
  organization_id: string
  email: string
  role: MemberRole
  token: string
  expires_at: string
  created_at: string
}

export interface PlatformAdmin {
  id: string
  user_id: string
  created_at: string
}

// ---------------------------------------------------------------------------
// Tenant schema types (duplicated per tenant schema)
// ---------------------------------------------------------------------------

export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance"
export type RoomType = "standard" | "suite" | "apartment"

export interface Room {
  id: string
  number: string
  floor: number
  type: RoomType
  capacity: number
  rate: number
  status: RoomStatus
  created_at: string
}

export interface Guest {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  id_type: string | null
  id_number: string | null
  notes: string | null
  created_at: string
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"

export type ReservationSource = "direct" | "online" | "booking" | "airbnb"

export interface Reservation {
  id: string
  room_id: string
  guest_id: string
  check_in: string
  check_out: string
  status: ReservationStatus
  source: ReservationSource
  total_amount: number
  notes: string | null
  created_by: string | null
  created_at: string
}

export type PaymentMethod =
  | "cash"
  | "airtel_money"
  | "moov_money"
  | "card"

export type PaymentStatus = "completed" | "pending" | "refunded"

export interface Payment {
  id: string
  reservation_id: string | null
  amount: number
  method: PaymentMethod
  reference: string | null
  status: PaymentStatus
  received_by: string | null
  created_at: string
}

export interface Invoice {
  id: string
  reservation_id: string | null
  invoice_number: string
  total_amount: number
  pdf_path: string | null
  created_at: string
}

export interface StockItem {
  id: string
  name: string
  category: string | null
  quantity: number
  alert_threshold: number
  unit: string
  created_at: string
}

export type StockMovementType = "in" | "out"

export interface StockMovement {
  id: string
  item_id: string
  type: StockMovementType
  quantity: number
  reason: string | null
  performed_by: string | null
  created_at: string
}

export interface Employee {
  id: string
  full_name: string
  role: string
  phone: string | null
  is_active: boolean
  created_at: string
}

export type TaskType = "cleaning" | "maintenance" | "inspection"
export type TaskStatus = "pending" | "in_progress" | "completed"

export interface Task {
  id: string
  room_id: string | null
  employee_id: string | null
  type: TaskType
  status: TaskStatus
  due_date: string | null
  completed_at: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Settings & Support types
// ---------------------------------------------------------------------------

export interface HotelFloor {
  id: string
  name: string
  floor_number: number
  room_count: number
  created_at: string
}

export interface RoomCategory {
  id: string
  name: string
  subtitle: string | null
  status_label: string
  base_rate: number
  capacity: number
  room_numbers: string[]
  created_at: string
}

export type ServiceCategory = "wellness" | "logistics" | "gastronomy"

export interface Service {
  id: string
  name: string
  category: ServiceCategory
  description: string
  price_label: string
  image_url: string | null
  is_available: boolean
  created_at: string
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high"

export interface SupportTicket {
  id: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  ticket_number: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export type MessageRole = "tenant" | "agent"

export interface SupportMessage {
  id: string
  ticket_id: string
  sender_role: MessageRole
  content: string
  created_at: string
}

export type AppointmentStatus = "pending" | "confirmed" | "completed"

export interface SupportAppointment {
  id: string
  scheduled_at: string
  topic: string
  status: AppointmentStatus
  created_by: string | null
  created_at: string
}
