/**
 *  Uploads
 *  ruta: /api/upload/
 */

 
const { Router } = require('express');
const expfileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/upload.controllers');

const router = Router();
router.use(expfileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload );
router.get('/:tipo/:img', validarJWT, retornaImagen );

module.exports = router;