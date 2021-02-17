const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'verifique los campos: correo' //tener en cuenta no ser especifico en campos por tema de hacking
            });
        }

        // Verificar pass
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'verifique los campos: pass' //tener en cuenta no ser especifico en campos por tema de hacking
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id, usuarioDB.role, usuarioDB.email);


        res.json({
            ok: true,
            token
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }

}

module.exports = {
    login
}