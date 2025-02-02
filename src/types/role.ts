export type UserRole = "super_admin" | "admin" | "employee";

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: string[];
  description: string;
}