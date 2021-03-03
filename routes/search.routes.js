/**
 *  Search - Busqueda
 *  ruta: /api/search/
 */

 
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getParameter,
    getCollection
} = require('../controllers/search.controllers');

const router = Router();

router.get('/:search', validarJWT, getParameter );
router.get('/:model/:search', validarJWT, getCollection );

module.exports = router;