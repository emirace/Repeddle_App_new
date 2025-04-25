import { IUser } from "./user";

export type IConversation = {
  _id: string;
  members: string[];
  conversationType: string;
  needRespond: boolean;
  guest: boolean;
  canReply: boolean;
  createdAt: string;
  updatedAt: string;
  productId?: string;
};

export type SearchResult = {
  image: string;
  username: string;
  _id: string;
};

export type ConversationMessage = {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  image: string;
  type: string;
  emailMessages: string[];
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  message: string;
  read: boolean;
  link: string;
  image?: string
  user: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};
