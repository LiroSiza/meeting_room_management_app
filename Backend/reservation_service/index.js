// Importa las dependencias necesarias
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db_connection');

// Crea una aplicación de Express
const app = express();

// Define un puerto
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Permite analizar JSON en el cuerpo de las solicitudes
app.use(cors()); // Habilita CORS para todas las rutas | Desde cualquier origen
/*const corsOptions = {
    origin: '*', // Permite solicitudes desde cualquier origen
    credentials: false, // No permite envío de cookies o credenciales
};
app.use(cors(corsOptions));
*/

// Conectar a la Base de Datos
connectDB();

// Rutas
app.use('/api/reservation', require('./routes/reservation'));

// Ruta básica
app.get('/', (req, res) => {
    res.send('Servidor reservation_service corriendo');
});

// Ruta básica para probar la conexión
app.get('/api/data', (req, res) => {
    res.json({ message: 'Conexión exitosa desde Node.js' });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
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