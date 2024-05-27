import socket from "../socket";

export const markMessagesAsRead = (conversationId: string, userId: string) => {
  socket.emit("markAsRead", { conversationId, userId });
};
