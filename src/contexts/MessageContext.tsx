import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  ForwardData,
  IConversation,
  IMessage,
  MessageData,
  MessageStart,
  MessageStartResponse,
  ReplyData,
} from "../types/message";
import {
  createMessageService,
  forwardMessageService,
  getConversationsService,
  getMessagesService,
  replyToMessageService,
  sendMessageService,
} from "../services/message";
import useAuth from "../hooks/useAuth";
import socket from "../socket";
import { markMessagesAsRead } from "../utils/socket";

interface Props {
  children?: ReactNode;
}

interface MessageContextType {
  loading: boolean;
  loadingMessage: boolean;
  isTypingList: { value: boolean; id: string }[];
  error: string;
  messages: IMessage[];
  conversations: IConversation[];
  currentConversation: IConversation | null;
  currentTab: string;
  isAnimating: boolean;
  setIsAnimating: (conversation: boolean) => void;
  setCurrentTab: (conversation: string) => void;
  createMessage: (message: MessageStart) => Promise<MessageStartResponse>;
  setCurrentConversation: (conversation: IConversation | null) => void;
  sendMessage: (message: MessageData) => Promise<void>;
  getMessages: (receiver: string) => Promise<void>;
  forwardMessage: (message: ForwardData) => Promise<void>;
  replyToMessage: (message: ReplyData) => Promise<void>;
  getConversations: (type: string) => Promise<void>;
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

export const MessageProvider: React.FC<Props> = ({ children }) => {
  const { setAuthErrorModalOpen, user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [currentConversation, setCurrentConversation] =
    useState<IConversation | null>(null);
  const [currentTab, setCurrentTab] = useState<string>("Chat");
  const [isTypingList, setIsTypingList] = useState<
    { value: boolean; id: string }[]
  >([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (currentConversation) {
        await getMessages(currentConversation._id);
      }
    };
    fetchData();
  }, [currentConversation]);

  useEffect(() => {
    const handleTyping = ({
      conversationId,
      isTyping,
    }: {
      conversationId: string;
      isTyping: boolean;
    }) => {
      clearTimeout(typingTimeout);
      if (isTyping) {
        setIsTypingList((prev) => [
          ...prev,
          { value: isTyping, id: conversationId },
        ]);
        typingTimeout = setTimeout(() => {
          setIsTypingList((prev) =>
            prev.filter((type) => type.id !== conversationId)
          );
        }, 3000);
      } else {
        setIsTypingList((prev) =>
          prev.filter((type) => type.id !== conversationId)
        );
        clearTimeout(typingTimeout);
      }
    };

    let typingTimeout: NodeJS.Timeout;

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (message: IMessage) => {
      if (!message) return;
      if (message?.conversationId === currentConversation?._id) {
        setIsTypingList((prev) =>
          prev.filter((type) => type.id !== message?.conversationId)
        );
        if (!messages.find((msg) => msg._id === message._id)) {
          setIsAnimating(true);
          setTimeout(() => {
            setIsAnimating(false);
          }, 500);
          setMessages((prevMessages) => [...prevMessages, message]);
          markMessagesAsRead(currentConversation._id, user!._id);
        }
      } else {
        reloadConversation();
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [currentConversation, messages, user]);

  useEffect(() => {
    socket.on("messagesRead", () => {
      reloadConversation();
    });

    return () => {
      socket.off("messagesRead");
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setLoading(false);
    if (error === "Token expired" || error === "Invalid token") {
      setError("");
      setAuthErrorModalOpen(true);
    } else {
      setError(error || "An error occurred.");
    }
  };

  const sendMessage = async (message: MessageData) => {
    try {
      const res = await sendMessageService(message);
      setMessages((prevMessages) => [...prevMessages, res]);
      reloadConversation();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const getMessages = async (receiver: string) => {
    try {
      setLoadingMessage(true);
      const receivedMessages = await getMessagesService(receiver);
      setMessages(receivedMessages);
      setLoadingMessage(false);
    } catch (error) {
      setLoadingMessage(false);
      handleError(error);
    }
  };

  const createMessage = async (message: MessageStart) => {
    try {
      const res = await createMessageService(message);
      reloadConversation();
      return res;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const forwardMessage = async (message: ForwardData) => {
    try {
      const res = await forwardMessageService(message);
      setMessages((prevMessages) => [...prevMessages, res]);
    } catch (error) {
      handleError(error);
    }
  };

  const replyToMessage = async (message: ReplyData) => {
    try {
      const res = await replyToMessageService(message);
      setMessages((prevMessages) => [...prevMessages, res]);
    } catch (error) {
      handleError(error);
    }
  };

  const getConversations = async (type: string) => {
    try {
      setLoading(true);
      const res = await getConversationsService(type);
      setConversations(res);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const reloadConversation = async () => {
    const res = await getConversationsService(currentTab);
    setConversations(res);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        conversations,
        createMessage,
        error,
        loading,
        currentConversation,
        isTypingList,
        currentTab,
        loadingMessage,
        isAnimating,
        setIsAnimating,
        setCurrentTab,
        setCurrentConversation,
        sendMessage,
        getMessages,
        forwardMessage,
        replyToMessage,
        getConversations,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
