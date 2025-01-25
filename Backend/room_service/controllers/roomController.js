const Room = require("../models/Room");
const { emitRoomsUpdate } = require('../utils/socketUtils');

// METODOS QUE SE COMUNICAN CON LA DB

// Mostrar todas las salas
exports.showRooms = async (req, res) => {
    try {
        const room = await Room.find();
        return res.json(room);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener las salas' });
    }
}

// Mostrar una sala mediante su id
exports.showOneRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id );

        if(!room){  // En caso de que no exista la sala
            return res.status(404).json({ msg: 'No existe la sala' });
        }

        return res.json(room);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al obtener la sala' });
    }
}

// Crear una sala
exports.createRoom = async (req, res) => {
    try {
        let room;

        // Se crea la sala usando el modelo
        room = new Room(req.body);

        // Se guarda la sala en la base de datos
        await room.save();

        // Emite las actualizaciones
        const io = req.app.get('socketio');
        await emitRoomsUpdate(io);

        return res.send(room);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al crear la sala' });
    }
}

// Borrar una sala
exports.deleteRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);

        if(!room){  // En caso de que no exista la sala
            return res.status(404).json({ msg: 'No existe la sala' });
        }

        // Accion para borrar en la DB usando su id
        await Room.findByIdAndDelete(req.params.id);

        // Emitir actualizaciones
        const io = req.app.get('socketio');
        await emitRoomsUpdate(io);

        return res.json({ msg: 'Sala eliminada con exito' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al eliminar la sala' });
    }
}

// Actualizar una sala
exports.updateRoom = async (req, res) => {
    try {
        const { nombre, estado, capacidad } = req.body; // reestructuracion para obtener los parametros enviados en el body
        let room = await Room.findById(req.params.id);  // Obtener los parametros enviados en la url

        if(!room){  // En caso de que no exista la sala
            return res.status(404).json({ msg: 'No existe la sala' });
        }

        // Actualizar usando los nuevos valores
        room.nombre = nombre;
        room.estado = estado;
        room.capacidad = capacidad;

        // Se busca la sala mediante su id y se le pasa el objeto con los nuevos valores
        room = await Room.findOneAndUpdate({ _id: req.params.id}, room, { new: true })

        // Emitir actualizaciones
        const io = req.app.get('socketio');
        await emitRoomsUpdate(io);

        // Mensaje al usuario
        return res.json(room);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error al eliminar la sala' });
    }
}