"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import SuspiciousUsers from "@/components/ui/suspicioususers";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { calculateTotalFlags } from "@/utils/calculateTotalFlags";
import data from "@/database/users.json"; 
import { calculateWaitingUsers } from "@/utils/calculateWaitingUsers";
import FlaggedUserCard from "@/components/ui/flaggedusercard";

const totalFlags = data.users.reduce((acc, user) => acc + calculateTotalFlags(user.flags), 0);
const waitingForReview = calculateWaitingUsers();

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (data.users.length > 0 && !selectedUserId) {
      setSelectedUserId(data.users[0].id);
    }
  }, []);

  const cards = [
    { title: "Waiting for review", value: waitingForReview, description: "Flagged users" },
    { title: "Chats flagged", value: totalFlags, description: "+10% in last 24hr" },
    { title: "Cases resolved today", value: 17 },
  ];

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6">
        <Navbar cards={cards} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow p-6">
        <SuspiciousUsers onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
        {selectedUserId ? (
          <FlaggedUserCard key={selectedUserId} id={selectedUserId} />
        ) : (
          <div>No user selected</div>
        )}
      </div>
    </div>
  );
}

