const { response } = require('express');
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const UsuarioDTO = require('../models/usuario');
const usuario = require('../models/usuario');

const getUsuario = async(req, res = response) => {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 3;

    const [userList, total] = await Promise.all([
        UsuarioDTO
                .find({}, 'nombre email password role google img')
                .skip(skip)
                .limit(limit),
        UsuarioDTO.countDocuments()
    ]);

    res.status(200).json({
        ok: true,
        usuarios : userList,
        total: total
    });
};


const postUsuario = async(req, res = response) => {
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await UsuarioDTO.findOne({ email });
        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'correo ya está registrado'
            })
        }

        const user = new UsuarioDTO(req.body);

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
        const usuarioDB = await UsuarioDTO.findById(uid);
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;
        if( usuarioDB.email !== email) {
            const existeEmail = await UsuarioDTO.findOne({ email: email });
            if( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        }
        else if ( usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }
        const usuarioActualizado = await UsuarioDTO.findByIdAndUpdate(uid, campos, { new: true });

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
        const usuarioDB = await UsuarioDTO.findById(uid);
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese uid'
            });
        }

        await UsuarioDTO.findByIdAndDelete(uid);


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
