// rotas do pedido

const express = require('express');
const router = express.Router();

const controllerUsuario = require('../controllers/usuarios_controller');

router.post('/cadastro', controllerUsuario.cadastrarUsuario);


router.post('/login', controllerUsuario.login);


module.exports = router;

