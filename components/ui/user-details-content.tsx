"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import ChatDetails from "@/components/ui/chatdetails";
import data from "@/database/users.json";
import chatData from "@/database/flaggedChats.json";
import analyzedChatData from "@/database/analyzedChats.json";

// Helper function to format timestamp
const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Ensures AM/PM formatting
  });
};

// Helper function to get risk categories for a specific chat
const getRiskCategories = (chatId: string): string => {
  const analyzedChat = analyzedChatData.analyzedChats.find(
    (chat) => chat.chat_id === parseInt(chatId, 10)
  );

  if (!analyzedChat) {
    return "None";
  }

  // Combine flags from flaggedMessages and flaggedUsers
  const allFlags = [
    ...(analyzedChat.flaggedMessages || []).flatMap((msg) => msg.flag),
    ...(analyzedChat.flaggedUsers || []).flatMap((user) => user.flag),
  ];

  // Deduplicate flags
  const uniqueFlags = Array.from(new Set(allFlags));

  return uniqueFlags.join(", ");
};

const SuspiciousChats = ({
  userId,
  onChatSelect,
}: {
  userId: number;
  onChatSelect: (chatId: string) => void;
}) => {
  // Filter chats where the user is involved
  const userChats = chatData.flaggedChats.filter((chat) =>
    chat.user_ids.includes(userId.toString())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious Chats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto overflow-y-auto h-64">
          <Table className="min-w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-50 text-sm font-semibold text-gray-700 border-b">
                <TableHead className="whitespace-nowrap px-4 py-2">
                  Chat ID
                </TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">
                  Time
                </TableHead>
                <TableHead className="whitespace-nowrap px-4 py-2">
                  Risk Category
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userChats.map((chat) => (
                <TableRow
                  key={chat.chat_id}
                  className="hover:bg-blue-50 focus:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => onChatSelect(chat.chat_id)}
                >
                  <TableCell className="px-4 py-2">{chat.chat_id}</TableCell>
                  <TableCell className="px-4 py-2">
                    {chat.chat_history.length > 0
                      ? formatDateTime(chat.chat_history[0].timestamp)
                      : "No messages"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {getRiskCategories(chat.chat_id)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

interface UserDetailsContentProps {
  userId: number;
}

export default function UserDetailsContent({
  userId,
}: UserDetailsContentProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const user = data.users.find((u) => parseInt(u.id, 10) === userId);

  if (!user) {
    return <div>User not found</div>;
  }

  const calculateUserFlags = (
    flags: Record<string, string | undefined>
  ): number => {
    let totalFlags = 0;
    for (const key in flags) {
      const value = flags[key];
      if (value) {
        const [flagCount] = value.split("/");
        totalFlags += parseInt(flagCount, 10) || 0;
      }
    }
    return totalFlags;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6">
        <Navbar
          cards={[
            {
              title: "Flags",
              value: calculateUserFlags(user.flags),
              description: "Flagged chats",
            },
            {
              title: "Flagged conversations",
              value: user.flagged_conversations,
              description: `${user.flagged_conversations}/13 chats`,
            },
            { title: "Avg risk score", value: user.risk_score },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow p-6">
        <div className="rounded-lg p-4">
          <SuspiciousChats userId={userId} onChatSelect={setSelectedChatId} />
        </div>
        <div className="rounded-lg">
          {selectedChatId && <ChatDetails chatId={selectedChatId} />}
        </div>
      </div>
    </div>
  );
}
