const Reservation= require("../models/Reservation");
const { emitReservationsUpdate } = require('../utils/socketUtils');

// METODOS QUE SE COMUNICAN CON LA DB

// Mostrar todas las reservaciones
exports.showReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        return res.json(reservations);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Error al obtener las reservaciones' });
    }
}

// Mostrar una reservacion mediante su id
exports.showOneReservation = async (req, res) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){  // En caso de que no exista la reservacion
            return res.status(404).json({ msg: 'Reservacion no encontrada' })
        }

        return res.json(reservation);

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Error al obtener la reservacion' });
    }
}

// Crear una reservacion
exports.createReservation = async (req, res) => {
    try {
        let reservation = new Reservation(req.body);
        await reservation.save();

        // Emite las actualizaciones
        const io = req.app.get('socketio');
        await emitReservationsUpdate(io);

        return res.json(reservation);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Error al crear la reservacion' });
    }
}

// Eliminar una reservacion
exports.deleteReservation = async (req, res) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){  // En caso de que no exista la reservacion
            return res.status(404).json({ msg: 'Reservacion no encontrada' })
        }

        // Accion para borrar en la DB usando su id
        await Reservation.findByIdAndDelete(req.params.id);

        // Emite las actualizaciones
        const io = req.app.get('socketio');
        await emitReservationsUpdate(io);

        return res.json({ msg: 'Reservacion eliminada con exito' });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Error al eliminar la reservacion' });
    }
}

// Actualizar una reservacion
exports.updateReservation = async (req, res) => {
    try {
        let { idSala, usuario, fechaInicio, fechaFin, estado } = req.body; // reestructuracion para obtener los parametros enviados en el body
        let reservation = await Reservation.findById(req.params.id);  // Obtener los parametros enviados en la url

        if(!reservation){  // En caso de que no exista la reservacion
            return res.status(404).json({ msg: 'Reservacion no encontrada' });
        }

        // Actualizar usando los nuevos valores
        reservation.idSala = idSala;
        reservation.usuario = usuario;
        reservation.fechaInicio = fechaInicio;
        reservation.fechaFin = fechaFin;
        reservation.estado = estado;

        // Se busca la sala mediante su id y se le pasa el objeto con los nuevos valores
        reservation = await Reservation.findOneAndUpdate({ _id: req.params.id}, reservation, { new: true })

        // Emite las actualizaciones
        const io = req.app.get('socketio');
        await emitReservationsUpdate(io);
        
        // Mensaje al usuario
        return res.json(reservation);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Error al actualizar la reservacion' });
    }
}