const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('../mysql').pool;

exports.cadastrarUsuario = (req, res, next)=>{

    mysql.getConnection((error, conn)=> {
        if (error){ return res.status(500).send({error:error})}
        conn.query('SELECT * FROM usuarios WHERE email=?',[req.body.email],
        (error, results)=>{
            if (error){ return res.status(500).send({error:error})}
            if (results.length > 0){
                return res.status(401).send({mensagem: 'Usuário já cadastrado!'});
            }else{
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash)=>{
                    if (errBcrypt){
                        return res.status(500).send({error: errBcrypt});
                    }
                    conn.query(`INSERT INTO usuarios (nome, email, password) VALUES (?,?,?)`,
                    [req.body.nome,req.body.email,hash],
                    (error, results)=>{
        
                        conn.release();
                        if (error){
                            return res.status(500).send({error: error});
                        }
        
                        const response = {
                            mensagem: 'Usuário criado com sucesso!',
                            usuarioCriado: {
                                id_usuario: results.insertId,
                                nome: req.body.nome,
                                email: req.body.email
                            }                                
                        }
        
                        if (error){res.status(500).send({error: error})}
                        return res.status(201).send(response);
        
                    }
                    );
                });
            }

        }
        );


    });

}

exports.login = (req, res, next)=>{
    mysql.getConnection((error, conn)=> {
        if (error){ return res.status(500).send({error:error})}
        const query = 'SELECT * FROM usuarios WHERE email=?;';
        conn.query(
            query,
            [req.body.email],
            (error, results, fields)=>{
                conn.release();
                if (error){ return res.status(500).send({error:error})}

                if(results.length < 1){
                    return res.status(401).send({mensagem: 'Falha na autenticação!'});
                }

                bcrypt.compare(req.body.password, results[0].password, (error, result)=>{
                    if (error){ return res.status(401).send({mensagem: 'Falha na autenticação!'})}

                    if (result){
                        
                        const token = jwt.sign({
                            id_usuario: results[0].id_usuario,
                            nome: results[0].nome,
                            email: results[0].email
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        });

                        return res.status(200).send({mensagem: 'Autenticado com sucesso!',
                                                    token: token});
                    }

                    return res.status(401).send({mensagem: 'Falha na autenticação!'});

                });

            }
        );
    });
   
}