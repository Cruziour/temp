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

// socket User mapping

const socketUserMapping = {};

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    io.on('connection', (socket) => {
      console.log('new connection', socket.id);
      socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;
        // new Map
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients?.forEach((clientId) => {
          io.to(clientId).emit(ACTIONS.ADD_PEER, {
            peerId: socket.id,
            createOffer: false,
            user,
          });
          socket.emit(ACTIONS.ADD_PEER, {
            peerId: clientId,
            createOffer: true,
            user: socketUserMapping[clientId],
          });
        });
        socket.join(roomId);
      });
      // handle relay ice
      socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
          peerId: socket.id,
          icecandidate,
        });
      });
      // handle relay sdp - sessionDescription {offer}
      socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
          peerId: socket.id,
          sessionDescription,
        });
      });
      // handle remove peer leaving the room
      const leaveRoom = ({ roomId }) => {
        const { rooms } = socket;
        Array.from(rooms).forEach((roomId) => {
          const clients = Array.from(
            io.sockets.adapter.rooms.get(roomId) || []
          );
          clients?.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
              peerId: socket.id,
              userId: socketUserMapping[socket.id]?._id,
            });
            socket.emit(ACTIONS.REMOVE_PEER, {
              peerId: clientId,
              userId: socketUserMapping[clientId]?._id,
            });
          });
          socket.leave(roomId);
        });
        delete socketUserMapping[socket.id];
      };
      socket.on(ACTIONS.LEAVE, leaveRoom);
      socket.on('disconnecting', leaveRoom);
    });
  })
  .catch((err) => {
    console.error(`MongoDb Failed ${err}`);
  });
