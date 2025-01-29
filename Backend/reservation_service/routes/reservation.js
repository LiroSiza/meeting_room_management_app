const express = require('express')
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Rutas
router.get('/', reservationController.showReservations);
router.get('/:id', reservationController.showOneReservation);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);
router.put('/deactivate/:roomId', reservationController.deactivateReservation);
router.get('/active/:idSala', reservationController.getActiveReservationByRoomId);


module.exports = router;