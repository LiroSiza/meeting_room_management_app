const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: 'disponible'  // Si no se proporciona un valor para "estado", se establecerá como "disponible"
    },
    capacidad: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Room', RoomSchema);