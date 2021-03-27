const { response } = require('express');
const UsuarioDTO = require('../models/usuario');
const HospitalDTO = require('../models/hospital');
const MedicoDTO = require('../models/medico');

const getParameter = async(req, res = response) => {
    const searchParameter = req.params.search;
    const regex = new RegExp(searchParameter, 'i');

    const [ usuariosList, hospitalesList, medicosList ] = await Promise.all([
        UsuarioDTO.find({ nombre: regex }),
        HospitalDTO.find({ nombre: regex }),
        MedicoDTO.find({ nombre: regex }),
    ]);
    res.status(200).json({
        ok: true,
        usuarios : usuariosList,
        hospitales : hospitalesList,
        medicos : medicosList,
    });
};

const getCollection = async(req, res = response) => {
    const searchModel = req.params.modelType;
    const searchParameter = req.params.search;
    const regex = new RegExp(searchParameter, 'i');
    let data = [];

    switch(searchModel) {
        case 'medicos':
            data = await MedicoDTO.find({ nombre: regex });
        break;
        case 'hospitales':
            data = await HospitalDTO.find({ nombre: regex });
        break;
        case 'usuarios':
            data = await UsuarioDTO.find({ nombre: regex });
        break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'no se entiende el tipo de colección a consultar' 
            });
    }
    
    res.status(200).json({
        ok: true,
        msg: 'busqueda encontrada con exito',
        result: data
    });
};

module.exports = {
    getParameter,
    getCollection
};