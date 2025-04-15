"use client";

import React from "react";
import { calculateTotalFlags } from "@/utils/calculateTotalFlags";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import data from "@/database/users.json";

type SuspiciousUsersProps = {
  onUserSelect: (userId: string) => void;
  selectedUserId: string;
};

const SuspiciousUsers: React.FC<SuspiciousUsersProps> = ({ onUserSelect, selectedUserId }) => {
  const handleRowClick = (id: string) => {
    onUserSelect(id);
  };

  return (
    <Card>
      <CardHeader>
      <CardTitle style={{ fontSize: "20px", fontWeight: "medium", color: "#333" }}>
Flagged Users</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto overflow-y-auto h-64">
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-50 text-sm font-semibold text-gray-700 border-b">
                <TableHead className="whitespace-nowrap px-4 py-2">Username</TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">Risk score</TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">Account location</TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">Flags</TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">Last flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users.map((user) => {
                const totalFlags = calculateTotalFlags(user.flags);
                return (
                  <TableRow
                    key={user.id}
                    onClick={() => handleRowClick(user.id)}
                    className={`hover:bg-blue-50 focus:bg-blue-50 transition-colors cursor-pointer ${
                      selectedUserId === user.id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <TableCell className="px-4 py-2">{user.name}</TableCell>
                    <TableCell className="px-4 py-2">{user.risk_score}</TableCell>
                    <TableCell className="px-4 py-2">{user.account_location}</TableCell>
                    <TableCell className="px-4 py-2">{totalFlags}</TableCell>
                    <TableCell className="px-4 py-2">{user.last_flag_timestamp}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuspiciousUsers;

