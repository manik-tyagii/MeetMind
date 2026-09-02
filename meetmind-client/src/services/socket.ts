import { io, Socket } from "socket.io-client";
import type { User } from "../types";

const configuredSocketURL = import.meta.env.VITE_API_URL?.replace(
  /\/api\/?$/,
  "",
);
const SOCKET_URL =
  configuredSocketURL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://meetainotes.onrender.com");

let socket: Socket | null = null;

export type AvatarSyncPayload = {
  userId: string;
  avatar: string;
  avatarType: string;
  name: string;
  email: string;
};

export const connectSocket = (): Socket => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    path: "/socket.io",
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onAvatarUpdated = (
  handler: (payload: AvatarSyncPayload) => void,
): (() => void) => {
  const client = connectSocket();
  client.on("user:avatar:updated", handler);
  return () => {
    client.off("user:avatar:updated", handler);
  };
};

export const applyAvatarSyncToUser = (
  current: User | null,
  payload: AvatarSyncPayload,
): User | null => {
  if (!current || current.id !== payload.userId) return current;
  return {
    ...current,
    avatar: payload.avatar,
    avatarType: payload.avatarType as User["avatarType"],
    name: payload.name,
  };
};
