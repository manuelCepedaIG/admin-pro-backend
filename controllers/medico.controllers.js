const { response } = require('express');
const MedicoDTO = require('../models/medico');

const getMedicos = async(req, res = response) => {
    const medicoList  = await MedicoDTO.find()
                                        .populate('usuario', 'nombre img')
                                        .populate('hospital', 'nombre img');
    res.status(200).json({
        ok: true,
        medicos : medicoList,
    });
};

const crearMedico = async(req, res = response) => {
    const uid = req.uid;
    const medico = new MedicoDTO({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.status(200).json({
            ok: true,
            msg: 'medico creado',
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin, existe un error'
        });
    }
};

const actualizarMedico = async(req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'actualizarMedico'
    });
};

const borrarMedico = async(req, res = response) => {
    res.status(200).json({
        ok: true,
        msg: 'borrarMedico'
    });
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
};