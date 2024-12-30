const socketIo = require("socket.io");

import { socketConnected } from "../services/connection/socketConnected";
import { socketDisconnected } from "../services/connection/socketDisconnected";
import { socketUserLogout } from "../services/connection/socketUserLogout";

let io;

export const initSocket = async (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("loginEvent", (data) => {
      socketConnected({
        connectionId: socket.id,
        userId: data?.message,
      });
    });

    socket.on("logoutEvent", (data) => {
      socketUserLogout({
        connectionId: socket.id,
        userId: data?.message,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      socketDisconnected({ connectionId: socket.id });
    });
  });
};

export const postMessage = async (entry) => {
  try {
    let { connectionId, eventName, eventData } = entry;
    // let dataString = JSON.stringify(eventData);
    if (io) {
      io.to(connectionId).emit(eventName, eventData);
    }
  } catch (error) {
    console.error("post message error", error);
  }
};
