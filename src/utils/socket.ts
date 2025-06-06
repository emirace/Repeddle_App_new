import  { getSocket } from "../socket";

const socket =getSocket()
export const markMessagesAsRead = (conversationId: string, userId: string) => {
  socket.emit("markAsRead", { conversationId, userId });
};
