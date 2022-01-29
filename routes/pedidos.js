// rotas do pedido

const express = require('express');
const router = express.Router();
const pedidos_controller = require('../controllers/pedidos_controller');


//retorna todos os pedidos
router.get('/', pedidos_controller.getPedidos);

// insere um pedido
router.post('/', pedidos_controller.inserePedidos);

// retorna os dados de um pedido pelo id
router.get('/:id_pedido', pedidos_controller.getIdPedido);

/* PEDIDO NÃO SE ALTERA  SÓ É ENVIADO APÓS CONCLUSÃO
// altera um pedido
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem:'Pedido Alterado com sucesso!'
    });
});
*/

// deleta um pedidoPedido Excluído com sucesso!
router.delete('/', pedidos_controller.removePedido);

module.exports = router;