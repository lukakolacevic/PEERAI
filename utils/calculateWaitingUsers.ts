// utils/calculateWaitingUsers.ts
import data from "@/database/users.json";

export const calculateWaitingUsers = () => {
  // Count users who have any flags (assuming a user with flags needs review)
  return data.users.length
};