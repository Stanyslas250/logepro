import type { MemberRole } from "@/types/database"

type Permission =
  | "rooms:read"
  | "rooms:write"
  | "rooms:status"
  | "reservations:read"
  | "reservations:write"
  | "cashier:read"
  | "cashier:write"
  | "stock:read"
  | "stock:write"
  | "personnel:read"
  | "personnel:write"
  | "personnel:tasks"
  | "config:write"

const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  owner: [
    "rooms:read",
    "rooms:write",
    "rooms:status",
    "reservations:read",
    "reservations:write",
    "cashier:read",
    "cashier:write",
    "stock:read",
    "stock:write",
    "personnel:read",
    "personnel:write",
    "personnel:tasks",
    "config:write",
  ],
  admin: [
    "rooms:read",
    "rooms:write",
    "rooms:status",
    "reservations:read",
    "reservations:write",
    "cashier:read",
    "cashier:write",
    "stock:read",
    "stock:write",
    "personnel:read",
    "personnel:write",
    "personnel:tasks",
    "config:write",
  ],
  receptionist: [
    "rooms:read",
    "reservations:read",
    "reservations:write",
    "cashier:read",
    "cashier:write",
  ],
  housekeeper: ["rooms:status", "personnel:tasks"],
  accountant: [
    "rooms:read",
    "reservations:read",
    "cashier:read",
    "cashier:write",
    "stock:read",
    "stock:write",
    "personnel:read",
  ],
}

export function hasPermission(
  role: MemberRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: MemberRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function isAdminRole(role: MemberRole): boolean {
  return role === "owner" || role === "admin"
}
