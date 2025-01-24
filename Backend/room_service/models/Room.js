// Importa el módulo mongoose, que es una biblioteca para trabajar con bases de datos MongoDB en Node.js.
const mongoose = require('mongoose');

// Define un esquema (schema) para la colección "Room" en la base de datos MongoDB.
// El esquema describe cómo deben estructurarse los documentos en esta colección.
const RoomSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true 
    },
    estado: {
        type: String,       // Especifica que el valor debe ser una cadena de texto.
        required: true,     // Indica que este campo es obligatorio.
        default: 'disponible'  // Valor por defecto: Si no se proporciona un valor, se establece como "disponible".
    },
    capacidad: {
        type: Number,
        required: true
    },
});

// Exporta el modelo "Room" basado en el esquema "RoomSchema".
// Este modelo se utilizará para interactuar con la colección "Room" en MongoDB.
module.exports = mongoose.model('Room', RoomSchema);
