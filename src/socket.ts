import { AppState } from "react-native";
import { io, Socket } from "socket.io-client";
import { baseURL } from "./services/api";
import type { AppStateStatus } from "react-native";

let socket: Socket;
let appState: AppStateStatus = AppState.currentState;

const initSocket = () => {
  if (!socket || !socket.connected) {
    socket = io(baseURL, {
      transports: ["websocket"], // use websocket only
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
};

const handleAppStateChange = (nextAppState: AppStateStatus) => {
  console.log("appstate", appState, nextAppState);
  if (appState.match(/inactive|background/) && nextAppState === "active") {
    console.log("App has come to the foreground, reconnecting socket...");
    if (!socket?.connected) {
      console.log("connecting");
      socket.connect(); // reconnect if needed
    }
  }
  appState = nextAppState;
};

AppState.addEventListener("change", handleAppStateChange);

// Initialize socket on app start
initSocket();

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error(
      "Socket has not been initialized. Call initSocket() first."
    );
  }
  return socket;
};
