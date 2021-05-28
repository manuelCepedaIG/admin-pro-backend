const { response } = require('express');
const MedicoDTO = require('../models/medico');
const UsuarioDTO = require('../models/usuario');

const getMedicos = async(req, res = response) => {
    
    try {
        const medicoList  = await MedicoDTO.find()
                                            .populate('usuario', 'nombre img')
                                            .populate('medico', 'nombre img');
        res.status(200).json({
            ok: true,
            medicos : medicoList,
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }  
};

const getMedicoById = async(req, res = response) => {

    const id = req.params.id;
    try {
        const medico = await MedicoDTO.findById(id)
                                        .populate('usuario', 'nombre img')
                                        .populate('medico', 'nombre img');
        res.status(200).json({
            ok: true,
            medico : medico,
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }      
};

const crearMedico = async(req, res = response) => {
    const { medico , email} = req.body;

    try {
        const existeEmail = await UsuarioDTO.findOne({ email });
        if(!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }


        const existeMedico = await MedicoDTO.findOne({ medico });
        if(existeMedico) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico ya está registrado'
            });
        }

        const medicoRes = new MedicoDTO(medico);

        await medicoRes.save();

        res.status(200).json({
            ok: true,
            msg: 'medico creado',
            medico : medicoRes,
        });

    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
};

const actualizarMedico = async(req, res = response) => {
    //const uid = req.params.id;
    const { medico } = req.body;
    try {
        const medicoDB = await MedicoDTO.findById(medico._id);
        if(!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con esos datos'
            });
        }

        const medicoActualizado = await MedicoDTO.findByIdAndUpdate(medico._id, medico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperando, revisar logs'
        });
    }
};

const borrarMedico = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const medicoDB = await MedicoDTO.findById(uid);
        if(!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese uid'
            });
        }

        await MedicoDTO.findByIdAndDelete(uid);


        res.json({
            ok: true,
            msg: 'Medico eliminado' 
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
    getMedicos,
    getMedicoById,
    crearMedico,
    actualizarMedico,
    borrarMedico
};