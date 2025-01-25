const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db_connection');

const app = express();

// Middlewares
app.use(express.json()); // Permite analizar JSON en el cuerpo de las solicitudes
app.use(cors()); // Habilita CORS para todas las rutas | Desde cualquier origen
/*const corsOptions = {
    origin: '*', // Permite solicitudes desde cualquier origen
    credentials: false, // No permite envío de cookies o credenciales
};
app.use(cors(corsOptions));
*/

// Conexión a la BD
connectDB();

// Rutas
app.use('/api/reservation', require('./routes/reservation'));

// Ruta básica
app.get('/', (req, res) => {
    res.send('Servidor reservations_service corriendo');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores genéricos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
