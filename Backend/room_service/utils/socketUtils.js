const emitRoomsUpdate = async (io) => {
    const Room = require('../models/Room');
    const rooms = await Room.find(); // Obtiene todas las salas actualizadas
    io.emit('roomsUpdated', rooms); // Emite el evento
  };
  
module.exports = { emitRoomsUpdate };
  