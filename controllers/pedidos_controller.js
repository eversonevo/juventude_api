const mysql = require('../mysql').pool;

//retorna todos os pedidos
exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            `SELECT    pedidos.id_pedido, 
                       pedidos.quantidade, 
                       produtos.id_produto,
                       produtos.nome,
                       produtos.preco
            FROM       pedidos
            INNER JOIN produtos
            ON         produtos.id_produto = pedidos.id_produto;`,

            (error,result,fields) => {
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                // aprimorando retorno, importante para APIS públicas
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
                                url: 'http://localhost:3000/pedidos/'+ped.id_pedido
                            }
                        }
                    }),
                }
                
                return res.status(200).send(response);
            }

        );


    });
}

// insere um pedido
exports.inserePedidos = (req, res, next) => {

    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}
        conn.query('SELECT * FROM produtos WHERE id_produto = ?',[req.body.id_produto],
        (error, result, fields)=>{
            if (error){ return res.status(500).send({error:error})}
            //conn.release(); não pode usar dois release ao mesmo tempo, sempre ativa depois de todas as conexões

            if (result.length === 0){
                return res.status(404).send({
                    mensagem:'Produto não encontrado'
                });
            }

            conn.query(
                'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                [req.body.id_produto,req.body.quantidade],
                (error,result,fields)=>{
                   conn.release(); // usando release para duas conexões, chama apenas uma vez e no fim
                    if (error){ return res.status(500).send({error:error})}
                    // aprimorando retorno, importante para APIS públicas
    
                    const response = {
                        mensagem: 'Pedido criado com sucesso!',
                                pedidoCriado:{
                                    id_pedido: result.id_pedido,
                                    id_produto: req.body.id_produto,
                                    quantidade: req.body.quantidade,
                                    request: {
                                        tipo: 'GET',
                                        description: 'Retorna todos os pedidos',
                                        url: 'http://localhost:3000/pedidos'
                                    }
                                }
                    }
    
                    return res.status(201).send(response);
    
                }
            );

        }
        )

    });

}

//retorna um pedido
exports.getIdPedido = (req, res, next) => {

    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],

            (error,result,fields) => {
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                if (result.length === 0)
                {
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
                                    url: 'http://localhost:3000/pedidos'
                                }
                            }
                }

                return res.status(200).send(response);
            }

        );


    });
    
}

//deletar um pedido
exports.removePedido = (req, res, next) => {
    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}

        conn.query(
            `DELETE FROM pedidos 
                WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error,result,fields)=>{
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                const response = {
                    mensagem: 'Pedido removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        description: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos/',
                        body:{
                            "id_produto": 'number',
                            "quantidade": 'number'
                        }
                    }

                }

                res.status(202).send(response);

            }
        );
    });
}