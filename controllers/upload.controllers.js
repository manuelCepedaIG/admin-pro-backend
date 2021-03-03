const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async(req, res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    // validar tipo
    const tiposValidos = ['hospitales','medicos','usuarios'];
    if( !tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es del tipo valido'
        });
    }

    // validar existe archivo
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se subio ningún archivo'
        });
    }

    // procesar el archivo
    const file = req.files.imagen;
    const shortName = file.name.split('.'); // ex: archivo.1.2.jpg
    const extension = shortName[ shortName.length - 1 ];

    // validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'archivo tiene una extension invalida'
        });
    }

    // generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${extension}`;

    // crear el path donde guarda imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // mover imagen a ruta especificada
    file.mv(path, (err) => {
        if(err){
            return res.status(500).json({
                ok: false,
                msg: 'error al mover la imagen'
            });
        }

        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.status(200).json({
            ok: true,
            msg: 'archivo subido exitosamente',
            nombreArchivo
        });
    });
};

const retornaImagen = (req, res = response) => {{
    const tipo = req.params.tipo;
    const img = req.params.img;
    let pathImg = path.join( __dirname, `../uploads/${tipo}/${img}` );

    //imagen por defecto
    if(!fs.existsSync(pathImg)) {
        pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
    }
    res.sendFile(pathImg);
    
}};

module.exports = {
    fileUpload,
    retornaImagen
};