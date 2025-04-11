import { io } from "socket.io-client";
import { baseURL } from "./services/api";

const socket = io(`${baseURL}`);

export default socket;
