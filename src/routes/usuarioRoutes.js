const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/usuarios', usuarioController.getAllUsers);
router.get('/usuarios/:RFC', usuarioController.getUserByRFC);
router.post('/usuarios', usuarioController.createUser);
router.put('/usuarios/:RFC/bloquear', usuarioController.blockUser);
router.delete('/usuarios/:id', usuarioController.deleteUserById);

module.exports = router;
