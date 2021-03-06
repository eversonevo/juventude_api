
const mysql = require('../mysql');
const multer = require('multer'); //para trabalhar com imagens

// *********************************************************************************************

// CONSULTA PRODUTOS - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.getProdutos = async (req, res, next) => {

    try {

        const query = "SELECT * FROM produtos;";
        const result = await mysql.execute(query)
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
                        url: process.env.URL_API + 'produtos/' + prod.id_produto
                    }
                }
            }),
        }

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};


// *********************************************************************************************

// INSERE PRODUTO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.insereProduto = async (req, res, next) => {
    try {
        const query = "INSERT INTO produtos (nome, preco,imagem_produto) VALUES (?,?,?);";
        const result = await mysql.execute(query, [
            req.body.nome,
            req.body.preco,
            req.file.path
        ]);

        const response = {
            mensagem: 'Produto inserido com sucesso!',
            produtoCriado: {
                id_produto: result.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem_produto: req.file.path,
                request: {
                    tipo: 'POST',
                    description: 'Insere um produto',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }
        return res.status(201).send(response);

    } catch (error) {
        return res.status(500).send({error:error});
    }
}


// *********************************************************************************************

// CONSULTA UM PRODUTO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.getIdProduto = async (req, res, next) => {
    
    try {
        console.log("oi");

        const query = "SELECT * FROM produtos WHERE id_produto = ?;";
        const result = await mysql.execute(query,[req.params.id_produto]);
        console.log(result.length);
        if (result.length === 0) {
            return res.status(404).send({
                mensagem: "Não foi encontrado nenhum produto com este ID"
            });
        }
        const response = {
            produto: {
                id_produto: result[0].id_produto,
                nome: result[0].nome,
                preco: result[0].preco,
                imagem_produto: result[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    description: 'Retorna um produto',
                    url: process.env.URL_API + 'produtos'
                }
            }
        }

        return res.status(200).send(response);

        
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}


// *********************************************************************************************

// ALTERA PRODUTO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.updateProduto = async (req, res, next) => {

    try {
        const query = "UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?";
        await mysql.execute(query,[
            req.body.nome, 
            req.body.preco, 
            req.body.id_produto,
        ]);
        const response = {
            mensagem: 'Produto alterado com sucesso!',
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'GET',
                    description: 'Retorna detalhes de um produto',
                    url: process.env.URL_API + 'produtos/' + req.body.id_produto
                }
            }
        }

        return res.status(202).send(response);

    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

// *********************************************************************************************

// REMOVE PRODUTO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.removeProduto = async (req, res, next) => {

    try {
        const query = "DELETE FROM produtos WHERE id_produto = ?;";
        const result = await mysql.execute(query,[req.body.id_produto]);
        const response = {
            mensagem: 'Produto removido com sucesso!',
            request: {
                tipo: 'POST',
                description: 'Insere um produto',
                url: process.env.URL_API + 'produtos/',
                body: {
                    nome: 'String',
                    preco: 'double number'
                }
            }
    
        }
    
        res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }

}
