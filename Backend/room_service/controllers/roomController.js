const Room = require("../models/Room");

// METODOS QUE SE COMUNICAN CON LA DB

// Mostrar todas las salas
exports.showRooms = async (req, res) => {
    try {
        const room = await Room.find();
        res.json(room);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// Mostrar una sala mediante su id
exports.showOneRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id );

        if(!room){  // En caso de que no exista la sala
            res.status(404).json({ msg: 'No existe la sala' });
        }

        res.json(room);
        console.log(room);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
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
        res.send(room);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// Borrar una sala
exports.deleteRoom = async (req, res) => {
    try {
        let room = await Room.findById(req.params.id);

        if(!room){  // En caso de que no exista la sala
            res.status(404).json({ msg: 'No existe la sala' });
        }

        // Accion para borrar en la DB usando su id
        await Room.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Sala eliminado con exito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// Actualizar una sala
exports.updateRoom = async (req, res) => {
    try {
        const { nombre, estado, capacidad } = req.body; // reestructuracion para obtener los parametros enviados en el body
        let room = await Room.findById(req.params.id);  // Obtener los parametros enviados en la url

        if(!room){  // En caso de que no exista la sala
            res.status(404).json({ msg: 'No existe la sala' });
        }

        // Actualizar usando los nuevos valores
        room.nombre = nombre;
        room.estado = estado;
        room.capacidad = capacidad;

        // Se busca la sala mediante su id y se le pasa el objeto con los nuevos valores
        room = await Room.findOneAndUpdate({ _id: req.params.id}, room, { new: true })

        // Mensaje al usuario
        res.json(room);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}