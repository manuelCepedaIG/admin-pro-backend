const { response } = require('express');
const HospitalDTO = require('../models/hospital');
const UsuarioDTO = require('../models/usuario');

const getHospitales = async(req, res = response) => {
    const hospitalList  = await HospitalDTO.find().populate('usuario', 'nombre img');
    res.status(200).json({
        ok: true,
        hospitales : hospitalList,
    });
};

const crearHospital = async(req, res = response) => {
    const { nombre , email} = req.body;

    try {
        const existeEmail = await UsuarioDTO.findOne({ email });
        if(!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }


        const existeHospital = await HospitalDTO.findOne({ nombre });
        if(existeHospital) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital ya está registrado'
            });
        }

        const hospital = new HospitalDTO(req.body);

        await hospital.save();

        res.status(200).json({
            ok: true,
            msg: 'hospital creado',
            hospital : hospital,
        });

    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
};

const actualizarHospital = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const hospitalDB = await HospitalDTO.findById(uid);
        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese uid'
            });
        }
        const campo = req.body;
        const hospitalActualizado = await HospitalDTO.findByIdAndUpdate(uid, campo, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
};

const borrarHospital = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const hospitalDB = await HospitalDTO.findById(uid);
        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese uid'
            });
        }

        await HospitalDTO.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Hospital eliminado' 
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
};