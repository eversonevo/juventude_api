// rotas do produto

const express = require('express');
const router = express.Router();
const multer = require('multer'); //para trabalhar com imagens
const login = require('../middleware/login');
const produtos_controller = require('../controllers/produtos_controller');

// vai marcar destino e nome do arquivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        console.log(data);
        cb(null, data + file.originalname );
    }
});

// filtro apenas para aceitar apenas jpg e png
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5   // limitará em 5MB
    },
    fileFilter: fileFilter
});

//retorna todos os produtos
router.get('/', produtos_controller.getProdutos);

// insere um produto
router.post(
    '/',
    login.required, 
    upload.single('produto_imagem'), 
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