import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Notification } from "../types/conversation";
import useAuth from "../hooks/useAuth";
import {
  fetchNotificationsService,
  markNotificationService,
} from "../services/notification";
import { getSocket } from "../socket";

type ContextType = {
  notifications: Notification[];
  loading: boolean;
  error: string;
  fetchNotifications: (filter?: "all" | "read" | "unread") => Promise<boolean>;
  markNotification: (id: string) => Promise<boolean>;
};

// Create notification context
export const NotificationContext = createContext<ContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth();

  const socket = getSocket();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setLoading(false);

    // Check if the error indicates an invalid or expired token
    if (error === "Token expired" || error === "Invalid token") {
      setError("");
      // Set the state to open the auth error modal
      setAuthErrorModalOpen(true);
    } else {
      setError(error || "An error occurred.");
    }
  };

  // Function to fetch notifications
  const fetchNotifications = async (filter?: "all" | "read" | "unread") => {
    try {
      setError("");
      setLoading(true);
      const result = await fetchNotificationsService(filter);
      setNotifications(result);
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return false;
    }
  };

  // Function to fetch notifications
  const markNotification = async (id: string) => {
    try {
      setError("");
      setLoading(true);
      await markNotificationService(id);
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        loading,
        error,
        fetchNotifications,
        notifications,
        markNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
