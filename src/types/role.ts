export type UserRole = "super_admin" | "admin" | "employee";

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: "inventory" | "complaints" | "orders" | "users" | "settings" | "logs";
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: Permission[];
  description: string;
}

export const DEFAULT_PERMISSIONS: Permission[] = [
  {
    id: "inventory_manage",
    name: "Gestion des stocks",
    description: "Permet de gérer les stocks et les produits",
    module: "inventory"
  },
  {
    id: "complaints_manage",
    name: "Gestion des plaintes",
    description: "Permet de gérer les plaintes clients",
    module: "complaints"
  },
  {
    id: "orders_manage",
    name: "Gestion des commandes",
    description: "Permet de gérer les commandes",
    module: "orders"
  },
  {
    id: "users_manage",
    name: "Gestion des utilisateurs",
    description: "Permet de gérer les utilisateurs",
    module: "users"
  },
  {
    id: "settings_manage",
    name: "Gestion des paramètres",
    description: "Permet de gérer les paramètres système",
    module: "settings"
  },
  {
    id: "logs_view",
    name: "Consultation des logs",
    description: "Permet de consulter les logs système",
    module: "logs"
  }
];