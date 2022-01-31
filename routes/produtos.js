// rotas do produto

const express = require('express');
const router = express.Router();
const multer = require('multer'); //para trabalhar com imagens
var FTPStorage = require('multer-ftp');
const login = require('../middleware/login');
const path = require('path');
const produtos_controller = require('../controllers/produtos_controller');

var upload = multer({
    storage: new FTPStorage({
      basepath: process.env.BASE_PATCH_FTP,
      filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);
      },      
      destination: function (req, file, options, callback){
        callback(null, path.join(options.basepath, 'prod_'+new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname))
     },
      ftp: {        
        host: process.env.HOST_FTP,
        secure: false, // enables FTPS/FTP with TLS
        user: process.env.USER_FTP,
        password: process.env.PASSWORD_FTP
      }
    })
  })


//retorna todos os produtos
router.get('/', produtos_controller.getProdutos);

// insere um produto
router.post(
    '/',
    login.required, 
    //this.newFileUpload,
    upload.single('imagem_produto'), 
    produtos_controller.insereProduto);

// retorna os dados de um produto pelo id
router.get('/:id_produto', produtos_controller.getIdProduto);

// altera um produto
router.patch(
    '/',
    login.required, 
    produtos_controller.updateProduto);

// deleta um produto
router.delete(
    '/',
    login.required, 
    produtos_controller.removeProduto);

module.exports = router;