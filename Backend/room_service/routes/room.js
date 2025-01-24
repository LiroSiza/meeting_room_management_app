// Rutas para las salas
const express = require('express')
const router = express.Router();
const roomsController = require('../controllers/roomController');

// ruta 
router.get('/', roomsController.showRooms);
router.get('/:id', roomsController.showOneRoom);
router.post('/', roomsController.createRoom);
router.put('/:id', roomsController.updateRoom);
router.delete('/:id', roomsController.deleteRoom);


module.exports = router;