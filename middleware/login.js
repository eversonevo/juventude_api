// verificará token

const jwt = require('jsonwebtoken');


// quanto vc determina que é obrigatório fazer o uso do token (cadastrar produto exemplo)
exports.required = (req, res, next) => {
   try {
    // vai pegar o token passado via headers Authorization Bearer    
    var token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        console.log('aquiiii');
        next();
    } catch (error) {
        return res.status(401).send({mensagem: 'Falha na autenticação!'});
    }
}

// quanto não é necessário ser obrigatório fazer o uso do token (mas caso algum momento precise
// do usuario, já terá seus dados que são carregados no token)
exports.optional = (req, res, next) => {
    try {
     // vai pegar o token passado via headers Authorization Bearer    
     var token = req.headers.authorization.split(' ')[1];
         const decode = jwt.verify(token, process.env.JWT_KEY);
         req.usuario = decode;
         console.log('aquiiii');
         next();
     } catch (error) {
         next();
     }
 }