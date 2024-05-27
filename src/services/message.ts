import {
  ForwardData,
  IConversation,
  IMessage,
  MessageData,
  ReplyData,
  ConversationData,
} from "../types/message";
import { getBackendErrorMessage } from "../utils/error";
import api from "./api";

export const sendMessageService = async (
  messageData: MessageData
): Promise<IMessage> => {
  try {
    const res: { message: IMessage } = await api.post(
      `/messages/send`,
      messageData
    );
    return res.message;
  } catch (error) {
    console.log("Error sending message:", getBackendErrorMessage(error));
    throw getBackendErrorMessage(error);
  }
};

export const getMessagesService = async (
  conversationId: string
): Promise<IMessage[]> => {
  try {
    const response: { messages: IMessage[] } = await api.get(
      `/messages/${conversationId}`
    );
    return response.messages;
  } catch (error) {
    console.log("Error getting message:", getBackendErrorMessage(error));
    throw getBackendErrorMessage(error);
  }
};

export const forwardMessageService = async (
  message: ForwardData
): Promise<IMessage> => {
  try {
    const res: { message: IMessage } = await api.post(
      `/messages/forward`,
      message
    );
    return res.message;
  } catch (error) {
    console.log("Error forwarding message:", getBackendErrorMessage(error));
    throw getBackendErrorMessage(error);
  }
};

export const replyToMessageService = async (
  message: ReplyData
): Promise<IMessage> => {
  try {
    const res: { message: IMessage } = await api.post(
      `/messages/reply`,
      message
    );
    return res.message;
  } catch (error) {
    console.log("Error replying message:", getBackendErrorMessage(error));
    throw getBackendErrorMessage(error);
  }
};

export const getConversationsService = async (
  type: string
): Promise<IConversation[]> => {
  try {
    const response: { conversations: IConversation[] } = await api.get(
      `/messages/conversations/${type}`
    );
    return response.conversations;
  } catch (error) {
    console.log("Error fetching conversation:", getBackendErrorMessage(error));
    throw getBackendErrorMessage(error);
  }
};

export const startConversationService = async (
  conversationData: ConversationData
): Promise<IConversation> => {
  try {
    const res: { conversation: IConversation } = await api.post(
      `/messages/conversation`,
      conversationData
    );
    return res.conversation;
  } catch (error) {
    console.log("Error starting conversation:", getBackendErrorMessage(error));
    throw getBackendErrorMessage(error);
  }
};
