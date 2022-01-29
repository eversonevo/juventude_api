const mysql = require('../mysql');

// *********************************************************************************************

// CONSULTA PEDIDOS - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.getPedidos = async (req, res, next) => {

    try {

        const query = `SELECT    pedidos.id_pedido, 
                          pedidos.quantidade, 
                          produtos.id_produto,
                          produtos.nome,
                          produtos.preco
                        FROM       pedidos
                        INNER JOIN produtos
                        ON         produtos.id_produto = pedidos.id_produto;`;
        const result = await mysql.execute(query)
        const response = {
            "quantidade": result.length,
            "pedidos": result.map(ped => {
                return {
                    "id_pedido": ped.id_pedido,
                    "quantidade": ped.quantidade,

                    produto:{
                        "id_produto": ped.id_produto,
                        "nome":ped.nome,
                        "preco":ped.preco
                    },
                    request: {
                        tipo: 'GET',
                        description: 'Retorna detalhes de um pedido',
                        url: process.env.URL_API + 'pedidos/'+ped.id_pedido
                    }
                }
            }),
        }
        
        return res.status(200).send(response);

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}; 


// *********************************************************************************************

// INSERE PEDIDO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.inserePedidos = async (req, res, next) => {
    try {
        
        const queryProd = "SELECT * FROM produtos WHERE id_produto = ?;";
        const resultProd = await mysql.execute(queryProd, [
            req.body.id_produto
       ]);

       if (resultProd.length === 0){
           return res.status(404).send({
               mensagem:'Produto não encontrado'
           });
       }

       const query = "INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);";
       const result = await mysql.execute(query,[
            req.body.id_produto,
            req.body.quantidade
       ]);

       const response = {
        mensagem: 'Pedido criado com sucesso!',
                pedidoCriado:{
                    id_pedido: result.id_pedido,
                    id_produto: req.body.id_produto,
                    quantidade: req.body.quantidade,
                    request: {
                        tipo: 'GET',
                        description: 'Retorna todos os pedidos',
                        url: process.env.URL_API + 'pedidos'
                    }
                }
    }

    return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({error:error});
    }
}


// *********************************************************************************************

// CONSULTA UM PEDIDO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.getIdPedido = async (req, res, next) => {
    
    try {

        const query = "SELECT * FROM pedidos WHERE id_pedido = ?;";
        const result = await mysql.execute(query,[req.params.id_pedido]);
        if (result.length === 0) {
            return res.status(404).send({
                mensagem: "Não foi encontrado nenhum pedido com este ID"
            });
        }
        const response = {
            pedido:{
                id_pedido: result[0].id_pedido,
                id_produto: result[0].id_produto,
                quantidade: result[0].quantidade,
                request: {
                    tipo: 'GET',
                    description: 'Retorna todos os pedidos',
                    url: process.env.URL_API + 'pedidos'
                }
            }
        }

        return res.status(200).send(response);
        
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

// REMOVE PEDIDO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.removePedido = async (req, res, next) => {

    try {
        const query = "DELETE FROM pedidos WHERE id_pedido = ?;";
        const result = await mysql.execute(query,[req.body.id_pedido]);
        const response = {
            mensagem: 'Pedido removido com sucesso!',
            request: {
                tipo: 'POST',
                description: 'Insere um pedido',
                url: process.env.URL_API + 'pedidos/',
                body: {
                    id_produto: 'number',
                    quantidade: 'number'
                }
            }
    
        }
    
        res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }

}

