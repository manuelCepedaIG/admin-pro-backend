const fs = require('fs');

const UsuarioDTO = require('../models/usuario');
const MedicoDTO = require('../models/medico');
const HospitalDTO = require('../models/hospital');

const borrarImagen = (pathViejo) => {
    if(fs.existsSync(pathViejo)){
        fs.unlinkSync(pathViejo);
    }
};

const actualizarImagen = async(tipo, id, nombreArchivo) => {
    let pathViejo = '';
    switch(tipo) {
        case 'medicos':
            const medico = await MedicoDTO.findById(id);
            if(!medico) {
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;
        
        case 'hospitales':
            const hospital = await HospitalDTO.findById(id);
            if(!hospital) {
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;
        
        case 'usuarios':
            const usuario = await UsuarioDTO.findById(id);
            if(!usuario) {
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
        
    }
};


module.exports = {
    actualizarImagen,
}