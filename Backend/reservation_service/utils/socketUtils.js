const emitReservationsUpdate = async (io) => {
    const Reservation = require('../models/Reservation');
    const reservations = await Reservation.find(); // Obtiene todas las salas actualizadas
    io.emit('reservationsUpdated', reservations); // Emite el evento
  };
  
module.exports = { emitReservationsUpdate };
  