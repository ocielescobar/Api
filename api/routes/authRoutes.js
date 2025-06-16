const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/login', authController.login);
router.get('/user', authController.getUser);
router.get('/user/:id', authController.getUserById);
router.patch('/user/:id', authController.actualizarParcialUsuario);
router.delete('/user/:id', authController.deleteUser);
router.post('/register', authController.createUser);


module.exports = router;
