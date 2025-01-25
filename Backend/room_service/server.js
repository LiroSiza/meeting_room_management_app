const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Crea el servidor HTTP
const server = http.createServer(app);

// Configura WebSocket con socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware para compartir `io` con la app
app.set('socketio', io);

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
