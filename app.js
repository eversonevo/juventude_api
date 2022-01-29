const express = require('express');
const app = express();
const morgan = require('morgan');
const bpdyParser = require('body-parser');

//rotas
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

const bodyParser = require('body-parser');

//controle de CORS, cabeçalhos  IMPORTANTÍSSIMO
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); // permissão de controle de acesso todos
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requerested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

// monitora as rotas em desenvolvimento
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));  //torna pasta acessível em todo sistema
app.use(bodyParser.urlencoded({extended: false})); // apenas dados simples
app.use(bodyParser.json()); // só aceitará json

app.use('/produtos',rotaProdutos);
app.use('/pedidos',rotaPedidos);
app.use('/usuarios',rotaUsuarios);

// quando não encontra rota
app.use((req,res,next)=>{
    const erro = new Error('NÃO ENCONTRADO!');
    erro.status = 404;
    next(erro);
});

// achou erro vai para próxima função
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    return res.send({
        erro:{
            mensagem:error.message
        }
    });
});

module.exports = app;