import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Notification } from "../types/conversation";
import useAuth from "../hooks/useAuth";
import {
  fetchNotificationsService,
  markNotificationService,
} from "../services/notification";
import { getSocket } from "../socket";

interface IDotNotification {
  user: string;
  type: string;
  createdAt: string;
}

type ContextType = {
  notifications: Notification[];
  dotNotifications: IDotNotification[];
  loading: boolean;
  error: string;
  fetchNotifications: (filter?: "all" | "read" | "unread") => Promise<boolean>;
  markNotification: (id: string) => Promise<boolean>;
  markDotAsRead: (id: string) => void;
};

// Create notification context
export const NotificationContext = createContext<ContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen, user } = useAuth();

  const socket = getSocket();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dotNotifications, setDotNotifications] = useState<IDotNotification[]>(
    []
  );
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

  const markDotAsRead = (type: string) => {
    if (socket) {
      socket.emit(
        "readDot",
        { type, userId: user?._id },
        (response: { success: boolean; error?: string }) => {
          if (!response.success) {
            console.error(
              "Failed to mark notification as read:",
              response.error
            );
          }
        }
      );
    }
  };

  useEffect(() => {
    socket.on("newNotification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    socket.on(
      "notificationsUpdated",
      (updatedNotifications: IDotNotification[]) => {
        setDotNotifications(updatedNotifications);
      }
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        loading,
        error,
        fetchNotifications,
        notifications,
        dotNotifications,
        markNotification,
        markDotAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
