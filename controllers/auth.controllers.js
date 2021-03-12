const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

};

const loginGoogle = async(req, res = response) => {

    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if(!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                img: picture,
                password: '#$%',
                google: true
            });
        }
        else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

         // Generar el TOKEN - JWT
         const token = await generarJWT(usuarioDB.id, usuarioDB.role, usuarioDB.email);

        return res.json({
            ok: true,
            token
        });
    }       
    catch(error){
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'el token no es correcto'
        });
    } 

};

const loginRenew = async(req, res = response) => {

    try {
        const uid = req.uid;
        
         // Generar el TOKEN - JWT
         const token = await generarJWT(uid);

        return res.json({
            ok: true,
            token
        });
    }       
    catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error del servidor'
        });
    } 
}

module.exports = {
    login,
    loginGoogle,
    loginRenew
};