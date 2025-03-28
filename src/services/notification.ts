import { Notification } from "../types/conversation";
import { getBackendErrorMessage } from "../utils/error";
import api from "./api";

export const fetchNotificationsService = async (
  filter: "all" | "read" | "unread" = "all"
) => {
  try {
    const url = "/notifications" + `?filter=${filter}`;

    const resp: Notification[] = await api.get(url);

    // if (!resp.status) {
    //   // Handle Fetch products error, e.g., display an error message to the user
    //   throw new Error("Fetch products failed: " + getBackendErrorMessage(resp))
    // }

    return resp;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch products error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
};

export const markNotificationService = async (id: string) => {
  try {
    const url = `/notifications/${id}/mark-read`;

    const resp: Notification = await api.post(url);

    // if (!resp.status) {
    //   // Handle Fetch products error, e.g., display an error message to the user
    //   throw new Error("Fetch products failed: " + getBackendErrorMessage(resp))
    // }

    return resp;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch products error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
};
