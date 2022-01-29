
const mysql = require('../mysql').pool;
const multer = require('multer'); //para trabalhar com imagens


exports.getProdutos = (req, res, next) => {

    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM produtos;',

            (error,result,fields) => {
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                // aprimorando retorno, importante para APIS públicas
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                description: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/'+prod.id_produto
                            }
                        }
                    }),
                }
                
                return res.status(200).send(response);
            }

        );


    });
    
    /*res.status(200).send({
        mensagem:'Listando todos os produtos'
    });*/
}

exports.insereProduto = (req, res, next) => {

    console.log(req.file);

    /*const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };*/

    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}

        conn.query(
            'INSERT INTO produtos (nome, preco,imagem_produto) VALUES (?,?,?)',
            [req.body.nome,
                req.body.preco,
                req.file.path],
            (error,result,fields)=>{
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}
                // aprimorando retorno, importante para APIS públicas

                const response = {
                    mensagem: 'Produto inserido com sucesso!',
                            produtoCriado:{
                                id_produto: result.id_produto,
                                nome: req.body.nome,
                                preco: req.body.preco,
                                imagem_produto: req.file.path,
                                request: {
                                    tipo: 'POST',
                                    description: 'Insere um produto',
                                    url: 'http://localhost:3000/produtos'
                                }
                            }
                }

                return res.status(201).send(response);

            }
        );
    });


}

exports.getIdProduto = (req, res, next) => {

    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],

            (error,result,fields) => {
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                if (result.length === 0)
                {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado nenhum produto com este ID"
                    });
                }

                const response = {
                            produto:{
                                id_produto: result[0].id_produto,
                                nome: result[0].nome,
                                preco: result[0].preco,
                                imagem_produto: result[0].imagem_produto,
                                request: {
                                    tipo: 'GET',
                                    description: 'Retorna um produto',
                                    url: 'http://localhost:3000/produtos'
                                }
                            }
                }

                return res.status(200).send(response);
            }

        );


    });

    /*
    const id = req.params.id_produto;
    if (id === 'especial') {
        res.status(200).send({
            mensagem:'Você descobriu o ID especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem:'Produto listado com sucesso!',
            id: id
        });
    }
    */
}

exports.updateProduto = (req, res, next) => {
    
    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}

        conn.query(
            `UPDATE produtos 
                SET nome = ?,
                    preco = ?
                WHERE
                    id_produto = ?`,
            [req.body.nome,req.body.preco,req.body.id_produto],
            (error,result,fields)=>{
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                const response = {
                    mensagem: 'Produto alterado com sucesso!',
                            produtoAtualizado:{
                                id_produto: req.body.id_produto,
                                nome: req.body.nome,
                                preco: req.body.preco,
                                request: {
                                    tipo: 'GET',
                                    description: 'Retorna detalhes de um produto',
                                    url: 'http://localhost:3000/produtos/'+req.body.id_produto
                                }
                            }
                }

                return res.status(202).send(response);

            }
        );
    });
}

exports.removeProduto = (req, res, next) => {
    mysql.getConnection((error, conn)=>{
        if (error){ return res.status(500).send({error:error})}

        conn.query(
            `DELETE FROM produtos 
                WHERE id_produto = ?`,
            [req.body.id_produto],
            (error,result,fields)=>{
                conn.release(); // sempre tem que fazer isso, liberando conexão
                if (error){ return res.status(500).send({error:error})}

                const response = {
                    mensagem: 'Produto removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        description: 'Insere um produto',
                        url: 'http://localhost:3000/produtos/',
                        body:{
                            nome: 'String',
                            preco: 'double number'
                        }
                    }

                }

                res.status(202).send(response);

            }
        );
    });
}