// Importa el módulo mongoose, que es una biblioteca para trabajar con bases de datos MongoDB en Node.js.
const mongoose = require('mongoose');

// Define un esquema (schema) para la colección "Reservation" en la base de datos MongoDB.
// El esquema describe cómo deben estructurarse los documentos en esta colección.
const ReservationSchema = mongoose.Schema({
    idSala: {
        type: Number,
        required: true
    },
    usuario: {
        type: String,
        required: true 
    },
    fechaInicio: {
        type: String,
        required: true 
    },
    fechaFin: {
        type: String,
        required: true 
    },
    estado: {
        type: String,       // Especifica que el valor debe ser una cadena de texto.
        required: true,     // Indica que este campo es obligatorio.
        default: 'activo'  // Valor por defecto: Si no se proporciona un valor, se establece como "activo".
    }
});

// Exporta el modelo "Reservation" basado en el esquema "ReservationSchema".
// Este modelo se utilizará para interactuar con la colección "Reservation" en MongoDB.
module.exports = mongoose.model('Reservation', ReservationSchema);
