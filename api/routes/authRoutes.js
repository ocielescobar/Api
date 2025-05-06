const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para obtener un usuario por correo (GET)
router.get('/user', authController.getUser);

// Ruta para obtener un usuario por ID (GET)
router.get('/user/:id', authController.getUserById);

// Ruta para modificar usuario parcialmente
router.patch('/user/:id', authController.actualizarParcialUsuario);

// Ruta para eliminar usuario
router.delete('/user/:id', authController.deleteUser);

module.exports = router;
