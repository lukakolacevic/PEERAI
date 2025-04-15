export interface Message {
  timestamp: string;
  sender: string;
  content: string;
}

export interface Chat {
  chat_id: string;
  user_ids: string[];
  chat_history: Message[];
}

export interface FlaggedChats {
  flaggedChats: Chat[];
}
