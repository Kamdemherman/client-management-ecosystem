import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/user";
import type { Role } from "@/types/role";

const Users = () => {
  const [users] = useState<(User & { role: Role["name"] })[]>([
    {
      id: "1",
      email: "super@example.com",
      name: "Super Admin",
      role: "super_admin",
      createdAt: new Date(),
      isActive: true,
    },
    {
      id: "2",
      email: "admin@example.com",
      name: "Local Admin",
      role: "admin",
      createdAt: new Date(),
      isActive: true,
    },
    {
      id: "3",
      email: "employee@example.com",
      name: "Employee",
      role: "employee",
      createdAt: new Date(),
      isActive: true,
    },
  ]);

  const getRoleBadgeVariant = (role: Role["name"]) => {
    switch (role) {
      case "super_admin":
        return "default";
      case "admin":
        return "secondary";
      case "employee":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoleLabel = (role: Role["name"]) => {
    switch (role) {
      case "super_admin":
        return "Super Administrateur";
      case "admin":
        return "Administrateur Local";
      case "employee":
        return "Employé";
      default:
        return role;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
          <Button>Nouvel Utilisateur</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "success" : "destructive"}>
                    {user.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm">
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Users;