/*
    Conexion a la base de datos en la nube (mongoDB) utilizando variables de entorno
    usando el archivo variables.env
*/

const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const connectDB = async (params) => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("DB Connected - reservation service");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB