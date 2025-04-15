"use client";

import React from "react";
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

type SuspiciousChatsProps = {
  onChatSelect: (chatId: string) => void;
  selectedChatId: string;
};

const SuspiciousChats: React.FC<SuspiciousChatsProps> = ({ onChatSelect, selectedChatId }) => {
  const handleRowClick = (id: string) => {
    onChatSelect(id);
  };

  return (
    <Card>
      <CardHeader>
      <CardTitle style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}>
  Suspicious Chats
</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto overflow-y-auto h-64">
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-50 text-sm font-semibold text-gray-700 border-b">
                <TableHead className="whitespace-nowrap px-4 py-2">Chat ID</TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">Time</TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">Risk Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                key="3"
                onClick={() => handleRowClick("3")}
                className={`hover:bg-blue-50 focus:bg-blue-50 transition-colors cursor-pointer ${
                  selectedChatId === "3" ? "bg-blue-100" : ""
                }`}
              >
                <TableCell className="px-4 py-2">3</TableCell>
                <TableCell className="px-4 py-2">Nov 10, 2024, 06:05:12 PM</TableCell>
                <TableCell className="px-4 py-2">Phishing, Suspicious Payment Offers</TableCell>
              </TableRow>
              <TableRow
                key="5"
                onClick={() => handleRowClick("5")}
                className={`hover:bg-blue-50 focus:bg-blue-50 transition-colors cursor-pointer ${
                  selectedChatId === "5" ? "bg-blue-100" : ""
                }`}
              >
                <TableCell className="px-4 py-2">5</TableCell>
                <TableCell className="px-4 py-2">Jan 25, 2026, 02:12:05 PM</TableCell>
                <TableCell className="px-4 py-2">
                  Too-Good-To-Be-True Deals, Urgency and Pressure
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuspiciousChats;
