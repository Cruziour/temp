import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ACTIONS } from './actions.js';

dotenv.config({
  path: './.env',
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
    // ✅ Map<roomId, Map<socketId, user>>
    const roomToSocketUserMap = new Map();
    io.on('connection', (socket) => {
      console.log('🟢 New connection:', socket.id);

      // ✅ JOIN ROOM
      socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        if (!roomToSocketUserMap.has(roomId)) {
          roomToSocketUserMap.set(roomId, new Map());
        }

        // Add current socket to room user map
        roomToSocketUserMap.get(roomId).set(socket.id, user);

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        clients.forEach((clientId) => {
          const existingUser = roomToSocketUserMap.get(roomId).get(clientId);
          if (!existingUser) return;

          io.to(clientId).emit(ACTIONS.ADD_PEER, {
            peerId: socket.id,
            createOffer: false,
            user,
          });

          socket.emit(ACTIONS.ADD_PEER, {
            peerId: clientId,
            createOffer: true,
            user: existingUser,
          });
        });

        socket.join(roomId);
      });

      // ✅ RELAY ICE CANDIDATE
      socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
          peerId: socket.id,
          icecandidate,
        });
      });

      // ✅ RELAY SDP (Offer/Answer)
      socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
          peerId: socket.id,
          sessionDescription,
        });
      });

      // handle mute and unmute
      socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
          io.to(clientId).emit(ACTIONS.MUTE, {
            peerId: socket.id,
            userId,
          });
        });
      });
      socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
          io.to(clientId).emit(ACTIONS.UN_MUTE, {
            peerId: socket.id,
            userId,
          });
        });
      });

      // ✅ LEAVE ROOM
      const leaveRoom = ({ roomId }) => {
        const rooms = io.sockets.adapter.sids.get(socket.id); // All rooms socket is in

        rooms?.forEach((roomId) => {
          const clients = Array.from(
            io.sockets.adapter.rooms.get(roomId) || []
          );
          clients.forEach((clientId) => {
            socket.to(clientId).emit(ACTIONS.REMOVE_PEER, {
              peerId: socket.id,
              userId: roomToSocketUserMap.get(roomId)?.get(socket.id)?._id,
            });

            socket.emit(ACTIONS.REMOVE_PEER, {
              peerId: clientId,
              userId: roomToSocketUserMap.get(roomId)?.get(clientId)?._id,
            });
          });

          socket.leave(roomId);
          roomToSocketUserMap.get(roomId)?.delete(socket.id);
          if (roomToSocketUserMap.get(roomId)?.size === 0) {
            roomToSocketUserMap.delete(roomId);
          }
        });
      };

      // ✅ Trigger leave on manual leave or disconnect
      socket.on(ACTIONS.LEAVE, leaveRoom);
      socket.on('disconnecting', leaveRoom);
    });
  })
  .catch((err) => {
    console.error(`❌ MongoDB Connection Failed: ${err}`);
  });
