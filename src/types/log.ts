export type LogType = "info" | "warning" | "error";

export interface Log {
  id: string;
  type: LogType;
  message: string;
  userId?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}