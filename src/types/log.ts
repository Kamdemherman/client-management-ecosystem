export type LogType = "info" | "warning" | "error" | "success";
export type LogAction = "login" | "create" | "update" | "delete" | "export";
export type LogModule = "users" | "inventory" | "orders" | "complaints" | "settings";

export interface Log {
  id: string;
  type: LogType;
  action: LogAction;
  module: LogModule;
  message: string;
  userId: string;
  userName: string;
  agencyId?: string;
  agencyName?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}