const { response } = require('express');
const HospitalDTO = require('../models/hospital');

const getHospitales = async(req, res = response) => {
    const hospitalList  = await HospitalDTO.find().populate('usuario', 'nombre img');
    res.status(200).json({
        ok: true,
        hospitales : hospitalList,
    });
};

const crearHospital = async(req, res = response) => {
    const uid = req.uid;
    const hospital = new HospitalDTO({
        usuario: uid,
        ...req.body
    });

    console.log(uid);

    try {

        const hospitalDB = await hospital.save();

        res.status(200).json({
            ok: true,
            msg: 'hospital creado',
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin, existe un error'
        });
    }  
};

const actualizarHospital = async(req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'actualizarHospital'
    });
};

const borrarHospital = async(req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'borrarHospital'
    });
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
};