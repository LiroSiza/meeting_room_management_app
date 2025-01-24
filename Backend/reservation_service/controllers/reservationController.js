
const Reservation= require("../models/Reservation");

// METODOS QUE SE COMUNICAN CON LA DB

// Mostrar todas las reservaciones
exports.showReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// Mostrar una reservacion mediante su id
exports.showOneReservation = async (req, res) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){  // En caso de que no exista la reservacion
            res.status(404).json({ msg: 'Reservacion no encontrada' })
        }

        res.json(reservation);

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// Crear una reservacion
exports.createReservation = async (req, res) => {
    try {
        let reservation = new Reservation(req.body);
        await reservation.save();
        res.json(reservation);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

// Eliminar una reservacion
exports.deleteReservation = async (req, res) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){  // En caso de que no exista la reservacion
            res.status(404).json({ msg: 'Reservacion no encontrada' })
        }

        // Accion para borrar en la DB usando su id
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Sala eliminado con exito' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}

exports.updateReservation = async (req, res) => {
    try {
        let { idSala, usuario, fechaInicio, fechaFin, estado } = req.body; // reestructuracion para obtener los parametros enviados en el body
        let reservation = await Reservation.findById(req.params.id);  // Obtener los parametros enviados en la url

        if(!reservation){  // En caso de que no exista la reservacion
            res.status(404).json({ msg: 'Reservacion no encontrada' });
        }

        // Actualizar usando los nuevos valores
        reservation.idSala = idSala;
        reservation.usuario = usuario;
        reservation.fechaInicio = fechaInicio;
        reservation.fechaFin = fechaFin;
        reservation.estado = estado;

        // Se busca la sala mediante su id y se le pasa el objeto con los nuevos valores
        reservation = await Reservation.findOneAndUpdate({ _id: req.params.id}, reservation, { new: true })
        
        // Mensaje al usuario
        res.json(reservation);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
}