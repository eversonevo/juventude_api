const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('../mysql');

// *********************************************************************************************

// CADASTRA USUÁRIO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL
exports.cadastrarUsuario = async (req, res, next) => {

try {
    const queryEmail = "SELECT * FROM usuarios WHERE email=?;";
    const resultEmail = await mysql.execute(queryEmail,[
        req.body.email
    ]); 
    
    if (resultEmail.length > 0){
        return res.status(401).send({mensagem: 'Usuário já cadastrado!'});
    }else{
       bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
           
        if (errBcrypt){
              return res.status(500).send({error: errBcrypt}); 
           }
           
           const query = "INSERT INTO usuarios (nome, email, password) VALUES (?,?,?);";
           const result = await mysql.execute(query,[
               req.body.nome,
               req.body.email,
               hash
            ]);
            
            const response = {
                mensagem: 'Usuário criado com sucesso!',
                usuarioCriado: {
                    id_usuario: result.insertId,
                    nome: req.body.nome,
                    email: req.body.email
                }                                
            }

            return res.status(201).send(response);

       });

    }
} catch (error) {
    return res.status(500).send({error: error});
}   
    
}

/* 
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
 */

// *********************************************************************************************

// LOGIN USUÁRIO - USANDO ASYNC / AWAIT - FUNCTION SÓ PARA ACESSAR MYSQL E TOKEN DE 1H
exports.login = async (req, res, next) => {

    try {
        const query = 'SELECT * FROM usuarios WHERE email=?;';
        const result = await mysql.execute(query,[
            req.body.email
        ]);

        if(result.length < 1){
            return res.status(401).send({mensagem: 'Falha na autenticação!'});
        }

        bcrypt.compare(req.body.password, result[0].password, (error, resUser)=>{
            
            if (error){ return res.status(401).send({mensagem: 'Falha na autenticação!'})}

            if (resUser){
                
                const token = jwt.sign({
                    id_usuario: result[0].id_usuario,
                    nome: result[0].nome,
                    email: result[0].email
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
        
    } catch (error) {
        return res.status(500).send({error:error});
    }
}

/* 
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
   
} */