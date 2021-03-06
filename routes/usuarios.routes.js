/**
 *  Hospitales
 *  ruta: /api/usuarios
 */

 
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarAdminRole } = require('../middlewares/validar-jwt');
const { validarAdminRoleMismoUsuario } = require('../middlewares/validar-jwt');

const { getUsuario, postUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuario.controllers');

const router = Router();

router.get('/', 
                [
                    validarJWT,
                    validarAdminRole
                ], 
            getUsuario);

router.post('/', 
                [   
                    check('nombre', 'el nombre es obligatorio').not().isEmpty(), 
                    check('password', 'el password es obligatorio').not().isEmpty(), 
                    check('email', 'el email es obligatorio').isEmail(),
                    validarCampos
                ] , 
            postUsuario );

router.put('/:id', 
                [
                    validarJWT,
                    validarAdminRoleMismoUsuario,
                    check('nombre', 'el nombre es obligatorio').not().isEmpty(), 
                    check('email', 'el email es obligatorio').isEmail(),
                    check('role', 'el rol es obligatorio').not().isEmpty(),
                ] , 
                updateUsuario);

                
router.delete('/:id', 
                [
                    validarJWT,
                    validarAdminRole
                ] ,
                deleteUsuario);

module.exports = router;