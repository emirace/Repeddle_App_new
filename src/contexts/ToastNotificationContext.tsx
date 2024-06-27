import React, { createContext, useState, ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
}
interface INotification {
  id: string;
  message: string;
  action?: () => void;
  buttonText?: string;
  error?: boolean;
}

interface ToastNotificationContextProps {
  addNotification: (data: AddProps) => void;
  removeNotification: (id: string) => void;
  notifications: INotification[];
}

interface AddProps {
  message: string;
  buttonText?: string;
  error?: boolean;
  action?: () => void;
}

export const ToastNotificationContext = createContext<
  ToastNotificationContextProps | undefined
>(undefined);

export const ToastNotificationProvider: React.FC<Props> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const notificationIdCounter = useRef(0);

  const addNotification = (data: AddProps) => {
    const { message, action, buttonText, error } = data;
    const id = notificationIdCounter.current.toString();
    notificationIdCounter.current += 1;

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, message, action, buttonText, error },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <ToastNotificationContext.Provider
      value={{ addNotification, removeNotification, notifications }}
    >
      {children}
    </ToastNotificationContext.Provider>
  );
};
