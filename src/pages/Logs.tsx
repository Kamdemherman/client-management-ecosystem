import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Log } from "@/types/log";
import { Badge } from "@/components/ui/badge";

const Logs = () => {
  const [logs] = useState<Log[]>([
    {
      id: "1",
      type: "info",
      message: "Utilisateur connecté",
      createdAt: new Date(),
      userId: "1",
    },
  ]);

  const getLogTypeColor = (type: Log["type"]) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Logs du Système</h1>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Utilisateur ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{format(log.createdAt, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                <TableCell>
                  <Badge variant={getLogTypeColor(log.type)}>{log.type}</Badge>
                </TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.userId || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Logs;