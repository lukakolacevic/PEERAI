import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FlaggedChats, Chat, Message } from "@/types/chat";
import flaggedChatsData from "@/database/flaggedChats.json";
import analyzedChatsData from "@/database/analyzedChats.json";

const flaggedChats: FlaggedChats = flaggedChatsData;

interface ChatDetailsProps {
  chatId: string;
}

const ChatDetails = ({ chatId }: ChatDetailsProps) => {
  // Find the selected chat
  const selectedChat = useMemo(
    () => flaggedChats.flaggedChats.find((chat) => chat.chat_id === chatId),
    [chatId]
  );

  // If no chat is found, show a message
  if (!selectedChat) {
    return (
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle>Chat Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Chat not found</AlertTitle>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const firstSender = useMemo(
    () => selectedChat.chat_history[0]?.sender,
    [selectedChat]
  );

  // Find the corresponding analyzed chat data
  const analyzedChat = useMemo(() => {
    return analyzedChatsData.analyzedChats.find(
      (chat) => chat.chat_id.toString() === selectedChat.chat_id
    );
  }, [selectedChat.chat_id]);

  // Create a Set of flagged message contents for efficient lookup
  const flaggedMessages = useMemo(() => {
    return new Set(
      analyzedChat?.flaggedMessages.map((msg) => msg.content) || []
    );
  }, [analyzedChat]);

  // Get unique flags from flaggedUsers
  const uniqueFlags = useMemo(() => {
    const flags = analyzedChat?.flaggedUsers.flatMap((user) => user.flag) || [];
    return [...new Set(flags)];
  }, [analyzedChat]);

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle style={{ fontSize: "20px", fontWeight: "medium", color: "#333" }}>
          Chat Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert
          variant="destructive"
          className="border-orange-500 bg-orange-50 text-orange-900"
        >
          <AlertTitle className=" text-lg space-y-2">
            <p>This chat was highlighted due to:</p>
            <ul className="list-disc pl-6">
              {uniqueFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </AlertTitle>
        </Alert>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {selectedChat.chat_history.map((message, index) => {
            const isFirstSender = message.sender === firstSender;
            const isFlagged = flaggedMessages.has(message.content);

            return (
              <div
                key={index}
                className={cn(
                  "flex",
                  isFirstSender ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    isFlagged
                      ? "bg-orange-500 text-black"
                      : isFirstSender
                      ? "bg-gray-200 text-gray-800"
                      : "bg-white text-gray-800 border border-gray-200"
                  )}
                >
                  <p className="text-md font-semibold mb-1">{message.sender}</p>
                  <p className="text-lg">{message.content}</p>
                  <p className="text-md opacity-50 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 pt-4 justify-end">
          <Button
            variant="outline"
            className="text-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-6 font-semibold"
          >
            Contact user
          </Button>
          <Button className="text-lg bg-orange-500 hover:bg-orange-600 px-8 py-6 font-semibold">
            Ban user
          </Button>
          <Button
            variant="outline"
            className="text-lg border-2 border-green-500 text-green-500 hover:bg-green-50 px-8 py-6 font-semibold"
          >
            Not a risk
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatDetails;
