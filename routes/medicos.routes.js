/**
 *  Hospitales
 *  ruta: /api/medicos
 */

 
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getMedicos,
    getMedicoById,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medico.controllers');

const router = Router();

router.get('/', validarJWT, getMedicos );

router.post('/', 
                [
                    validarJWT,
                    check('medico', 'El nombre del medico es necesario').not().isEmpty(),
                    //check('hospital', 'el hospital debe tener un id valido').isMongoId(),
                    validarCampos
                ] ,  
                crearMedico
             );

router.put('/:id', 
                validarJWT,
                actualizarMedico
                );

                
router.delete('/:id',  
                validarJWT,
                borrarMedico);

                
router.get('/:id',  
            validarJWT,
            getMedicoById);


module.exports = router;