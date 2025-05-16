import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ACTIONS } from './actions.js';

dotenv.config({
  path: './.env',
});

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   pingTimeout: 60000,
//   cors: {
//     origin: process.env.CORS_ORIGIN,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     credentials: true,
//   },
// });

// ✅ Map<roomId, Map<socketId, user>>
// const roomToSocketUserMap = new Map();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
    
  })
  .catch((err) => {
    console.error(`❌ MongoDB Connection Failed: ${err}`);
  });
