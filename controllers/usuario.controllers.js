const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt  = require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuario = async(req, res) => {
    const user = await Usuario.find({}, 'nombre email password role google');

    res.status(200).json({
        ok: true,
        usuarios : user,
        uid: req.uid
    });
};


const postUsuario = async(req, res = response) => {
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'correo ya está registrado'
            })
        }

        const user = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(user.id, user.role, user.email);
        
        res.status(200).json({
            ok: true,
            msg: 'usuario creado',
            usuario : user,
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

const updateUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        // TODO: Validar Token y comprobar si el usuario correcto

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;
        if( usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email: email });
            if( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
}

const deleteUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        await Usuario.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Usuario eliminado' 
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
}

module.exports = {
    getUsuario,
    postUsuario,
    updateUsuario,
    deleteUsuario,
};
