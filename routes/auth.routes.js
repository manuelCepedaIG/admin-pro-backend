/*

    RUTA: /api/login

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginGoogle, loginRenew } = require('../controllers/auth.controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router();

router.post('/', 
        [
            check('email', 'el email es obligatorio').isEmail(),
            check('password', 'el password es obligatorio').not().isEmpty(),
            validarCampos
        ],
        login
);

router.post('/google', 
        [
            check('token', 'el token de google es obligatorio').not().isEmpty(),
            validarCampos
        ],
        loginGoogle
);

router.get('/renew', 
        [validarJWT],
        loginRenew
);

module.exports = router;