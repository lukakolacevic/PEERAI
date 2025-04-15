"use client";
import React from "react";
import Link from "next/link";
import data from "@/database/users.json";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Flag = { category: string; count: number; total: number };

type FlaggedUserCardProps = {
  id: string;
};

const FlaggedUserCard: React.FC<FlaggedUserCardProps> = ({ id }) => {
  const user = data.users.find((u) => u.id === id);

  if (!user) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="text-red-500">User not found.</div>
        </CardContent>
      </Card>
    );
  }

  const flagsArray: Flag[] = Object.entries(user.flags).map(([key, value]) => {
    const [countStr, totalStr] = value.split("/");
    const count = parseInt(countStr, 10);
    const total = parseInt(totalStr, 10);
    return { 
      category: key.replace(/_/g, " "), 
      count: isNaN(count) ? 0 : count,
      total: isNaN(total) ? 0 : total
    };
  });

  const totalFlags = flagsArray.reduce((sum, f) => sum + f.count, 0);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle style={{ fontSize: "20px", fontWeight: "medium", color: "#333" }}>
        User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <div className="flex items-baseline space-x-2">
            <span className="text-sm text-gray-500">Risk Score</span>
            <strong className="text-orange-600 text-xl">{user.risk_score}</strong>
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold">Account Location:</span>
          <span className="text-sm ml-2">{user.account_location}</span>
        </div>

        <div>
          <span className="text-sm font-semibold">Last Flag:</span>
          <span className="text-sm ml-2">{new Date(user.last_flag_timestamp).toLocaleString()}</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-md font-semibold">Flags:</h3>
          {flagsArray.map((flag, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm capitalize">{flag.category}</span>
              <span className="text-sm">{flag.count}/{flag.total}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-2 border-t">
          <span className="text-sm text-orange-600 font-semibold">Total flags</span>
          <span className="text-sm text-orange-600 font-semibold">{totalFlags}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/user-details/${id}`} passHref>
        <Button
  size="lg"
  className="w-full border border-orange-600 bg-white text-orange-600 rounded-[10px] hover:bg-[#fff4e6]"
>
  View suspicious user details
</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default FlaggedUserCard;

